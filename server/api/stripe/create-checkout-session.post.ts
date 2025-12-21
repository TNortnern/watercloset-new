// Stripe Checkout Session endpoint - redirects to Stripe hosted checkout
import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const getStripe = () => {
    if (!stripeInstance) {
      stripeInstance = new Stripe(config.stripeSecretKey, {
        apiVersion: '2024-11-20.acacia',
      })
    }
    return stripeInstance
  }

  const body = await readBody(event)
  const { bookingId, successUrl, cancelUrl } = body

  if (!bookingId) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required',
    })
  }

  try {
    // Fetch the booking from Payload API
    const booking = await $fetch<any>(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
      headers: {
        cookie: getHeader(event, 'cookie') || '',
      },
    })

    if (!booking) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found',
      })
    }

    // Fetch the property for the name
    const property = typeof booking.property === 'object'
      ? booking.property
      : await $fetch<any>(`${config.public.apiUrl}/api/properties/${booking.property}`, {
          headers: {
            cookie: getHeader(event, 'cookie') || '',
          },
        })

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Bathroom Booking: ${property.name}`,
              description: `${booking.duration} minute reservation`,
            },
            unit_amount: booking.totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${getRequestURL(event).origin}/dashboard/bookings/${bookingId}?payment=success`,
      cancel_url: cancelUrl || `${getRequestURL(event).origin}/book/${property.id}?payment=cancelled`,
      metadata: {
        bookingId: booking.id,
        propertyId: property.id,
      },
    })

    // Update booking with checkout session ID
    try {
      await $fetch(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          cookie: getHeader(event, 'cookie') || '',
          'Content-Type': 'application/json',
        },
        body: {
          stripePaymentIntentId: session.payment_intent as string,
        },
      })
    } catch {
      // Update failed but session was created - continue anyway
    }

    return {
      sessionId: session.id,
      url: session.url,
    }
  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create checkout session',
    })
  }
})

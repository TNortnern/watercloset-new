// Stripe payment intent creation endpoint
import Stripe from 'stripe'

// Lazy initialization to avoid module loading issues
let stripeInstance: Stripe | null = null

export default defineEventHandler(async (event) => {
  // Use runtime config for server-side secrets
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
  const { bookingId } = body

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

    // Check if booking already has a payment intent
    if (booking.stripePaymentIntentId) {
      // Retrieve existing payment intent to get client secret
      const paymentIntent = await getStripe().paymentIntents.retrieve(booking.stripePaymentIntentId)
      return {
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      }
    }

    // Create new payment intent if none exists
    // This handles cases where the afterChange hook failed or wasn't triggered
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: booking.totalAmount,
      currency: 'usd',
      metadata: {
        bookingId: booking.id,
        propertyId: typeof booking.property === 'object' ? booking.property.id : booking.property,
      },
    })

    // Try to update booking with payment intent ID (optional - may fail due to permissions)
    try {
      await $fetch(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          cookie: getHeader(event, 'cookie') || '',
          'Content-Type': 'application/json',
        },
        body: {
          stripePaymentIntentId: paymentIntent.id,
        },
      })
    } catch (updateError) {
      // Update failed but payment intent was created - continue anyway
      console.warn('Could not update booking with payment intent ID:', updateError)
    }

    return {
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    }
  } catch (error: any) {
    console.error('Stripe payment intent error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create payment intent',
    })
  }
})

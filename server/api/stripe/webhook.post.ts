// Stripe Webhook endpoint - handles payment confirmations
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

  // Get the raw body for signature verification
  const body = await readRawBody(event)
  const signature = getHeader(event, 'stripe-signature')

  if (!body || !signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing webhook body or signature',
    })
  }

  let stripeEvent: Stripe.Event

  try {
    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (webhookSecret) {
      stripeEvent = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
    } else if (process.env.NODE_ENV === 'production') {
      // Require webhook secret in production for security
      throw createError({
        statusCode: 500,
        message: 'Webhook secret not configured - required in production',
      })
    } else {
      // For local development/testing without signature verification
      stripeEvent = JSON.parse(body) as Stripe.Event
      console.warn('Webhook signature verification disabled - using raw event (development only)')
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    throw createError({
      statusCode: 400,
      message: `Webhook signature verification failed: ${err.message}`,
    })
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        console.log(`Payment completed for booking ${bookingId}`)

        // Update booking status to confirmed
        try {
          // Use admin auth or internal API to update booking
          await $fetch(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              // For webhook, we need admin access - use API key or internal auth
              'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
            },
            body: {
              status: 'confirmed',
              stripePaymentIntentId: session.payment_intent,
            },
          })
          console.log(`Booking ${bookingId} confirmed`)
        } catch (updateError) {
          console.error(`Failed to update booking ${bookingId}:`, updateError)
          // Don't throw - we still want to acknowledge the webhook
        }
      }
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
      const bookingId = paymentIntent.metadata?.bookingId
      console.log(`Payment intent succeeded for booking ${bookingId}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
      const bookingId = paymentIntent.metadata?.bookingId
      console.log(`Payment failed for booking ${bookingId}`)

      if (bookingId) {
        try {
          await $fetch(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
            },
            body: {
              status: 'cancelled',
              'cancellation.reason': 'Payment failed',
            },
          })
        } catch (updateError) {
          console.error(`Failed to cancel booking ${bookingId}:`, updateError)
        }
      }
      break
    }

    case 'charge.refunded': {
      const charge = stripeEvent.data.object as Stripe.Charge
      const bookingId = charge.metadata?.bookingId
      console.log(`Refund processed for booking ${bookingId}`)

      if (bookingId) {
        try {
          await $fetch(`${config.public.apiUrl}/api/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
            },
            body: {
              status: 'refunded',
              'cancellation.refundAmount': charge.amount_refunded,
            },
          })
        } catch (updateError) {
          console.error(`Failed to update refund for booking ${bookingId}:`, updateError)
        }
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`)
  }

  // Return 200 to acknowledge receipt
  return { received: true }
})

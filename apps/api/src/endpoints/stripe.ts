import type { Endpoint } from 'payload'
import Stripe from 'stripe'

// Lazy Stripe initialization
let stripeInstance: Stripe | null = null
const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeInstance
}

const getRelationshipId = (value: unknown): number | string | null => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: number | string }).id
    return typeof id === 'string' || typeof id === 'number' ? id : null
  }
  return null
}

/**
 * Create a payment intent for a booking
 * POST /api/stripe/create-payment-intent
 */
export const createPaymentIntent: Endpoint = {
  path: '/stripe/create-payment-intent',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const body = await req.json?.() as { bookingId: string } | undefined
      const bookingId = body?.bookingId

      if (!bookingId) {
        return Response.json({ error: 'bookingId is required' }, { status: 400 })
      }

      // Fetch the booking
      const booking = await payload.findByID({
        collection: 'bookings',
        id: bookingId,
        depth: 2,
      })

      if (!booking) {
        return Response.json({ error: 'Booking not found' }, { status: 404 })
      }

      // Check user owns this booking
      const bookingUserId = getRelationshipId(booking.user)
      if (!bookingUserId || (String(bookingUserId) !== String(user.id) && user.role !== 'admin')) {
        return Response.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Get the property owner's Stripe account
      const propertyId = getRelationshipId(booking.property)
      const property = propertyId
        ? await payload.findByID({ collection: 'properties', id: propertyId, depth: 1 })
        : null

      const ownerId = getRelationshipId(property?.owner)
      const owner = ownerId
        ? await payload.findByID({ collection: 'users', id: ownerId })
        : null

      const stripeAccountId = owner?.providerInfo?.stripeAccountId

      // Create or retrieve PaymentIntent
      const stripe = getStripe()
      let paymentIntent: Stripe.PaymentIntent

      if (booking.stripePaymentIntentId) {
        // Retrieve existing PaymentIntent
        paymentIntent = await stripe.paymentIntents.retrieve(booking.stripePaymentIntentId)
      } else {
        // Create new PaymentIntent
        const paymentIntentData: Stripe.PaymentIntentCreateParams = {
          amount: booking.totalAmount || 0,
          currency: 'usd',
          metadata: {
            bookingId: booking.id,
            propertyId: property?.id ? String(property.id) : '',
          },
        }

        // Add transfer data if provider has Stripe Connect
        if (stripeAccountId) {
          paymentIntentData.transfer_data = {
            destination: stripeAccountId,
            amount: booking.providerPayout || 0,
          }
        }

        paymentIntent = await stripe.paymentIntents.create(paymentIntentData)

        // Update booking with PaymentIntent ID
        await payload.update({
          collection: 'bookings',
          id: bookingId,
          data: {
            stripePaymentIntentId: paymentIntent.id,
          },
        })
      }

      return Response.json({
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      })
    } catch (error) {
      payload.logger.error(`Error creating payment intent: ${String(error)}`)
      return Response.json({ error: 'Failed to create payment intent' }, { status: 500 })
    }
  },
}

/**
 * Create Stripe Connect onboarding link for providers
 * POST /api/stripe/connect/onboard
 */
export const createConnectOnboardingLink: Endpoint = {
  path: '/stripe/connect/onboard',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'provider' && user.role !== 'admin') {
      return Response.json({ error: 'Must be a provider' }, { status: 403 })
    }

    try {
      const stripe = getStripe()
      let accountId = user.providerInfo?.stripeAccountId

      // Create Stripe Connect account if doesn't exist
      if (!accountId) {
        const account = await stripe.accounts.create({
          type: 'express',
          email: user.email,
          metadata: {
            userId: user.id,
          },
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        })

        accountId = account.id

        // Save account ID to user
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            providerInfo: {
              ...user.providerInfo,
              stripeAccountId: accountId,
            },
          },
        })
      }

      // Create onboarding link
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${process.env.FRONTEND_URL}/manage/settings?stripe=refresh`,
        return_url: `${process.env.FRONTEND_URL}/manage/settings?stripe=complete`,
        type: 'account_onboarding',
      })

      return Response.json({ url: accountLink.url })
    } catch (error) {
      payload.logger.error(`Error creating Connect onboarding link: ${String(error)}`)
      return Response.json({ error: 'Failed to create onboarding link' }, { status: 500 })
    }
  },
}

/**
 * Get Stripe Connect account status
 * GET /api/stripe/connect/status
 */
export const getConnectAccountStatus: Endpoint = {
  path: '/stripe/connect/status',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = user.providerInfo?.stripeAccountId

    if (!accountId) {
      return Response.json({
        hasAccount: false,
      })
    }

    try {
      const stripe = getStripe()
      const account = await stripe.accounts.retrieve(accountId)

      // Update user's onboarding status
      if (account.details_submitted && !user.providerInfo?.stripeOnboarded) {
        await payload.update({
          collection: 'users',
          id: user.id,
          data: {
            providerInfo: {
              ...user.providerInfo,
              stripeOnboarded: true,
            },
          },
        })
      }

      return Response.json({
        hasAccount: true,
        accountId: account.id,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        detailsSubmitted: account.details_submitted,
      })
    } catch (error) {
      payload.logger.error(`Error getting Connect account status: ${String(error)}`)
      return Response.json({ error: 'Failed to get account status' }, { status: 500 })
    }
  },
}

/**
 * Create Stripe Connect login link for providers
 * POST /api/stripe/connect/login
 */
export const createConnectLoginLink: Endpoint = {
  path: '/stripe/connect/login',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accountId = user.providerInfo?.stripeAccountId

    if (!accountId) {
      return Response.json({ error: 'No Stripe account connected' }, { status: 400 })
    }

    try {
      const stripe = getStripe()
      const loginLink = await stripe.accounts.createLoginLink(accountId)

      return Response.json({ url: loginLink.url })
    } catch (error) {
      payload.logger.error(`Error creating Connect login link: ${String(error)}`)
      return Response.json({ error: 'Failed to create login link' }, { status: 500 })
    }
  },
}

/**
 * Stripe Webhook Handler - uses Local API to bypass REST auth
 * POST /api/stripe/webhook
 */
export const stripeWebhook: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: async (req) => {
    const { payload } = req

    // Get raw body and signature
    const rawBody = await req.text?.()
    const signature = req.headers.get('stripe-signature')

    if (!rawBody || !signature) {
      return Response.json({ error: 'Missing body or signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      const stripe = getStripe()
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
      } else {
        // For testing without signature verification
        event = JSON.parse(rawBody) as Stripe.Event
        payload.logger.warn('Webhook signature verification disabled')
      }
    } catch (err: any) {
      payload.logger.error(`Webhook signature verification failed: ${String(err?.message || err)}`)
      return Response.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Handle the event
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session
          const bookingId = session.metadata?.bookingId

          if (bookingId) {
            payload.logger.info(`Payment completed for booking ${bookingId}`)

            // Use Local API to update booking (bypasses REST auth)
            await payload.update({
              collection: 'bookings',
              id: bookingId,
              data: {
                status: 'confirmed',
                stripePaymentIntentId: session.payment_intent as string,
              },
            })

            payload.logger.info(`Booking ${bookingId} confirmed`)
          }
          break
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          const bookingId = paymentIntent.metadata?.bookingId

          if (bookingId) {
            payload.logger.info(`Payment failed for booking ${bookingId}`)

            await payload.update({
              collection: 'bookings',
              id: bookingId,
              data: {
                status: 'cancelled',
              },
            })
          }
          break
        }

        case 'charge.refunded': {
          const charge = event.data.object as Stripe.Charge
          const bookingId = charge.metadata?.bookingId

          if (bookingId) {
            payload.logger.info(`Refund processed for booking ${bookingId}`)

            await payload.update({
              collection: 'bookings',
              id: bookingId,
              data: {
                status: 'refunded',
              },
            })
          }
          break
        }

        default:
          payload.logger.info(`Unhandled event type: ${event.type}`)
      }

      return Response.json({ received: true })
    } catch (error) {
      payload.logger.error(`Error processing webhook: ${String(error)}`)
      return Response.json({ error: 'Webhook handler failed' }, { status: 500 })
    }
  },
}

// Export all endpoints
export const stripeEndpoints: Endpoint[] = [
  createPaymentIntent,
  createConnectOnboardingLink,
  getConnectAccountStatus,
  createConnectLoginLink,
  stripeWebhook,
]

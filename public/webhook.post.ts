import { createError, defineEventHandler, getRequestHeader, readRawBody } from 'h3'
import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { useServerStripe } from '#stripe/server'
import type { Database } from '~/types/supabase'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing environment variables.')
}

export default defineEventHandler(async (event) => {
  // Get the signature from the headers
  const signature = getRequestHeader(event, 'stripe-signature')

  if (!signature) {
    return createError({
      statusCode: 400,
      message: 'Missing Stripe signature',
    })
  }

  try {
    // Initialize Stripe
    const stripe = useServerStripe()

    // Read the raw request body
    const rawBody = await readRawBody(event)

    if (!rawBody) {
      return createError({
        statusCode: 400,
        message: 'Missing request body',
      })
    }

    // Verify and parse the webhook
    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      STRIPE_WEBHOOK_SECRET,
    )

    // Initialize Supabase client
    const supabase = createClient<Database>(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    )

    // Handle specific webhook events
    switch (stripeEvent.type) {
      case 'account.updated': {
        const account = stripeEvent.data.object as Stripe.Account

        // Update the connected account status
        await supabase
          .from('provider_payment_accounts')
          .update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            onboarding_completed: account.details_submitted,
            account_status: account.details_submitted ? 'complete' : 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_account_id', account.id)

        break
      }

      // Handle payment_intent.succeeded
      case 'payment_intent.succeeded': {
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent

        // If this is a payment with an application fee for a connected account
        if (
          paymentIntent.transfer_data
          && paymentIntent.transfer_data.destination
          && paymentIntent.application_fee_amount
        ) {
          // Find the booking related to this payment
          const { data: booking } = await supabase
            .from('bookings')
            .select('*')
            .eq('payment_data->payment_intent_id', paymentIntent.id)
            .single()

          if (booking) {
            // Update payment transaction record
            await supabase
              .from('payment_transactions')
              .upsert({
                booking_id: booking.id,
                stripe_payment_intent_id: paymentIntent.id,
                amount: paymentIntent.amount,
                platform_fee: paymentIntent.application_fee_amount,
                provider_amount: paymentIntent.amount - paymentIntent.application_fee_amount,
                status: 'succeeded',
                metadata: paymentIntent as any,
                updated_at: new Date().toISOString(),
              })

            // Update booking status
            await supabase
              .from('bookings')
              .update({
                is_paid: true,
                status: 'confirmed',
                payment_data: {
                  ...booking.payment_data,
                  status: 'succeeded',
                },
              })
              .eq('id', booking.id)
          }
        }
        break
      }

      // Add more event handlers as needed
    }

    return { received: true }
  }
  catch (error: any) {
    console.error('Webhook error:', error)
    return createError({
      statusCode: 400,
      message: `Webhook error: ${error.message}`,
    })
  }
})

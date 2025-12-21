/**
 * Composable for Stripe payment integration
 */
import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export const useStripe = () => {
  const config = useRuntimeConfig()

  /**
   * Get Stripe instance (lazy loaded)
   */
  const getStripe = async (): Promise<Stripe | null> => {
    if (!stripePromise) {
      stripePromise = loadStripe(config.public.stripePublicKey)
    }
    return stripePromise
  }

  /**
   * Create a payment intent for a booking (for Stripe Elements)
   */
  const createPaymentIntent = async (bookingId: string) => {
    return await $fetch<{ clientSecret: string; amount: number; status: string }>('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: { bookingId },
    })
  }

  /**
   * Create a Checkout Session and redirect to Stripe (recommended for trust)
   */
  const createCheckoutSession = async (bookingId: string, successUrl?: string, cancelUrl?: string) => {
    return await $fetch<{ sessionId: string; url: string }>('/api/stripe/create-checkout-session', {
      method: 'POST',
      body: { bookingId, successUrl, cancelUrl },
    })
  }

  /**
   * Confirm payment with Stripe
   */
  const confirmPayment = async (clientSecret: string, paymentMethod: string) => {
    const stripe = await getStripe()
    if (!stripe) throw new Error('Stripe not loaded')

    return await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    })
  }

  /**
   * Create Stripe Connect onboarding link for providers
   */
  const createConnectOnboardingLink = async () => {
    return await $fetch<{ url: string }>('/api/stripe/connect/onboard', {
      method: 'POST',
    })
  }

  /**
   * Get Stripe Connect account status
   */
  const getConnectAccountStatus = async () => {
    return await $fetch<{
      hasAccount: boolean
      accountId?: string
      chargesEnabled?: boolean
      payoutsEnabled?: boolean
      detailsSubmitted?: boolean
    }>('/api/stripe/connect/status')
  }

  /**
   * Create Stripe Connect login link for providers
   */
  const createConnectLoginLink = async () => {
    return await $fetch<{ url: string }>('/api/stripe/connect/login', {
      method: 'POST',
    })
  }

  return {
    getStripe,
    createPaymentIntent,
    createCheckoutSession,
    confirmPayment,
    createConnectOnboardingLink,
    getConnectAccountStatus,
    createConnectLoginLink,
  }
}

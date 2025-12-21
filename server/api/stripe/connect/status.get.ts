// Stripe Connect account status endpoint
// TODO: Implement actual Stripe Connect integration

export default defineEventHandler(async (event) => {
  // For now, return a default "no account" status
  // This prevents errors on the manage page when Stripe isn't set up
  return {
    hasAccount: false,
    accountId: null,
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
  }
})

// Stripe Connect onboarding endpoint
// TODO: Implement actual Stripe Connect onboarding

export default defineEventHandler(async (event) => {
  throw createError({
    statusCode: 501,
    message: 'Stripe Connect onboarding not yet implemented',
  })
})

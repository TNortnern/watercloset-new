// Stripe Connect login link endpoint
// TODO: Implement actual Stripe Connect login

export default defineEventHandler(async (event) => {
  throw createError({
    statusCode: 501,
    message: 'Stripe Connect login not yet implemented',
  })
})

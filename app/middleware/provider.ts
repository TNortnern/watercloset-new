export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuth()

  // Wait for user to be fetched if not already authenticated
  if (!auth.user.value) {
    await auth.fetchUser()
  }

  if (!auth.isAuthenticated.value) {
    return navigateTo('/login')
  }

  // Allow both providers and admins to access provider pages
  if (!auth.isProvider.value && !auth.isAdmin.value) {
    return navigateTo('/')
  }
})

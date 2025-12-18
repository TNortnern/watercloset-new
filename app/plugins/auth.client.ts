/**
 * Client-side plugin to fetch user on app initialization
 */
export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()

  // Fetch user on app load
  await fetchUser()
})

/**
 * Auth composable for managing user authentication state
 */

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  bio?: string
  role: 'user' | 'provider' | 'admin'
  avatar?: {
    url: string
  }
  favorites?: string[] | Array<{ id: string }>
  providerInfo?: {
    businessName?: string
    businessType?: string
    stripeOnboarded?: boolean
    stripeAccountId?: string
    verified?: boolean
  }
  createdAt?: string
}

export const useAuth = () => {
  const user = useState<User | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isProvider = computed(() => user.value?.role === 'provider')
  const isAdmin = computed(() => user.value?.role === 'admin')

  const payload = usePayload()

  /**
   * Fetch current user on app load
   */
  const fetchUser = async () => {
    try {
      const response = await payload.me()
      user.value = response?.user || null
    } catch {
      user.value = null
    }
  }

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await payload.login(email, password)
      user.value = response.user
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Login failed',
      }
    }
  }

  /**
   * Register a new user and auto-login
   */
  const register = async (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    role?: 'user' | 'provider'
  }) => {
    try {
      // Create the user account
      await payload.register(data)

      // Auto-login to get the auth cookie
      const loginResponse = await payload.login(data.email, data.password)
      user.value = loginResponse.user

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error?.data?.message || 'Registration failed',
      }
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    try {
      await payload.logout()
    } finally {
      user.value = null
      navigateTo('/login')
    }
  }

  /**
   * Check if user has required role
   */
  const hasRole = (roles: ('user' | 'provider' | 'admin')[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  /**
   * Get user initials for avatar
   */
  const userInitials = computed(() => {
    if (!user.value) return ''
    const first = user.value.firstName?.[0] || ''
    const last = user.value.lastName?.[0] || ''
    return `${first}${last}`.toUpperCase()
  })

  /**
   * Get user display name
   */
  const displayName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`.trim()
  })

  return {
    user,
    isAuthenticated,
    isProvider,
    isAdmin,
    userInitials,
    displayName,
    fetchUser,
    login,
    register,
    logout,
    hasRole,
  }
}

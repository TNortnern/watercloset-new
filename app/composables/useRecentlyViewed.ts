/**
 * Composable for managing recently viewed properties (stored in localStorage)
 */

interface RecentProperty {
  id: string
  name: string
  location?: string
  image?: string
  price?: number
  rating?: number
  viewedAt: string
}

const RECENTLY_VIEWED_KEY = 'watercloset_recently_viewed'
const MAX_RECENT_ITEMS = 10

export const useRecentlyViewed = () => {
  const recentlyViewed = useState<RecentProperty[]>('recentlyViewed', () => [])

  /**
   * Load recently viewed from localStorage
   */
  const loadRecentlyViewed = () => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
      recentlyViewed.value = stored ? JSON.parse(stored) : []
    } catch {
      recentlyViewed.value = []
    }
  }

  /**
   * Save recently viewed to localStorage
   */
  const saveRecentlyViewed = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed.value))
  }

  /**
   * Add a property to recently viewed
   */
  const addRecentlyViewed = (property: Omit<RecentProperty, 'viewedAt'>) => {
    // Remove if already exists (to move to front)
    recentlyViewed.value = recentlyViewed.value.filter(p => p.id !== property.id)

    // Add to front
    recentlyViewed.value.unshift({
      ...property,
      viewedAt: new Date().toISOString(),
    })

    // Keep only MAX_RECENT_ITEMS
    if (recentlyViewed.value.length > MAX_RECENT_ITEMS) {
      recentlyViewed.value = recentlyViewed.value.slice(0, MAX_RECENT_ITEMS)
    }

    saveRecentlyViewed()
  }

  /**
   * Clear all recently viewed
   */
  const clearRecentlyViewed = () => {
    recentlyViewed.value = []
    saveRecentlyViewed()
  }

  /**
   * Get recently viewed properties
   */
  const getRecentlyViewed = (limit?: number) => {
    const items = recentlyViewed.value
    return limit ? items.slice(0, limit) : items
  }

  // Load on init
  onMounted(() => {
    loadRecentlyViewed()
  })

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
    getRecentlyViewed,
    loadRecentlyViewed,
  }
}

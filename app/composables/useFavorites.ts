/**
 * Composable for managing user favorites (stored in localStorage)
 */

interface FavoriteProperty {
  id: string
  name: string
  location?: string
  image?: string
  price?: number
  rating?: number
  addedAt: string
}

const FAVORITES_KEY = 'watercloset_favorites'

export const useFavorites = () => {
  const favorites = useState<FavoriteProperty[]>('favorites', () => [])

  /**
   * Load favorites from localStorage
   */
  const loadFavorites = () => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      favorites.value = stored ? JSON.parse(stored) : []
    } catch {
      favorites.value = []
    }
  }

  /**
   * Save favorites to localStorage
   */
  const saveFavorites = () => {
    if (typeof window === 'undefined') return
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
  }

  /**
   * Check if a property is favorited
   */
  const isFavorite = (propertyId: string) => {
    return favorites.value.some(f => f.id === propertyId)
  }

  /**
   * Add a property to favorites
   */
  const addFavorite = (property: Omit<FavoriteProperty, 'addedAt'>) => {
    if (isFavorite(property.id)) return

    favorites.value.push({
      ...property,
      addedAt: new Date().toISOString(),
    })
    saveFavorites()
  }

  /**
   * Remove a property from favorites
   */
  const removeFavorite = (propertyId: string) => {
    favorites.value = favorites.value.filter(f => f.id !== propertyId)
    saveFavorites()
  }

  /**
   * Toggle favorite status
   */
  const toggleFavorite = (property: Omit<FavoriteProperty, 'addedAt'>) => {
    if (isFavorite(property.id)) {
      removeFavorite(property.id)
    } else {
      addFavorite(property)
    }
  }

  /**
   * Get favorite count
   */
  const favoriteCount = computed(() => favorites.value.length)

  /**
   * Get all favorites
   */
  const getFavorites = () => favorites.value

  // Load on init
  onMounted(() => {
    loadFavorites()
  })

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    favoriteCount,
    getFavorites,
    loadFavorites,
  }
}

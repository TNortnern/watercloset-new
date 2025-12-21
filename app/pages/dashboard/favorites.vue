<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">My Favorites</h1>
        <p class="mt-1 text-slate-600">{{ favorites.length }} saved properties</p>
      </div>
      <Button @click="navigateTo('/search')">
        <Search class="w-4 h-4 mr-2" />
        Browse More
      </Button>
    </div>

    <!-- Favorites Grid -->
    <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="property in favorites"
        :key="property.id"
        class="hover:shadow-lg transition-all overflow-hidden group"
      >
        <div class="relative">
          <img
            :src="property.image"
            :alt="property.name"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform cursor-pointer"
            @click="navigateTo(`/bathrooms/${property.id}`)"
          />
          <button
            class="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
            @click="removeFavorite(property.id)"
          >
            <Heart class="w-5 h-5 text-pink-600 fill-pink-600" />
          </button>
        </div>
        <CardContent class="p-5">
          <div
            class="cursor-pointer"
            @click="navigateTo(`/bathrooms/${property.id}`)"
          >
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {{ property.name }}
            </h3>
            <div class="flex items-center mt-2 text-sm text-slate-600">
              <MapPin class="w-4 h-4 mr-1 flex-shrink-0" />
              <span class="truncate">{{ property.location }}</span>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center text-sm">
                <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span class="ml-1 font-semibold">{{ property.rating }}</span>
                <span class="ml-1 text-slate-600">({{ property.reviews }})</span>
              </div>
              <span class="text-lg font-bold text-slate-900">${{ property.price }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="amenity in property.amenities.slice(0, 3)"
                :key="amenity"
                class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded"
              >
                {{ amenity }}
              </span>
              <span
                v-if="property.amenities.length > 3"
                class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded"
              >
                +{{ property.amenities.length - 3 }}
              </span>
            </div>
          </div>
          <div class="flex gap-2 mt-4 pt-4 border-t border-slate-200">
            <Button class="flex-1" @click="bookNow(property.id)">
              <CalendarIcon class="w-4 h-4 mr-2" />
              Book Now
            </Button>
            <Button variant="outline" size="icon" @click="shareProperty(property.id)">
              <Share2 class="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="py-16">
      <CardContent class="text-center">
        <Heart class="w-16 h-16 mx-auto text-slate-300" />
        <h3 class="mt-4 text-lg font-semibold text-slate-900">No favorites yet</h3>
        <p class="mt-2 text-slate-600 max-w-md mx-auto">
          Start exploring and save your favorite bathrooms for quick access later
        </p>
        <Button class="mt-6" @click="navigateTo('/search')">
          <Search class="w-4 h-4 mr-2" />
          Browse Bathrooms
        </Button>
      </CardContent>
    </Card>

    <!-- Quick Tips -->
    <Card v-if="favorites.length > 0">
      <CardHeader class="border-b border-slate-200">
        <CardTitle class="text-lg flex items-center">
          <Info class="w-5 h-5 mr-2" />
          Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent class="p-6">
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>Book your favorite properties in advance to secure your preferred time slots</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>You can share your favorite properties with friends and family</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>Get notified when your favorite properties have special offers</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Heart,
  Search,
  MapPin,
  Star,
  Calendar as CalendarIcon,
  Share2,
  Info,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'dashboard-user',
})

const { findByID, update } = usePayload()
const { user } = useAuth()
const { toast } = useToast()
const { confirm } = useConfirm()

const favoritesData = ref<any[]>([])
const loading = ref(true)

// Get favorite IDs from user object (stored in database)
const favoriteIds = computed(() => {
  if (!user.value?.favorites) return []
  return (user.value.favorites || []).map((fav: number | string | { id: number | string }) => {
    const id = typeof fav === 'object' ? fav.id : fav
    return typeof id === 'number' ? id : parseInt(String(id), 10)
  })
})

// Load property data for favorite IDs - fetch each one individually
const loadFavoriteProperties = async () => {
  if (favoriteIds.value.length === 0) {
    favoritesData.value = []
    loading.value = false
    return
  }

  try {
    // Fetch each favorite property individually
    const properties = await Promise.all(
      favoriteIds.value.map(async (id) => {
        try {
          return await findByID('properties', String(id), 1)
        } catch (e) {
          console.error(`Failed to load property ${id}:`, e)
          return null
        }
      })
    )

    // Filter out any nulls from failed fetches
    favoritesData.value = properties.filter(p => p !== null)
  } catch (error) {
    console.error('Failed to load favorite properties:', error)
    favoritesData.value = []
  } finally {
    loading.value = false
  }
}

// Load property data when user favorites change
onMounted(() => {
  watch(favoriteIds, async () => {
    await loadFavoriteProperties()
  }, { immediate: true })
})

// Transform favorites for display
const favorites = computed(() => {
  return favoritesData.value.map((property: any) => {
    const loc = property.location
    return {
      id: property.id,
      name: property.name || 'Unnamed Property',
      location: loc?.city && loc?.state
        ? `${loc.city}, ${loc.state}`
        : 'Location not available',
      rating: property.stats?.averageRating || 0,
      reviews: property.stats?.reviewCount || 0,
      price: (property.pricePerMinute / 100).toFixed(2) || '0.00',
      amenities: property.amenities || [],
      image: property.photos?.[0]?.image?.url || property.photos?.[0]?.image || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    }
  })
})

// Actions
const removeFavorite = async (id: string) => {
  const confirmed = await confirm({
    title: 'Remove Favorite',
    message: 'Remove this property from your favorites?',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    variant: 'destructive',
  })

  if (!confirmed) return
  if (!user.value?.id) return

  const numericId = parseInt(id, 10)
  const newFavorites = favoriteIds.value.filter(fid => fid !== numericId)

  try {
    await update('users', user.value.id, {
      favorites: newFavorites,
    })

    // Update local user state
    user.value = {
      ...user.value,
      favorites: newFavorites,
    }

    // Remove from displayed data
    favoritesData.value = favoritesData.value.filter(f => f.id !== numericId && f.id !== id)
    toast.success('Removed from favorites')
  } catch (error) {
    console.error('Failed to remove favorite:', error)
    toast.error('Failed to remove from favorites. Please try again.')
  }
}

const bookNow = (id: string) => {
  navigateTo(`/bathrooms/${id}`)
}

const shareProperty = async (id: string) => {
  const url = `${window.location.origin}/bathrooms/${id}`

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Property link copied to clipboard!')
    } catch {
      toast.info(`Share this property: ${url}`)
    }
  } else {
    toast.info(`Share this property: ${url}`)
  }
}
</script>

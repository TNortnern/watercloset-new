<script setup lang="ts">
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import PropertyCard from '@/components/search/PropertyCard.vue'

interface Property {
  id: string
  name: string
  description?: any
  pricePerMinute: number
  photos?: Array<{
    image: {
      url: string
      alt?: string
    }
    caption?: string
  }>
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: [number, number]
  }
  amenities?: string[]
  type?: string
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  distance?: number
}

const homeStore = useHomeStore()
const { searchNearby } = usePayload()

const properties = ref<Property[]>([])
const isLoading = ref(false)
const scrollContainer = ref<HTMLDivElement | null>(null)

// Fetch properties when location changes
const fetchNearbyProperties = async () => {
  if (!homeStore.address?.coordinates) {
    properties.value = []
    return
  }

  isLoading.value = true

  try {
    const { latitude, longitude } = homeStore.address.coordinates
    const response = await searchNearby(latitude, longitude, homeStore.radius)
    properties.value = response?.docs?.slice(0, 12) || []
  } catch (error) {
    console.error('Error fetching nearby properties:', error)
    properties.value = []
  } finally {
    isLoading.value = false
  }
}

// Watch for location changes
watch(
  () => homeStore.address,
  () => {
    fetchNearbyProperties()
  },
  { immediate: true, deep: true }
)

// Scroll controls
const scrollLeft = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -300, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 300, behavior: 'smooth' })
  }
}

// Format distance in miles
const formatDistance = (meters: number): string => {
  const miles = meters / 1609.34
  if (miles < 0.1) {
    return `${Math.round(meters * 3.281)} ft`
  }
  return `${miles.toFixed(1)} mi`
}
</script>

<template>
  <div class="py-12">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">
            Properties Near You
          </h2>
          <p class="text-gray-600 mt-1">
            <template v-if="homeStore.address">
              Found {{ properties.length }} bathrooms near {{ homeStore.address.title?.split(',')[0] || 'your location' }}
            </template>
            <template v-else-if="homeStore.isLoading">
              Detecting your location...
            </template>
            <template v-else>
              Enable location to see nearby bathrooms
            </template>
          </p>
        </div>
        <NuxtLink
          v-if="properties.length > 0"
          to="/search"
          class="text-primary font-medium hover:underline"
        >
          See All →
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading || homeStore.isLoading"
        class="flex items-center justify-center py-16"
      >
        <div class="text-center">
          <Loader2 class="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
          <p class="text-gray-600">Finding bathrooms near you...</p>
        </div>
      </div>

      <!-- No Location State -->
      <div
        v-else-if="!homeStore.address && !homeStore.isLoading"
        class="bg-gray-50 rounded-xl p-8 text-center"
      >
        <p class="text-gray-600 mb-4">
          {{ homeStore.locationPermissionDenied
            ? 'Location access was denied. Please enable location in your browser settings or search for a location.'
            : 'Allow location access to see bathrooms near you.'
          }}
        </p>
        <button
          class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          @click="homeStore.detectLocation()"
        >
          Detect My Location
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="properties.length === 0"
        class="bg-gray-50 rounded-xl p-8 text-center"
      >
        <p class="text-gray-600">
          No bathrooms found nearby. Try expanding your search radius or searching a different location.
        </p>
      </div>

      <!-- Properties Carousel -->
      <div
        v-else
        class="relative"
      >
        <!-- Scroll Buttons -->
        <button
          class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          @click="scrollLeft"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <button
          class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          @click="scrollRight"
        >
          <ChevronRight class="w-5 h-5" />
        </button>

        <!-- Scrollable Container -->
        <div
          ref="scrollContainer"
          class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style="scroll-padding-left: 1rem;"
        >
          <div
            v-for="property in properties"
            :key="property.id"
            class="flex-shrink-0 w-72 snap-start"
          >
            <PropertyCard :property="property" />
            <div
              v-if="property.distance"
              class="mt-2 text-sm text-gray-500 text-center"
            >
              {{ formatDistance(property.distance) }} away
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

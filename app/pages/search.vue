<script setup lang="ts">
import { Menu, X, MapIcon, Grid3x3, Loader2, List, LayoutGrid, Search } from 'lucide-vue-next'
import LocationSearch from '@/components/search/LocationSearch.vue'
import MapView from '@/components/search/MapView.vue'
import PropertyCard from '@/components/search/PropertyCard.vue'
import FilterSidebar, { type FilterOptions } from '@/components/search/FilterSidebar.vue'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'default',
})

interface Property {
  id: string
  name: string
  description?: any // Rich text from Payload
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
    coordinates?: [number, number] // [lng, lat] from Payload point type
  }
  amenities?: string[]
  type?: string
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  status?: string
}

// Composables
const { find, searchNearby } = usePayload()
const route = useRoute()
const router = useRouter()
const locationApi = useLocationApi()

// State
const properties = ref<Property[]>([])
const isLoading = ref(false)
const showMobileFilters = ref(false)
const showMap = ref(true)
const selectedPropertyId = ref<string | null>(null)
const mapViewRef = ref<InstanceType<typeof MapView> | null>(null)

// Search state
const searchLocation = ref('')
const currentCenter = ref<[number, number]>([37.7749, -122.4194]) // Default to San Francisco
const showSearchAreaButton = ref(false)
const pendingMapBounds = ref<{ center: { lat: number; lng: number }; radius: number } | null>(null)
const viewMode = ref<'grid' | 'list'>('grid')

// Filters
const filters = ref<FilterOptions>({
  priceRange: { min: 0, max: 100 },
  propertyTypes: [],
  amenities: [],
  minRating: 0,
})

// Computed
const filteredProperties = computed(() => {
  if (!properties.value) return []
  return properties.value.filter(property => {
    // Convert price per minute to price per hour for filtering
    const pricePerHour = (property.pricePerMinute / 100) * 60 // cents per min to dollars per hour

    // Price filter
    if (pricePerHour < filters.value.priceRange.min ||
        pricePerHour > filters.value.priceRange.max) {
      return false
    }

    // Property type filter
    if (filters.value.propertyTypes.length > 0) {
      const normalizedType = property.type?.toLowerCase() || ''
      const hasMatchingType = filters.value.propertyTypes.some(
        filterType => normalizedType.includes(filterType.toLowerCase())
      )
      if (!hasMatchingType) return false
    }

    // Rating filter
    if (filters.value.minRating > 0 &&
        (property.stats?.averageRating || 0) < filters.value.minRating) {
      return false
    }

    // Amenities filter
    if (filters.value.amenities.length > 0) {
      const propertyAmenities = property.amenities || []
      const hasAllAmenities = filters.value.amenities.every(amenity =>
        propertyAmenities.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }

    return true
  })
})

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.priceRange.min > 0 || filters.value.priceRange.max < 100) count++
  if (filters.value.propertyTypes.length > 0) count++
  if (filters.value.amenities.length > 0) count++
  if (filters.value.minRating > 0) count++
  return count
})

// Fetch properties
const fetchProperties = async () => {
  isLoading.value = true

  try {
    const response = await find<Property>('properties', {
      where: {
        status: {
          equals: 'active',
        },
      },
      limit: 50,
      depth: 0, // Don't populate relationships - much faster
    })

    properties.value = response.docs
  } catch (error) {
    console.error('Error fetching properties:', error)
    properties.value = []
  } finally {
    isLoading.value = false
  }
}

// Fetch nearby properties based on location
const fetchNearbyProperties = async (lat: number, lng: number) => {
  isLoading.value = true

  try {
    const response = await searchNearby(lat, lng, 50000) // 50km radius
    properties.value = response?.docs || []
  } catch (error) {
    console.error('Error fetching nearby properties:', error)
    // Fallback to all properties
    await fetchProperties()
  } finally {
    isLoading.value = false
  }
}

// Handle location selection
const handleLocationSelect = async (location: { lat: number; lng: number; formatted: string }) => {
  searchLocation.value = location.formatted
  currentCenter.value = [location.lat, location.lng]

  // Update URL
  router.push({
    query: {
      ...route.query,
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      location: location.formatted,
    },
  })

  // Fetch nearby properties
  await fetchNearbyProperties(location.lat, location.lng)

  // Pan map to location
  if (mapViewRef.value) {
    mapViewRef.value.panTo(location.lat, location.lng, 13)
  }
}

// Handle property card click
const handlePropertyClick = (propertyId: string) => {
  selectedPropertyId.value = propertyId
}

// Handle map marker click
const handleMarkerClick = (propertyId: string) => {
  selectedPropertyId.value = propertyId

  // Scroll to property card on mobile
  if (window.innerWidth < 1024) {
    const cardElement = document.getElementById(`property-${propertyId}`)
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

// Handle map bounds change
const handleBoundsChange = (bounds: { center: { lat: number; lng: number }; radius: number; zoom: number }) => {
  pendingMapBounds.value = { center: bounds.center, radius: bounds.radius }
  showSearchAreaButton.value = true
}

// Search the current map area
const searchThisArea = async () => {
  if (!pendingMapBounds.value) return

  const { center, radius } = pendingMapBounds.value
  currentCenter.value = [center.lat, center.lng]
  searchLocation.value = '' // Clear text search

  // Update URL
  router.push({
    query: {
      lat: center.lat.toString(),
      lng: center.lng.toString(),
      radius: radius.toString(),
    },
  })

  await fetchNearbyProperties(center.lat, center.lng)
  showSearchAreaButton.value = false
  pendingMapBounds.value = null
}

// Get user's current location on mount
const getUserLocation = () => {
  if (!navigator.geolocation) return

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords
      currentCenter.value = [latitude, longitude]

      // Fetch nearby properties
      await fetchNearbyProperties(latitude, longitude)

      // Reverse geocode using server API
      try {
        const response = await locationApi.search({ latitude, longitude })
        const locationName = response.results?.[0]?.formatted_address || 'Current Location'
        searchLocation.value = locationName

        router.push({
          query: {
            lat: latitude.toString(),
            lng: longitude.toString(),
            location: locationName,
          },
        })
      }
      catch (error) {
        console.error('Error reverse geocoding:', error)
      }
    },
    async (error) => {
      console.error('Error getting location:', error)
      // Fallback to default location and fetch all properties
      await fetchProperties()
    },
  )
}

// Initialize from URL query params
const initializeFromQuery = async () => {
  const { lat, lng, location } = route.query

  if (lat && lng) {
    const latitude = parseFloat(lat as string)
    const longitude = parseFloat(lng as string)

    currentCenter.value = [latitude, longitude]
    searchLocation.value = (location as string) || ''

    await fetchNearbyProperties(latitude, longitude)
  } else {
    // Try to get user location
    getUserLocation()
  }
}

// Lifecycle
onMounted(() => {
  initializeFromQuery()
})

// Responsive map toggle
const isMobile = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
    if (!isMobile.value) {
      showMap.value = true // Always show map on desktop
    }
  }

  checkMobile()
  window.addEventListener('resize', checkMobile)

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center gap-4">
          <!-- Mobile filter toggle -->
          <button
            class="lg:hidden relative p-2 hover:bg-gray-100 rounded-lg"
            @click="showMobileFilters = true"
          >
            <Menu class="w-6 h-6" />
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- Location Search -->
          <div class="flex-1 max-w-2xl">
            <LocationSearch
              v-model="searchLocation"
              placeholder="Search by location..."
              @location-select="handleLocationSelect"
            />
          </div>

          <!-- Mobile map/list toggle -->
          <div
            v-if="isMobile"
            class="lg:hidden flex items-center gap-1 bg-gray-100 rounded-lg p-1"
          >
            <button
              class="p-1.5 rounded-md transition-colors"
              :class="!showMap ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'"
              @click="showMap = false"
            >
              <Grid3x3 class="w-5 h-5" />
            </button>
            <button
              class="p-1.5 rounded-md transition-colors"
              :class="showMap ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'"
              @click="showMap = true"
            >
              <MapIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Results count and view toggle -->
        <div class="mt-2 flex items-center justify-between">
          <div class="text-sm text-gray-600">
            <span v-if="isLoading">Searching...</span>
            <span v-else>
              {{ filteredProperties.length }} bathroom{{ filteredProperties.length !== 1 ? 's' : '' }} available
            </span>
          </div>

          <!-- View mode toggle (desktop only) -->
          <div class="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              class="p-1.5 rounded-md transition-colors"
              :class="viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              title="Grid view"
              @click="viewMode = 'grid'"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button
              class="p-1.5 rounded-md transition-colors"
              :class="viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              title="List view"
              @click="viewMode = 'list'"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div
      class="flex"
      :class="isMobile && showMap ? 'h-[calc(100vh-140px-160px)]' : 'h-[calc(100vh-140px)]'"
    >
      <!-- Filter Sidebar (Desktop) -->
      <aside class="hidden lg:block w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <FilterSidebar
          :filters="filters"
          @update:filters="filters = $event"
        />
      </aside>

      <!-- Mobile Filter Drawer -->
      <Transition name="slide">
        <div
          v-if="showMobileFilters"
          class="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          @click="showMobileFilters = false"
        >
          <div
            class="w-80 h-full bg-white"
            @click.stop
          >
            <FilterSidebar
              :filters="filters"
              :is-open="showMobileFilters"
              @update:filters="filters = $event"
              @close="showMobileFilters = false"
            />
          </div>
        </div>
      </Transition>

      <!-- Results Grid -->
      <main
        class="flex-1 overflow-y-auto"
        :class="{ 'hidden lg:block': showMap && isMobile }"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center">
            <Loader2 class="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p class="text-gray-600">Loading bathrooms...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="filteredProperties.length === 0"
          class="flex items-center justify-center h-full"
        >
          <div class="text-center px-4">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              No bathrooms found
            </h3>
            <p class="text-gray-600">
              Try adjusting your filters or search location
            </p>
          </div>
        </div>

        <!-- Property Grid/List -->
        <div
          v-else
          class="p-4 lg:p-6"
        >
          <!-- Grid View -->
          <div
            v-if="viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <div
              v-for="property in filteredProperties"
              :id="`property-${property.id}`"
              :key="property.id"
            >
              <PropertyCard
                :property="property"
                @click="handlePropertyClick(property.id)"
              />
            </div>
          </div>

          <!-- List View -->
          <div
            v-else
            class="space-y-4"
          >
            <div
              v-for="property in filteredProperties"
              :id="`property-${property.id}`"
              :key="property.id"
              class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              @click="handlePropertyClick(property.id)"
            >
              <div class="flex">
                <!-- Image -->
                <div class="w-48 h-32 flex-shrink-0 bg-gray-100">
                  <img
                    v-if="property.photos?.[0]?.image?.url"
                    :src="property.photos[0].image.url"
                    :alt="property.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center text-gray-400"
                  >
                    <MapIcon class="w-8 h-8" />
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between">
                      <h3 class="font-semibold text-gray-900">{{ property.name }}</h3>
                      <span class="text-green-600 font-semibold whitespace-nowrap ml-2">
                        ${{ ((property.pricePerMinute / 100) * 60).toFixed(0) }}/hr
                      </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ property.location?.address }}, {{ property.location?.city }}, {{ property.location?.state }}
                    </p>
                  </div>
                  <div class="flex items-center gap-4 mt-2">
                    <div
                      v-if="property.stats?.averageRating"
                      class="flex items-center gap-1 text-sm"
                    >
                      <span class="text-yellow-500">★</span>
                      <span>{{ property.stats.averageRating.toFixed(1) }}</span>
                      <span class="text-gray-400">({{ property.stats.reviewCount }})</span>
                    </div>
                    <span
                      v-if="property.type"
                      class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize"
                    >
                      {{ property.type }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Map -->
      <aside
        class="lg:w-[45%] xl:w-[40%] bg-gray-100 relative flex-shrink-0"
        :class="{ 'hidden lg:block': !showMap && isMobile, 'w-full': showMap && isMobile }"
      >
        <!-- Search this area button -->
        <Transition name="fade">
          <button
            v-if="showSearchAreaButton"
            class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white text-gray-900 px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium text-sm"
            @click="searchThisArea"
          >
            <Search class="w-4 h-4" />
            Search this area
          </button>
        </Transition>

        <ClientOnly>
          <MapView
            ref="mapViewRef"
            :properties="filteredProperties"
            :center="currentCenter"
            :selected-property-id="selectedPropertyId"
            @marker-click="handleMarkerClick"
            @bounds-change="handleBoundsChange"
          />
          <template #fallback>
            <div class="flex items-center justify-center h-full bg-gray-200">
              <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </template>
        </ClientOnly>
      </aside>
    </div>

    <!-- Mobile Bottom Sheet (when viewing map) -->
    <div
      v-if="isMobile && showMap && filteredProperties.length > 0"
      class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30"
    >
      <div class="p-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">
            {{ filteredProperties.length }} nearby
          </span>
          <button
            class="text-sm text-blue-600 font-medium"
            @click="showMap = false"
          >
            View all
          </button>
        </div>
        <div class="flex gap-3 overflow-x-auto pb-2 -mx-3 px-3 snap-x snap-mandatory">
          <div
            v-for="property in filteredProperties.slice(0, 10)"
            :key="property.id"
            class="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden snap-start"
            @click="handlePropertyClick(property.id)"
          >
            <div class="h-24 bg-gray-100">
              <img
                v-if="property.photos?.[0]?.image?.url"
                :src="property.photos[0].image.url"
                :alt="property.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-2">
              <h4 class="font-medium text-sm text-gray-900 truncate">{{ property.name }}</h4>
              <div class="flex items-center justify-between mt-1">
                <span class="text-green-600 font-semibold text-sm">
                  ${{ ((property.pricePerMinute / 100) * 60).toFixed(0) }}/hr
                </span>
                <div
                  v-if="property.stats?.averageRating"
                  class="flex items-center gap-0.5 text-xs"
                >
                  <span class="text-yellow-500">★</span>
                  <span>{{ property.stats.averageRating.toFixed(1) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Slide transition for mobile filter */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active > div,
.slide-leave-active > div {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from > div {
  transform: translateX(-100%);
}

.slide-leave-to > div {
  transform: translateX(-100%);
}

/* Ensure map takes full height */
:deep(.gm-style) {
  height: 100%;
  width: 100%;
}

/* Fade transition for search button */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

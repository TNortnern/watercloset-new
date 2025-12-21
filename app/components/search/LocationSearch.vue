<script setup lang="ts">
import { Search, X, MapPin, Loader2 } from 'lucide-vue-next'

interface LocationResult {
  formatted_address: string
  lat: number
  lng: number
  place_id: string
  types: string[]
  location_type: string
  components: {
    street_number: string
    route: string
    neighborhood: string
    locality: string
    administrative_area_level_2: string
    administrative_area_level_1: string
    country: string
    postal_code: string
  }
}

interface Props {
  modelValue?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search location...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'location-select': [location: { lat: number; lng: number; formatted: string; result?: LocationResult }]
}>()

const locationApi = useLocationApi()

const searchQuery = ref(props.modelValue || '')
const suggestions = ref<LocationResult[]>([])
const isLoading = ref(false)
const showSuggestions = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null
let currentRequestId = 0

// Fetch suggestions from Google Geocoding API via server
const fetchSuggestions = async (query: string) => {
  if (!query || query.length < 3) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }

  // Track this request to handle race conditions
  const requestId = ++currentRequestId
  isLoading.value = true

  try {
    const response = await locationApi.search({ text: query })

    // Only update if this is still the latest request
    if (requestId !== currentRequestId) return

    if (response.results) {
      suggestions.value = response.results
      showSuggestions.value = true
    }
    else {
      suggestions.value = []
    }
  }
  catch (error) {
    // Only log if this is still the latest request
    if (requestId === currentRequestId) {
      console.error('Error fetching location suggestions:', error)
      suggestions.value = []
    }
  }
  finally {
    // Only update loading state if this is still the latest request
    if (requestId === currentRequestId) {
      isLoading.value = false
    }
  }
}

// Handle search input with debounced API calls
const onSearchInput = () => {
  // Debounce API calls - 500ms for smoother typing
  if (debounceTimer)
    clearTimeout(debounceTimer)

  debounceTimer = setTimeout(() => {
    fetchSuggestions(searchQuery.value)
  }, 500)
}

// Handle suggestion selection
const selectSuggestion = (suggestion: LocationResult) => {
  searchQuery.value = suggestion.formatted_address
  emit('update:modelValue', suggestion.formatted_address)
  emit('location-select', {
    lat: suggestion.lat,
    lng: suggestion.lng,
    formatted: suggestion.formatted_address,
    result: suggestion,
  })

  suggestions.value = []
  showSuggestions.value = false
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  suggestions.value = []
  showSuggestions.value = false
}

// Close suggestions when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.location-search-container')) {
    showSuggestions.value = false
  }
}

// Get current location
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by your browser')
    return
  }

  isLoading.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords

      try {
        // Reverse geocode using server API
        const response = await locationApi.search({
          latitude,
          longitude,
        })

        if (response.results && response.results.length > 0) {
          const location = response.results[0]
          searchQuery.value = location.formatted_address
          emit('update:modelValue', location.formatted_address)
          emit('location-select', {
            lat: latitude,
            lng: longitude,
            formatted: location.formatted_address,
            result: location,
          })
        }
        else {
          // Still emit coordinates if reverse geocoding returns no results
          emit('location-select', {
            lat: latitude,
            lng: longitude,
            formatted: 'Current Location',
          })
        }
      }
      catch (error) {
        console.error('Error reverse geocoding:', error)
        // Still emit the coordinates even if reverse geocoding fails
        emit('location-select', {
          lat: latitude,
          lng: longitude,
          formatted: 'Current Location',
        })
      }
      finally {
        isLoading.value = false
      }
    },
    (error) => {
      console.error('Error getting current location:', error)
      isLoading.value = false
    },
  )
}

// Get display text for suggestion
const getSuggestionTitle = (suggestion: LocationResult) => {
  if (suggestion.components.street_number && suggestion.components.route) {
    return `${suggestion.components.street_number} ${suggestion.components.route}`
  }
  return suggestion.formatted_address.split(',')[0]
}

const getSuggestionSubtitle = (suggestion: LocationResult) => {
  const parts = suggestion.formatted_address.split(',')
  if (parts.length > 1) {
    return parts.slice(1).join(',').trim()
  }
  return suggestion.components.locality || suggestion.components.administrative_area_level_1 || ''
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer)
    clearTimeout(debounceTimer)
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchQuery.value) {
    searchQuery.value = newValue || ''
  }
})
</script>

<template>
  <div class="location-search-container relative w-full">
    <div class="relative">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="w-full h-10 pl-10 pr-20 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        autocomplete="off"
        @input="onSearchInput"
        @focus="showSuggestions = suggestions.length > 0"
      />

      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
        <button
          v-if="isLoading"
          class="p-1 text-gray-400"
          disabled
        >
          <Loader2 class="w-5 h-5 animate-spin" />
        </button>

        <button
          v-else-if="searchQuery"
          class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          @click="clearSearch"
        >
          <X class="w-5 h-5" />
        </button>

        <button
          class="p-1 text-blue-600 hover:text-blue-700 transition-colors"
          title="Use current location"
          @click="getCurrentLocation"
        >
          <MapPin class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Suggestions dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
    >
      <button
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.place_id || index"
        class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
        @click="selectSuggestion(suggestion)"
      >
        <div class="flex items-start gap-2">
          <MapPin class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-900 truncate">
              {{ getSuggestionTitle(suggestion) }}
            </div>
            <div class="text-sm text-gray-500 truncate">
              {{ getSuggestionSubtitle(suggestion) }}
            </div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.location-search-container {
  /* Ensure dropdown appears above other elements */
  z-index: 10;
}
</style>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { GoogleMap, Marker, CustomMarker } from 'vue3-google-map'
import MapMarkerTooltip from './MapMarkerTooltip.vue'
import MapPropertyDrawer from './MapPropertyDrawer.vue'

interface Property {
  id: string | number
  name: string
  description?: any
  pricePerMinute: number
  photos?: Array<{ image: { url: string }; caption?: string }>
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: [number, number] | { type: string; coordinates: number[] }
  }
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  type?: string
  amenities?: string[]
  distance?: number
}

interface MapMarker {
  position: { lat: number; lng: number }
  property: Property
}

const props = defineProps<{
  properties: Property[]
  center: { lat: number; lng: number }
  isLoading?: boolean
  userLocationTitle?: string
}>()

const emit = defineEmits<{
  'search-area': [bounds: { north: number; south: number; east: number; west: number }]
}>()

const config = useRuntimeConfig()
const googleMapsApiKey = config.public.googleMapsApiKey as string

// State
const mapRef = ref<any>(null)
const hoveredProperty = ref<Property | null>(null)
const tooltipPosition = ref<{ x: number; y: number } | null>(null)
const showPropertyDrawer = ref(false)
const selectedProperty = ref<Property | null>(null)
const selectedPropertyIndex = ref(0)
let tooltipTimeout: NodeJS.Timeout | null = null

// Compute markers from properties
const markers = computed<MapMarker[]>(() => {
  return props.properties
    .filter(p => {
      const coords = p.location?.coordinates
      if (!coords) return false
      // Handle both [lng, lat] array and GeoJSON format
      if (Array.isArray(coords)) return coords.length === 2
      if (coords.type === 'Point' && coords.coordinates) return true
      return false
    })
    .map(p => {
      const coords = p.location!.coordinates!
      let lat: number, lng: number

      if (Array.isArray(coords)) {
        // PostGIS returns [lng, lat]
        lng = coords[0]
        lat = coords[1]
      } else {
        // GeoJSON format
        lng = coords.coordinates[0]
        lat = coords.coordinates[1]
      }

      return {
        position: { lat, lng },
        property: p,
      }
    })
})

// User location marker
const userMarkerOptions = computed(() => ({
  position: props.center,
  icon: {
    url: createUserMarkerSvg(),
    scaledSize: { width: 32, height: 32 },
    anchor: { x: 16, y: 16 },
  },
  title: props.userLocationTitle || 'Your location',
  zIndex: 1000,
}))

// Create user location marker SVG
function createUserMarkerSvg() {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#3b82f6" stroke="white" stroke-width="3">
        <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="16" cy="16" r="5" fill="white"/>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Format price for marker display - always show in dollars
function formatMarkerPrice(pricePerMinute: number | string): string {
  const cents = Number(pricePerMinute) || 0
  return `$${(cents / 100).toFixed(2)}`
}

// Create property marker SVG (kept for reference)
function createMarkerSvg(property: Property, isHovered: boolean) {
  // Price is in cents - show as cents (e.g., "19¢") for readability on markers
  const cents = Number(property.pricePerMinute) || 0
  const priceLabel = cents < 100 ? `${cents}¢` : `$${(cents / 100).toFixed(0)}`
  const size = isHovered ? 56 : 48
  const radius = isHovered ? 24 : 20
  const fontSize = isHovered ? 14 : 12
  const bgColor = isHovered ? '#3b82f6' : 'white'
  const textColor = isHovered ? 'white' : '#111827'
  const strokeColor = isHovered ? '#2563eb' : '#d1d5db'
  const strokeWidth = isHovered ? 2 : 1

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="${isHovered ? 3 : 2}" stdDeviation="${isHovered ? 4 : 3}" flood-opacity="${isHovered ? 0.25 : 0.15}"/>
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <circle
          cx="${size / 2}" cy="${size / 2}" r="${radius}"
          fill="${bgColor}"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}"
        />
        <text
          x="${size / 2}" y="${size / 2}"
          font-family="system-ui, -apple-system, sans-serif"
          font-size="${fontSize}"
          font-weight="600"
          fill="${textColor}"
          text-anchor="middle"
          dominant-baseline="central"
        >${priceLabel}</text>
      </g>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Handle marker click
function handleMarkerClick(property: Property) {
  hideTooltip()
  selectedProperty.value = property
  selectedPropertyIndex.value = markers.value.findIndex(m => m.property.id === property.id)
  showPropertyDrawer.value = true
}

// Handle marker hover
function handleMarkerMouseEnter(event: any, property: Property) {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)

  if (event?.domEvent) {
    const rect = event.domEvent.target.getBoundingClientRect()
    tooltipPosition.value = {
      x: rect.left + rect.width / 2,
      y: rect.top,
    }
  }

  hoveredProperty.value = property
}

function handleMarkerMouseLeave() {
  hideTooltip()
}

function hideTooltip() {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
  tooltipPosition.value = null
  setTimeout(() => {
    if (!tooltipPosition.value) {
      hoveredProperty.value = null
    }
  }, 100)
}

// Handle drawer navigation
function handleDrawerNavigate(direction: 'prev' | 'next') {
  if (direction === 'prev' && selectedPropertyIndex.value > 0) {
    selectedPropertyIndex.value--
  } else if (direction === 'next' && selectedPropertyIndex.value < markers.value.length - 1) {
    selectedPropertyIndex.value++
  }
  selectedProperty.value = markers.value[selectedPropertyIndex.value].property
}

// Cleanup
onUnmounted(() => {
  if (tooltipTimeout) clearTimeout(tooltipTimeout)
})
</script>

<template>
  <div class="relative w-full h-full">
    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"
    >
      <div class="text-center">
        <Loader2 class="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
        <p class="text-sm text-gray-600">Finding bathrooms...</p>
      </div>
    </div>

    <!-- Map -->
    <ClientOnly>
      <GoogleMap
        ref="mapRef"
        :api-key="googleMapsApiKey"
        class="w-full h-full rounded-2xl overflow-hidden"
        :center="center"
        :zoom="13"
        :styles="[
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ]"
      >
        <!-- User location marker -->
        <Marker
          v-if="center.lat && center.lng"
          :options="userMarkerOptions"
        />

        <!-- Property markers -->
        <CustomMarker
          v-for="marker in markers"
          :key="marker.property.id"
          :options="{
            position: marker.position,
            anchorPoint: 'CENTER',
          }"
        >
          <div
            class="marker-pill"
            :class="{ 'marker-hovered': hoveredProperty?.id === marker.property.id }"
            @click="handleMarkerClick(marker.property)"
            @mouseenter="(e: MouseEvent) => handleMarkerMouseEnter(e, marker.property)"
            @mouseleave="handleMarkerMouseLeave"
          >
            {{ formatMarkerPrice(marker.property.pricePerMinute) }}
          </div>
        </CustomMarker>
      </GoogleMap>
      <template #fallback>
        <div class="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
          <Loader2 class="w-8 h-8 animate-spin text-primary" />
        </div>
      </template>
    </ClientOnly>

    <!-- Marker count badge -->
    <div
      v-if="markers.length > 0 && !isLoading"
      class="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full shadow-lg text-sm font-medium"
    >
      {{ markers.length }} bathroom{{ markers.length === 1 ? '' : 's' }} found
    </div>

    <!-- Tooltip -->
    <MapMarkerTooltip
      :property="hoveredProperty"
      :position="tooltipPosition"
    />

    <!-- Property Drawer -->
    <MapPropertyDrawer
      v-model:show="showPropertyDrawer"
      :property="selectedProperty"
      :properties="markers.map(m => m.property)"
      :current-index="selectedPropertyIndex"
      @navigate="handleDrawerNavigate"
    />
  </div>
</template>

<style scoped>
.marker-pill {
  background: white;
  color: #111827;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.marker-pill:hover,
.marker-hovered {
  background: #3b82f6;
  color: white;
  border-color: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  z-index: 100;
}
</style>

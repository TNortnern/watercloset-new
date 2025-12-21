<script setup lang="ts">
interface Property {
  id: string
  name: string
  pricePerMinute: number
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: [number, number] // [lng, lat] from Payload point type
  }
}

interface Props {
  properties: Property[]
  center?: [number, number] // [lat, lng]
  zoom?: number
  selectedPropertyId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  center: () => [37.7749, -122.4194], // San Francisco default
  zoom: 12,
})

const emit = defineEmits<{
  'marker-click': [propertyId: string]
  'bounds-change': [bounds: { center: { lat: number; lng: number }; radius: number; zoom: number }]
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<google.maps.Map | null>(null)
const markers = ref<Map<string, google.maps.Marker>>(new Map())
const infoWindow = ref<google.maps.InfoWindow | null>(null)
let boundsChangeDebounce: ReturnType<typeof setTimeout> | null = null
let isInitialLoad = true

const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey

// Load Google Maps script
const loadGoogleMaps = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve()
      return
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve())
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

// Create custom marker SVG icon URL
const createMarkerIcon = (isSelected: boolean, price: string) => {
  const bgColor = isSelected ? '#ef4444' : '#3b82f6'
  const size = isSelected ? 70 : 60
  const fontSize = isSelected ? 11 : 10

  const svg = `
    <svg width="${size}" height="30" viewBox="0 0 ${size} 30" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="${size - 4}" height="26" rx="13" fill="${bgColor}" stroke="white" stroke-width="2"/>
      <text x="${size / 2}" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="600" fill="white" text-anchor="middle">${price}</text>
    </svg>
  `
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// Initialize map
const initMap = async () => {
  if (!mapContainer.value || map.value) return

  try {
    await loadGoogleMaps()

    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: props.center[0], lng: props.center[1] },
      zoom: props.zoom,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    infoWindow.value = new google.maps.InfoWindow()

    // Listen for map idle (after pan/zoom) to emit bounds changes
    map.value.addListener('idle', () => {
      if (!map.value) return

      // Skip the initial load bounds change
      if (isInitialLoad) {
        isInitialLoad = false
        return
      }

      // Debounce the bounds change event
      if (boundsChangeDebounce) clearTimeout(boundsChangeDebounce)
      boundsChangeDebounce = setTimeout(() => {
        if (!map.value) return

        const center = map.value.getCenter()
        const bounds = map.value.getBounds()
        const zoom = map.value.getZoom()

        if (!center || !bounds || zoom === undefined) return

        // Calculate radius from bounds (distance from center to corner)
        const ne = bounds.getNorthEast()
        const sw = bounds.getSouthWest()
        const centerLat = center.lat()
        const centerLng = center.lng()

        // Use the larger of the two distances to ensure we get all visible properties
        const latDiff = Math.abs(ne.lat() - centerLat)
        const lngDiff = Math.abs(ne.lng() - centerLng)

        // Convert to meters (rough approximation: 1 degree = 111km)
        const latRadius = latDiff * 111000
        const lngRadius = lngDiff * 111000 * Math.cos(centerLat * Math.PI / 180)
        const radius = Math.max(latRadius, lngRadius) * 1.5 // Add 50% buffer

        emit('bounds-change', {
          center: { lat: centerLat, lng: centerLng },
          radius: Math.round(radius),
          zoom
        })
      }, 500)
    })

    updateMarkers()
  } catch (error) {
    console.error('Failed to load Google Maps:', error)
  }
}

// Update markers when properties change
const updateMarkers = () => {
  if (!map.value) return

  // Clear existing markers
  markers.value.forEach(marker => marker.setMap(null))
  markers.value.clear()

  const bounds = new google.maps.LatLngBounds()
  let hasValidMarkers = false

  // Add new markers
  props.properties.forEach(property => {
    if (!property.location?.coordinates || !map.value) return

    // Payload point type stores as [lng, lat], Google Maps uses {lat, lng}
    const [lng, lat] = property.location.coordinates
    const isSelected = property.id === props.selectedPropertyId
    const pricePerMinute = Number(property.pricePerMinute) || 0
    const priceLabel = `$${(pricePerMinute / 100).toFixed(2)}/min`

    const position = { lat, lng }
    bounds.extend(position)
    hasValidMarkers = true

    const marker = new google.maps.Marker({
      map: map.value,
      position,
      icon: {
        url: createMarkerIcon(isSelected, priceLabel),
        scaledSize: new google.maps.Size(isSelected ? 70 : 60, 30),
        anchor: new google.maps.Point(isSelected ? 35 : 30, 15),
      },
      title: property.name,
      zIndex: isSelected ? 100 : 10,
    })

    marker.addListener('click', () => {
      if (infoWindow.value && map.value) {
        const pricePerHour = ((pricePerMinute / 100) * 60).toFixed(2)
        const content = `
          <div style="min-width: 200px; padding: 12px;">
            <h3 style="font-weight: 600; margin: 0 0 6px 0; font-size: 14px;">${property.name}</h3>
            <p style="color: #16a34a; font-weight: 600; margin: 0 0 4px 0;">$${pricePerHour}/hour</p>
            ${property.location?.address ? `<p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">${property.location.address}</p>` : ''}
            <a href="/bathrooms/${property.id}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; width: 100%; text-align: center; box-sizing: border-box;">View Details</a>
          </div>
        `
        infoWindow.value.setContent(content)
        infoWindow.value.open(map.value, marker)
      }
      emit('marker-click', property.id)
    })

    markers.value.set(property.id, marker)
  })

  // Fit bounds if we have markers
  if (hasValidMarkers && map.value) {
    map.value.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 })

    // Don't zoom in too far for single marker
    const listener = google.maps.event.addListener(map.value, 'idle', () => {
      if (map.value && map.value.getZoom()! > 16) {
        map.value.setZoom(16)
      }
      google.maps.event.removeListener(listener)
    })
  }
}

// Update marker styles when selected property changes
const updateSelectedMarker = () => {
  if (!map.value) return

  markers.value.forEach((marker, id) => {
    const isSelected = id === props.selectedPropertyId
    const property = props.properties.find(p => p.id === id)
    if (!property) return

    const pricePerMinute = Number(property.pricePerMinute) || 0
    const priceLabel = `$${(pricePerMinute / 100).toFixed(2)}/min`

    marker.setIcon({
      url: createMarkerIcon(isSelected, priceLabel),
      scaledSize: new google.maps.Size(isSelected ? 70 : 60, 30),
      anchor: new google.maps.Point(isSelected ? 35 : 30, 15),
    })
    marker.setZIndex(isSelected ? 100 : 10)

    if (isSelected && infoWindow.value) {
      const pricePerHour = ((pricePerMinute / 100) * 60).toFixed(2)
      const content = `
        <div style="min-width: 200px; padding: 12px;">
          <h3 style="font-weight: 600; margin: 0 0 6px 0; font-size: 14px;">${property.name}</h3>
          <p style="color: #16a34a; font-weight: 600; margin: 0 0 8px 0;">$${pricePerHour}/hour</p>
          <a href="/bathrooms/${id}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; width: 100%; text-align: center; box-sizing: border-box;">View Details</a>
        </div>
      `
      infoWindow.value.setContent(content)
      infoWindow.value.open(map.value, marker)
      const pos = marker.getPosition()
      if (pos) map.value?.panTo(pos)
    }
  })
}

// Pan to specific location
const panTo = (lat: number, lng: number, zoom?: number) => {
  if (!map.value) return
  map.value.panTo({ lat, lng })
  if (zoom) {
    map.value.setZoom(zoom)
  }
}

// Expose methods to parent
defineExpose({
  panTo,
})

// Lifecycle
onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  markers.value.forEach(marker => marker.setMap(null))
  markers.value.clear()
  if (infoWindow.value) {
    infoWindow.value.close()
  }
  map.value = null
})

// Watch for property changes
watch(() => props.properties, updateMarkers, { deep: true })
watch(() => props.selectedPropertyId, updateSelectedMarker)
watch(() => props.center, (newCenter) => {
  if (map.value && newCenter) {
    map.value.setCenter({ lat: newCenter[0], lng: newCenter[1] })
  }
})
</script>

<template>
  <div class="relative w-full h-full">
    <div
      ref="mapContainer"
      class="w-full h-full rounded-lg"
    />
  </div>
</template>

<style>
/* Google Maps custom styles */
.gm-style-iw {
  padding: 0 !important;
}

.gm-style-iw-d {
  overflow: hidden !important;
}

.gm-style-iw-tc {
  display: none;
}
</style>

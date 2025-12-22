<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  MapPin,
  Star,
  Clock,
  Calendar as CalendarIcon,
  Check,
  Wifi,
  Droplet,
  Baby,
  Accessibility,
  Sparkles,
  ShowerHead,
  User,
  Mail,
  Phone,
  Shield,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Wind,
  Home,
  Users,
  Navigation,
  CheckCircle2,
  HandMetal
} from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
})

interface Media {
  id: string
  url: string
  alt: string
  sizes?: {
    thumbnail?: { url: string }
    card?: { url: string }
    hero?: { url: string }
  }
}

interface Property {
  id: string
  name: string
  description: any // richText field
  owner: string | {
    id: string
    firstName: string
    lastName: string
    email?: string
    createdAt?: string
  }
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  type: 'residential' | 'commercial' | 'restaurant' | 'hotel'
  location: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    latitude?: number
    longitude?: number
  }
  pricePerMinute: number // in cents
  minimumDuration: number
  maximumDuration: number
  amenities: string[]
  photos: Array<{
    image: string | Media
    caption?: string
  }>
  availability: {
    instantBooking: boolean
    advanceNotice: number
    bufferTime: number
    schedule: Array<{
      day: string
      enabled: boolean
      startTime: string
      endTime: string
    }>
  }
  stats: {
    totalBookings: number
    totalEarnings: number
    averageRating: number
    reviewCount: number
  }
  createdAt: string
  updatedAt: string
}

interface Review {
  id: string
  property: string
  user: string | {
    id: string
    firstName?: string
    lastName?: string
  }
  rating: number
  comment: string
  cleanliness?: number
  accuracy?: number
  communication?: number
  response?: {
    comment: string
    respondedAt: string
  }
  createdAt: string
}

const route = useRoute()
const propertyId = computed(() => String(route.params.id || ''))
const { findByID, find, update } = usePayload()
const { user, isAuthenticated } = useAuth()
const { toast } = useToast()

// Booking state
const selectedDate = ref<Date | string>(new Date())
const selectedTime = ref('')
const duration = ref(15)
const showAllPhotos = ref(false)
const currentPhotoIndex = ref(0)

// Contact host state
const showContactModal = ref(false)
const contactMessage = ref('')
const isSendingMessage = ref(false)

// Favorites state
const isFavorited = computed(() => {
  if (!user.value?.favorites) return false
  const favorites = user.value.favorites
  const numericPropertyId = parseInt(propertyId.value, 10)
  return favorites.some((fav: number | string | { id: number | string }) => {
    const favId = typeof fav === 'object' ? fav.id : fav
    const numericFavId = typeof favId === 'number' ? favId : parseInt(String(favId), 10)
    return numericFavId === numericPropertyId
  })
})

const isTogglingFavorite = ref(false)

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    navigateTo('/login')
    return
  }

  if (!user.value?.id) return

  isTogglingFavorite.value = true
  try {
    // Get current favorites as array of numeric IDs (Payload expects numbers)
    const currentFavorites = (user.value.favorites || []).map((fav: number | string | { id: number | string }) => {
      const id = typeof fav === 'object' ? fav.id : fav
      return typeof id === 'number' ? id : parseInt(String(id), 10)
    })

    const numericPropertyId = parseInt(propertyId.value, 10)

    let newFavorites: number[]
    if (isFavorited.value) {
      // Remove from favorites
      newFavorites = currentFavorites.filter((id: number) => id !== numericPropertyId)
    } else {
      // Add to favorites
      newFavorites = [...currentFavorites, numericPropertyId]
    }

    await update('users', user.value.id, {
      favorites: newFavorites,
    })

    // Update local user state
    user.value = {
      ...user.value,
      favorites: newFavorites,
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error)
    toast.error('Failed to update favorites. Please try again.')
  } finally {
    isTogglingFavorite.value = false
  }
}

// Share functionality
const handleShare = async () => {
  const shareData = {
    title: property.value?.name || 'Check out this bathroom',
    text: `Check out "${property.value?.name}" on MyWaterCloset!`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  } catch (error) {
    // User cancelled or error
    console.log('Share cancelled or failed:', error)
  }
}

// Helper to ensure selectedDate is always a Date object
const selectedDateAsDate = computed(() => {
  if (selectedDate.value instanceof Date) {
    return selectedDate.value
  }
  // Parse string date (from HTML date input "YYYY-MM-DD")
  return new Date(selectedDate.value + 'T00:00:00')
})

// Fetch property data with owner relationship
const { data: property, error: propertyError } = await useAsyncData<Property>(
  `property-${propertyId.value}`,
  () => findByID('properties', propertyId.value, 2), // depth 2 for owner + media
  {
    watch: [propertyId],
    server: true
  }
)

// Fetch reviews for this property
const { data: reviewsData } = await useAsyncData(
  `reviews-${propertyId.value}`,
  () => find<Review>('reviews', {
    where: {
      property: {
        equals: propertyId.value
      }
    },
    limit: 10,
    sort: '-createdAt',
    depth: 1
  }),
  {
    watch: [propertyId],
    server: true
  }
)

const reviews = computed(() => reviewsData.value?.docs || [])
const ownerInfo = computed(() => {
  if (typeof property.value?.owner === 'object') {
    return property.value.owner
  }
  return null
})

const ownerDisplayName = computed(() => {
  if (!ownerInfo.value) return 'Provider'
  const first = ownerInfo.value.firstName || ''
  const last = ownerInfo.value.lastName || ''
  return `${first} ${last}`.trim() || 'Provider'
})

// Amenity icons and labels matching Payload schema
const amenityIcons: Record<string, any> = {
  'wheelchair': Accessibility,
  'baby_changing': Baby,
  'shower': ShowerHead,
  'bidet': Droplet,
  'air_freshener': Wind,
  'hand_dryer': Wind,
  'paper_towels': HandMetal,
  'feminine': Sparkles,
  'mirror': Sparkles,
  'climate': Wind,
  'private': Home,
  'gender_neutral': Users,
}

const amenityLabels: Record<string, string> = {
  'wheelchair': 'Wheelchair Accessible',
  'baby_changing': 'Baby Changing Station',
  'shower': 'Shower',
  'bidet': 'Bidet',
  'air_freshener': 'Air Freshener',
  'hand_dryer': 'Hand Dryer',
  'paper_towels': 'Paper Towels',
  'feminine': 'Feminine Products',
  'mirror': 'Mirror',
  'climate': 'Climate Controlled',
  'private': 'Private',
  'gender_neutral': 'Gender Neutral',
}

// Calculate total price (convert from cents)
const totalPrice = computed(() => {
  if (!property.value) return 0
  return ((property.value.pricePerMinute * duration.value) / 100).toFixed(2)
})

const pricePerMinuteFormatted = computed(() => {
  if (!property.value) return '$0.00'
  return `$${(property.value.pricePerMinute / 100).toFixed(2)}`
})

// Format date for display
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// Format time for display
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''} ago`
  }
}

// Handle booking
const handleBooking = () => {
  if (!selectedTime.value) {
    toast.warning('Please select a time')
    return
  }

  const dateStr = selectedDate.value instanceof Date
    ? selectedDate.value.toISOString().split('T')[0]
    : selectedDate.value

  navigateTo(`/book/${propertyId.value}?date=${dateStr}&time=${selectedTime.value}&duration=${duration.value}`)
}

// Photo gallery navigation
const nextPhoto = () => {
  if (propertyImages.value.length > 0) {
    currentPhotoIndex.value = (currentPhotoIndex.value + 1) % propertyImages.value.length
  }
}

const prevPhoto = () => {
  if (propertyImages.value.length > 0) {
    currentPhotoIndex.value = currentPhotoIndex.value === 0
      ? propertyImages.value.length - 1
      : currentPhotoIndex.value - 1
  }
}

// Get member since text
const getMemberSince = (dateString?: string) => {
  if (!dateString) return 'Recently'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Recently'
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  } catch {
    return 'Recently'
  }
}

// Generate time options (every 15 minutes)
const timeOptions = computed(() => {
  const options = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push({
        value: time,
        label: formatTime(time)
      })
    }
  }
  return options
})

// Get availability for selected day
const todaySchedule = computed(() => {
  if (!property.value) return null
  const dayOfWeek = selectedDateAsDate.value.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  return property.value.availability.schedule?.find(s => s.day.toLowerCase() === dayOfWeek && s.enabled)
})

const isAvailableToday = computed(() => todaySchedule.value?.enabled ?? false)

// Process property images
const propertyImages = computed(() => {
  if (!property.value?.photos?.length) return []
  return property.value.photos.map((photo) => {
    const image = photo.image
    if (!image) return null
    if (typeof image === 'string') {
      const isUrl = image.startsWith('http') || image.startsWith('/')
      return isUrl ? { url: image, alt: photo.caption || property.value!.name } : null
    }
    if (typeof image === 'number') return null
    const url = image.sizes?.hero?.url || image.sizes?.card?.url || image.url
    if (!url) return null
    return {
      url,
      alt: image.alt || photo.caption || property.value!.name,
    }
  }).filter(Boolean) as Array<{ url: string, alt: string }>
})

// Render rich text description
const renderDescription = (desc: any) => {
  if (!desc) return ''
  if (typeof desc === 'string') return desc
  if (Array.isArray(desc)) {
    return desc
      .map((block) => {
        if (block.type === 'paragraph' && block.children) {
          return block.children.map((child: any) => child.text || '').join('')
        }
        return ''
      })
      .join('\n\n')
  }
  return ''
}

// Format property type
const propertyTypeLabel = computed(() => {
  const types: Record<string, string> = {
    residential: 'Residential',
    commercial: 'Commercial',
    restaurant: 'Restaurant/Cafe',
    hotel: 'Hotel/Hospitality',
  }
  return types[property.value?.type || ''] || property.value?.type || 'Unknown'
})

// Duration options
const durationOptions = computed(() => {
  if (!property.value) return []
  const options = []
  const min = property.value.minimumDuration
  const max = property.value.maximumDuration

  for (let i = min; i <= max; i += 5) {
    options.push(i)
  }
  return options
})

const propertyLatLng = computed(() => {
  const location = property.value?.location
  if (!location?.latitude || !location?.longitude) return null
  return { lat: location.latitude, lng: location.longitude }
})

// Google Maps URL
const googleMapsUrl = computed(() => {
  const location = property.value?.location
  if (!location) return null
  const coords = propertyLatLng.value
  if (coords && (coords.lat !== 0 || coords.lng !== 0)) {
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`
  }
  const address = [location.address, location.city, location.state, location.zipCode]
    .filter(Boolean)
    .join(', ')
  if (!address) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
})

const openInGoogleMaps = () => {
  if (googleMapsUrl.value) {
    window.open(googleMapsUrl.value, '_blank', 'noopener')
  } else {
    toast.warning('Location not available')
  }
}

const formatReviewerName = (review: Review) => {
  if (typeof review.user === 'object' && review.user) {
    return `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Guest'
  }
  return 'Guest'
}

// Contact host
const openContactModal = () => {
  if (!isAuthenticated.value) {
    navigateTo('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  showContactModal.value = true
}

const sendMessage = async () => {
  if (!contactMessage.value.trim()) {
    toast.warning('Please enter a message')
    return
  }

  if (!ownerInfo.value?.email) {
    toast.error('Host contact information not available')
    return
  }

  isSendingMessage.value = true
  try {
    // For now, open mailto link with pre-filled subject and body
    const subject = encodeURIComponent(`Inquiry about "${property.value?.name}" on MyWaterCloset`)
    const body = encodeURIComponent(`Hi ${ownerDisplayName.value},\n\n${contactMessage.value}\n\n---\nSent via MyWaterCloset\nProperty: ${property.value?.name}\nLink: ${window.location.href}`)
    window.location.href = `mailto:${ownerInfo.value.email}?subject=${subject}&body=${body}`

    toast.success('Opening your email client...')
    showContactModal.value = false
    contactMessage.value = ''
  } catch (error) {
    console.error('Failed to send message:', error)
    toast.error('Failed to send message. Please try again.')
  } finally {
    isSendingMessage.value = false
  }
}

watch(propertyId, () => {
  currentPhotoIndex.value = 0
})
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Error State -->
    <div v-if="propertyError" class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-2xl font-semibold text-slate-900 mb-4">Property not found</h1>
      <p class="text-slate-600 mb-6">The bathroom you're looking for doesn't exist or has been removed.</p>
      <Button @click="$router.push('/')">Back to Home</Button>
    </div>

    <!-- Loading State -->
    <div v-else-if="!property" class="container mx-auto px-4 py-20 text-center">
      <p class="text-slate-600">Loading bathroom details...</p>
    </div>

    <!-- Main Content -->
    <div v-else class="pb-20">
      <!-- Photo Gallery -->
      <div class="relative w-full h-[60vh] bg-slate-200 overflow-hidden">
        <div
          v-if="propertyImages.length > 0"
          class="relative w-full h-full"
        >
          <img
            :src="propertyImages[currentPhotoIndex]?.url || '/images/placeholder-bathroom.jpg'"
            :alt="propertyImages[currentPhotoIndex]?.alt || property.name"
            class="w-full h-full object-cover"
          />

          <!-- Navigation Buttons -->
          <button
            v-if="propertyImages.length > 1"
            @click="prevPhoto"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronLeft class="w-6 h-6 text-slate-900" />
          </button>

          <button
            v-if="propertyImages.length > 1"
            @click="nextPhoto"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
          >
            <ChevronRight class="w-6 h-6 text-slate-900" />
          </button>

          <!-- Photo Counter -->
          <div class="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
            {{ currentPhotoIndex + 1 }} / {{ propertyImages.length }}
          </div>
        </div>

        <!-- Placeholder if no photos -->
        <div v-else class="w-full h-full flex items-center justify-center bg-slate-300">
          <p class="text-slate-500">No photos available</p>
        </div>
      </div>

      <div class="container mx-auto px-4 -mt-10 relative z-10">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Property Header -->
            <Card class="shadow-lg">
              <CardContent class="p-6">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ property.name }}</h1>
                    <div class="flex items-center gap-4 text-sm text-slate-600">
                      <div class="flex items-center gap-1">
                        <MapPin class="w-4 h-4" />
                        <span>{{ property.location.city }}, {{ property.location.state }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span class="font-semibold">{{ property.stats.averageRating.toFixed(1) }}</span>
                        <span>({{ property.stats.reviewCount }} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <Button variant="outline" size="icon" @click="handleShare">
                      <Share2 class="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      :disabled="isTogglingFavorite"
                      @click="toggleFavorite"
                      :class="{ 'bg-red-50 border-red-200': isFavorited }"
                    >
                      <Heart
                        class="w-4 h-4"
                        :class="{ 'fill-red-500 text-red-500': isFavorited }"
                      />
                    </Button>
                  </div>
                </div>

                <div class="border-t pt-4">
                  <p class="text-slate-700 leading-relaxed whitespace-pre-line">{{ renderDescription(property.description) }}</p>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <p class="text-sm text-slate-600">Type</p>
                    <p class="font-semibold text-slate-900">{{ propertyTypeLabel }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-600">Status</p>
                    <p class="font-semibold text-green-600 capitalize">{{ property.status }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-600">Total Bookings</p>
                    <p class="font-semibold text-slate-900">{{ property.stats.totalBookings }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-slate-600">Instant Booking</p>
                    <p class="font-semibold text-slate-900">{{ property.availability.instantBooking ? 'Yes' : 'No' }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Location -->
            <Card class="shadow-lg">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <MapPin class="w-5 h-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-3">
                  <p class="text-slate-700">{{ property.location.address }}</p>
                  <p class="text-slate-700">{{ property.location.city }}, {{ property.location.state }} {{ property.location.zipCode }}</p>

                  <!-- Simple map placeholder -->
                  <div class="w-full h-64 bg-slate-200 rounded-lg flex items-center justify-center mt-4">
                    <div class="text-center">
                      <Navigation class="h-12 w-12 mx-auto mb-2 text-slate-400" />
                      <p class="text-sm text-slate-500">Map view coming soon</p>
                      <p class="text-xs text-slate-400 mt-1">
                        <span v-if="propertyLatLng">
                          Lat: {{ propertyLatLng.lat.toFixed(4) }},
                          Lng: {{ propertyLatLng.lng.toFixed(4) }}
                        </span>
                        <span v-else>Coordinates not available</span>
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    class="w-full mt-3"
                    @click="openInGoogleMaps"
                  >
                    <Navigation class="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            <!-- Amenities -->
            <Card class="shadow-lg">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Sparkles class="w-5 h-5" />
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div v-if="property.amenities && property.amenities.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    v-for="amenity in property.amenities"
                    :key="amenity"
                    class="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <component
                      :is="amenityIcons[amenity] || CheckCircle2"
                      class="w-5 h-5 text-primary flex-shrink-0"
                    />
                    <span class="text-sm font-medium text-slate-700">
                      {{ amenityLabels[amenity] || amenity }}
                    </span>
                  </div>
                </div>
                <p v-else class="text-slate-500">No amenities listed</p>
              </CardContent>
            </Card>

            <!-- Availability Schedule -->
            <Card class="shadow-lg">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Clock class="w-5 h-5" />
                  Availability Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="space-y-4">
                  <div v-if="property.availability.advanceNotice > 0" class="flex items-center gap-2 text-sm text-slate-600">
                    <Clock class="h-4 w-4" />
                    <span>Advance notice required: {{ property.availability.advanceNotice }} minutes</span>
                  </div>

                  <div class="space-y-2">
                    <h4 class="font-semibold text-slate-900">Weekly Schedule</h4>
                    <div v-if="property.availability.schedule && property.availability.schedule.length > 0" class="space-y-2">
                      <div
                        v-for="schedule in property.availability.schedule"
                        :key="schedule.day"
                        class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <span class="font-medium text-slate-900 capitalize w-32">{{ schedule.day }}</span>
                        <span v-if="schedule.enabled" class="text-slate-700">
                          {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
                        </span>
                        <span v-else class="text-slate-500">Closed</span>
                      </div>
                    </div>
                    <p v-else class="text-slate-500">No schedule set</p>
                  </div>

                  <div v-if="todaySchedule" class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center gap-2">
                      <CheckCircle2 class="h-5 w-5 text-green-600" />
                      <div>
                        <p class="font-semibold text-green-900">Open Today</p>
                        <p class="text-sm text-green-700">
                          {{ formatTime(todaySchedule.startTime) }} - {{ formatTime(todaySchedule.endTime) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <!-- Reviews -->
            <Card class="shadow-lg">
              <CardHeader>
                <CardTitle class="flex items-center gap-2">
                  <Star class="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  Reviews ({{ property.stats.reviewCount }})
                </CardTitle>
                <CardDescription>
                  Average rating: {{ property.stats.averageRating.toFixed(1) }} / 5.0
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div v-if="reviews.length > 0" class="space-y-6">
                  <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="pb-6 border-b last:border-b-0"
                  >
                    <div class="flex items-start gap-4">
                      <div class="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <User class="w-6 h-6 text-slate-500" />
                      </div>

                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                          <div>
                            <p class="font-semibold text-slate-900">
                              {{ formatReviewerName(review) }}
                            </p>
                            <p class="text-sm text-slate-500">{{ formatRelativeTime(review.createdAt) }}</p>
                          </div>

                          <div class="flex items-center gap-1">
                            <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span class="font-semibold">{{ review.rating.toFixed(1) }}</span>
                          </div>
                        </div>

                        <p class="text-slate-700 leading-relaxed">{{ review.comment }}</p>

                        <div v-if="review.cleanliness || review.accuracy || review.communication" class="flex gap-4 mt-3 text-sm">
                          <div v-if="review.cleanliness">
                            <span class="text-slate-600">Cleanliness: </span>
                            <span class="font-semibold">{{ review.cleanliness }}/5</span>
                          </div>
                          <div v-if="review.accuracy">
                            <span class="text-slate-600">Accuracy: </span>
                            <span class="font-semibold">{{ review.accuracy }}/5</span>
                          </div>
                          <div v-if="review.communication">
                            <span class="text-slate-600">Communication: </span>
                            <span class="font-semibold">{{ review.communication }}/5</span>
                          </div>
                        </div>

                        <!-- Provider Response -->
                        <div v-if="review.response?.comment" class="mt-4 ml-4 pl-4 border-l-2 border-slate-200">
                          <p class="text-sm font-semibold text-slate-900 mb-1">Response from host</p>
                          <p class="text-sm text-slate-700">{{ review.response.comment }}</p>
                          <p class="text-xs text-slate-500 mt-1">
                            {{ new Date(review.response.respondedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-8 text-slate-500">
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-6 space-y-6">
              <!-- Booking Widget -->
              <Card class="shadow-lg">
                <CardHeader>
                  <CardTitle>Book This Bathroom</CardTitle>
                  <CardDescription>
                    <span class="text-2xl font-bold text-slate-900">{{ pricePerMinuteFormatted }}</span>
                    <span class="text-slate-600"> per minute</span>
                  </CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <!-- Date Picker -->
                  <div>
                    <Label for="booking-date">Date</Label>
                    <Input
                      id="booking-date"
                      type="date"
                      v-model="selectedDate"
                      :min="new Date().toISOString().split('T')[0]"
                      class="mt-1"
                    />
                  </div>

                  <!-- Time Picker -->
                  <div>
                    <Label for="booking-time">Time</Label>
                    <select
                      id="booking-time"
                      v-model="selectedTime"
                      class="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select time</option>
                      <option
                        v-for="option in timeOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </div>

                  <!-- Duration Selector -->
                  <div>
                    <Label for="duration">Duration (minutes)</Label>
                    <select
                      id="duration"
                      v-model="duration"
                      class="w-full mt-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option
                        v-for="option in durationOptions"
                        :key="option"
                        :value="option"
                      >
                        {{ option }} minutes
                      </option>
                    </select>
                    <p class="text-xs text-slate-500 mt-1">
                      Min: {{ property.minimumDuration }}min, Max: {{ property.maximumDuration }}min
                    </p>
                  </div>

                  <!-- Price Breakdown -->
                  <div class="border-t pt-4 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-600">{{ pricePerMinuteFormatted }} × {{ duration }} minutes</span>
                      <span class="font-semibold">${{ totalPrice }}</span>
                    </div>
                    <div class="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span>${{ totalPrice }}</span>
                    </div>
                  </div>

                  <!-- Availability Status -->
                  <div v-if="!isAvailableToday" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p class="text-sm text-yellow-800">
                      Not available on {{ selectedDateAsDate.toLocaleDateString('en-US', { weekday: 'long' }) }}
                    </p>
                  </div>

                  <!-- Book Button -->
                  <Button
                    @click="handleBooking"
                    :disabled="!isAvailableToday || !selectedTime"
                    class="w-full"
                    size="lg"
                  >
                    Book Now
                  </Button>

                  <p class="text-xs text-slate-500 text-center">
                    You won't be charged yet
                  </p>
                </CardContent>
              </Card>

              <!-- Host Info Card -->
              <Card v-if="property.owner" class="shadow-lg">
                <CardHeader>
                  <CardTitle>Hosted by {{ ownerDisplayName }}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="flex items-start gap-4 mb-4">
                    <div class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <User class="w-8 h-8 text-slate-500" />
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-slate-900">
                        {{ ownerDisplayName }}
                      </p>
                      <p class="text-sm text-slate-600">
                        Member since {{ getMemberSince(ownerInfo?.createdAt) }}
                      </p>
                    </div>
                  </div>

                  <div class="space-y-3 pt-4 border-t">
                    <div v-if="ownerInfo?.email" class="flex items-center gap-3">
                      <Mail class="w-4 h-4 text-slate-500" />
                      <span class="text-sm text-slate-700">{{ ownerInfo.email }}</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <Shield class="w-4 h-4 text-green-600" />
                      <span class="text-sm text-slate-700">Identity verified</span>
                    </div>
                  </div>

                  <Button variant="outline" class="w-full mt-4" @click="openContactModal">
                    <Mail class="w-4 h-4 mr-2" />
                    Contact Host
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Host Modal -->
      <Teleport to="body">
        <div
          v-if="showContactModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          @click.self="showContactModal = false"
        >
          <Card class="w-full max-w-md">
            <CardHeader>
              <CardTitle>Contact {{ ownerDisplayName }}</CardTitle>
              <CardDescription>Send a message about "{{ property?.name }}"</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2">
                <Label for="contact-message">Your Message</Label>
                <textarea
                  id="contact-message"
                  v-model="contactMessage"
                  rows="5"
                  class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Hi! I'm interested in booking your bathroom. I have a question about..."
                  :disabled="isSendingMessage"
                />
              </div>
              <div class="flex gap-3">
                <Button
                  class="flex-1"
                  @click="sendMessage"
                  :disabled="isSendingMessage || !contactMessage.trim()"
                >
                  <Mail class="w-4 h-4 mr-2" />
                  {{ isSendingMessage ? 'Opening Email...' : 'Send Message' }}
                </Button>
                <Button variant="outline" @click="showContactModal = false" :disabled="isSendingMessage">
                  Cancel
                </Button>
              </div>
              <p class="text-xs text-slate-500 text-center">
                This will open your email client to send the message
              </p>
            </CardContent>
          </Card>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Pause,
  Play,
  Save,
  Clock,
  User,
  TrendingUp
} from 'lucide-vue-next'
import { ImageUpload } from '@/components/ui/upload'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const route = useRoute()
const router = useRouter()
const auth = useAuth()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()
const propertyId = route.params.id as string

const isEditing = ref(false)
const activeTab = ref('overview')
const isSaving = ref(false)

interface UploadedFile {
  id?: string | number
  url: string
  alt?: string
  filename?: string
}

interface Property {
  id: string
  name: string
  description: string
  type: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  pricePerMinute: number
  minimumDuration: number
  maximumDuration: number
  status: string
  availability?: {
    instantBooking: boolean
    advanceNotice: number
    schedule?: { day: string, enabled: boolean }[]
  }
  photos?: { id: string, image: { id: string, url: string } }[]
  amenities: string[]
}

interface Booking {
  id: string
  user: { id: string, firstName: string, lastName: string }
  startTime: string
  endTime: string
  totalAmount: number
  status: string
}

interface Review {
  id: string
  user: { id: string, firstName: string, lastName: string }
  rating: number
  comment: string
  createdAt: string
  helpful: number
}

// Fetch property data
const { data: propertyData, refresh: refreshProperty } = await useAsyncData(`property-${propertyId}`, async () => {
  return await payload.findByID<Property>('properties', propertyId, 1)
})

// Fetch bookings for this property
const { data: bookingsData } = await useAsyncData(`property-bookings-${propertyId}`, async () => {
  return await payload.find<Booking>('bookings', {
    where: { property: { equals: propertyId } },
    depth: 2,
    limit: 50,
    sort: '-createdAt'
  })
})

// Fetch reviews for this property
const { data: reviewsData } = await useAsyncData(`property-reviews-${propertyId}`, async () => {
  return await payload.find<Review>('reviews', {
    where: { property: { equals: propertyId } },
    depth: 2,
    limit: 100,
    sort: '-createdAt'
  })
})

// Reactive property ref for editing - convert price from cents to dollars
const property = ref<Property>({
  ...propertyData.value!,
  pricePerMinute: propertyData.value!.pricePerMinute / 100
})

const photoUploads = ref<UploadedFile[]>([])

const mapPropertyPhotos = (photos?: Property['photos']) => {
  if (!photos) return []
  return photos
    .map(photo => {
      if (!photo?.image?.url) return null
      return {
        id: photo.image.id,
        url: photo.image.url,
      }
    })
    .filter(Boolean) as UploadedFile[]
}

watch(
  () => propertyData.value?.photos,
  (photos) => {
    if (isEditing.value) return
    photoUploads.value = mapPropertyPhotos(photos)
  },
  { immediate: true }
)

watch(
  () => propertyData.value,
  (value) => {
    if (!value || isEditing.value) return
    property.value = {
      ...value,
      pricePerMinute: value.pricePerMinute / 100
    }
  },
  { immediate: true }
)

const allBookings = computed(() => bookingsData.value?.docs || [])
const allReviews = computed(() => reviewsData.value?.docs || [])

// Transform bookings for display
const recentBookings = computed(() => {
  return allBookings.value.slice(0, 10).map(booking => {
    const user = booking.user
    const startTime = new Date(booking.startTime)
    const endTime = new Date(booking.endTime)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''

    return {
      id: booking.id,
      guest: {
        name: `${firstName} ${lastName}`.trim(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      },
      date: startTime.toISOString().split('T')[0],
      time: startTime.toTimeString().slice(0, 5),
      duration,
      amount: booking.totalAmount / 100,
      status: booking.status
    }
  })
})

// Transform reviews for display
const propertyReviews = computed(() => {
  return allReviews.value.map(review => {
    const user = review.user
    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''
    const createdAt = new Date(review.createdAt)

    return {
      id: review.id,
      guest: {
        name: `${firstName} ${lastName}`.trim(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      },
      rating: review.rating,
      comment: review.comment,
      date: createdAt.toISOString().split('T')[0],
      helpful: review.helpful || 0
    }
  })
})

// Calculate stats
const stats = computed(() => {
  const completedBookings = allBookings.value.filter(b => b.status === 'completed')
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0) / 100

  let avgDuration = 0
  if (completedBookings.length > 0) {
    const totalDuration = completedBookings.reduce((sum, b) => {
      const start = new Date(b.startTime)
      const end = new Date(b.endTime)
      return sum + (end.getTime() - start.getTime()) / (1000 * 60)
    }, 0)
    avgDuration = Math.round(totalDuration / completedBookings.length)
  }

  return {
    totalEarnings,
    avgDuration,
    occupancyRate: 68,
    responseTime: '< 1 hour'
  }
})

const toggleStatus = async () => {
  const newStatus = property.value.status === 'active' ? 'inactive' : 'active'
  try {
    await payload.update('properties', propertyId, { status: newStatus })
    property.value.status = newStatus
    await refreshProperty()
    toast.success(`Property ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  } catch (error) {
    console.error('Failed to update status:', error)
    toast.error('Failed to update property status')
  }
}

const saveChanges = async () => {
  if (isSaving.value) return
  isSaving.value = true

  try {
    const photoIds = photoUploads.value
      .map(photo => photo.id)
      .filter(Boolean) as Array<string | number>

    if (photoIds.length === 0) {
      toast.warning('Please keep at least one photo')
      isSaving.value = false
      return
    }

    await payload.update('properties', propertyId, {
      name: property.value.name,
      description: property.value.description,
      pricePerMinute: Math.round(property.value.pricePerMinute * 100),
      minimumDuration: property.value.minimumDuration,
      maximumDuration: property.value.maximumDuration,
      location: property.value.location,
      amenities: property.value.amenities,
      photos: photoIds.map(id => ({ image: id }))
    })
    property.value.photos = photoUploads.value
      .filter(photo => photo.id && photo.url)
      .map((photo, index) => ({
        id: String(photo.id ?? index),
        image: { id: String(photo.id), url: photo.url }
      }))
    await refreshProperty()
    isEditing.value = false
    toast.success('Changes saved successfully')
  } catch (error) {
    console.error('Failed to save changes:', error)
    toast.error('Failed to save changes. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const deleteProperty = async () => {
  const confirmed = await confirm({
    title: 'Delete Property',
    message: 'Are you sure you want to delete this property? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'destructive',
  })

  if (!confirmed) return

  try {
    await payload.remove('properties', propertyId)
    toast.success('Property deleted successfully')
    router.push('/manage/properties')
  } catch (error) {
    console.error('Failed to delete property:', error)
    toast.error('Failed to delete property. Please try again.')
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/manage/properties"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ property.name }}</h1>
          <p class="mt-1 text-gray-600 flex items-center gap-2">
            <MapPin class="w-4 h-4" />
            {{ property.location.address }}, {{ property.location.city }}, {{ property.location.state }}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="toggleStatus"
          :class="[
            'inline-flex items-center gap-2 px-4 py-2.5 font-medium rounded-xl transition-colors border',
            property.status === 'active'
              ? 'bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100'
              : 'bg-green-50 border-green-300 text-green-700 hover:bg-green-100'
          ]"
        >
          <component :is="property.status === 'active' ? Pause : Play" class="w-5 h-5" />
          {{ property.status === 'active' ? 'Pause Listing' : 'Activate Listing' }}
        </button>
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Edit class="w-5 h-5" />
          Edit
        </button>
        <button
          v-else
          @click="saveChanges"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors"
        >
          <Save class="w-5 h-5" />
          Save Changes
        </button>
      </div>
    </div>

    <!-- Status Banner -->
    <div
      v-if="property.status === 'inactive'"
      class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <Pause class="w-5 h-5 text-yellow-600" />
        <div>
          <h3 class="font-medium text-yellow-900">This listing is currently paused</h3>
          <p class="text-sm text-yellow-700">Guests cannot see or book this property</p>
        </div>
      </div>
      <button
        @click="toggleStatus"
        class="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
      >
        Activate Now
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-green-100 rounded-lg">
            <DollarSign class="w-5 h-5 text-green-600" />
          </div>
          <div class="text-sm text-gray-600">Total Earnings</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">${{ stats.totalEarnings.toFixed(2) }}</div>
        <div class="text-xs text-green-600 flex items-center gap-1 mt-1">
          <TrendingUp class="w-3 h-3" />
          +12% from last month
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-blue-100 rounded-lg">
            <Calendar class="w-5 h-5 text-blue-600" />
          </div>
          <div class="text-sm text-gray-600">Total Bookings</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ allBookings.length }}</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <Star class="w-5 h-5 text-yellow-600" />
          </div>
          <div class="text-sm text-gray-600">Rating</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-2xl font-bold text-gray-900">{{ allReviews.length > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : '0.0' }}</div>
          <div class="text-sm text-gray-600">({{ allReviews.length }} reviews)</div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-purple-100 rounded-lg">
            <Clock class="w-5 h-5 text-purple-600" />
          </div>
          <div class="text-sm text-gray-600">Avg Duration</div>
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stats.avgDuration }} min</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="border-b border-gray-200">
        <div class="flex overflow-x-auto">
          <button
            v-for="tab in ['overview', 'photos', 'bookings', 'reviews', 'availability']"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors border-b-2',
              activeTab === tab
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            ]"
          >
            {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div v-if="!isEditing" class="space-y-4">
              <div>
                <label class="text-sm font-medium text-gray-600">Description</label>
                <p class="mt-1 text-gray-900">{{ property.description }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-600">Type</label>
                  <p class="mt-1 text-gray-900 capitalize">{{ property.type }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Price per Minute</label>
                  <p class="mt-1 text-gray-900">${{ (property.pricePerMinute / 100).toFixed(2) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Minimum Duration</label>
                  <p class="mt-1 text-gray-900">{{ property.minimumDuration }} minutes</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-600">Maximum Duration</label>
                  <p class="mt-1 text-gray-900">{{ property.maximumDuration }} minutes</p>
                </div>
              </div>
            </div>
            <div v-else class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
                <input
                  v-model="property.name"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  v-model="property.description"
                  rows="4"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Price per Minute (in dollars)</label>
                  <input
                    v-model.number="property.pricePerMinute"
                    type="number"
                    step="0.01"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Duration</label>
                  <input
                    v-model="property.minimumDuration"
                    type="number"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in property.amenities"
                :key="amenity"
                class="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded-lg"
              >
                {{ amenity }}
              </span>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-900">
                {{ property.location.address }}<br>
                {{ property.location.city }}, {{ property.location.state }} {{ property.location.zipCode }}
              </p>
            </div>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeTab === 'photos'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Property Photos</h3>
          </div>
          <div v-if="isEditing" class="space-y-4">
            <ImageUpload
              v-model="photoUploads"
              multiple
              :max-files="10"
              :allow-url="false"
            />
            <p class="text-sm text-gray-500">Upload at least one photo to keep your listing active.</p>
          </div>
          <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(photo, index) in property.photos"
              :key="photo.id"
              class="group relative aspect-square rounded-xl overflow-hidden"
            >
              <img :src="photo.image.url" :alt="`Property photo ${index + 1}`" class="w-full h-full object-cover" />
            </div>
            <div
              v-if="!property.photos || property.photos.length === 0"
              class="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500"
            >
              No photos yet
            </div>
          </div>
        </div>

        <!-- Bookings Tab -->
        <div v-if="activeTab === 'bookings'" class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          <div class="space-y-3">
            <div
              v-for="booking in recentBookings"
              :key="booking.id"
              class="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {{ booking.guest.avatar }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ booking.guest.name }}</h4>
                    <p class="text-sm text-gray-600">{{ booking.date }} at {{ booking.time }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900">${{ booking.amount.toFixed(2) }}</div>
                  <div class="text-sm text-gray-600">{{ booking.duration }} min</div>
                  <span :class="`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`">
                    {{ booking.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="space-y-4">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Guest Reviews</h3>
              <p class="text-sm text-gray-600 mt-1">{{ allReviews.length }} reviews with {{ allReviews.length > 0 ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1) : '0.0' }} average rating</p>
            </div>
          </div>
          <div class="space-y-4">
            <div
              v-for="review in propertyReviews"
              :key="review.id"
              class="p-4 border border-gray-200 rounded-xl"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {{ review.guest.avatar }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-gray-900">{{ review.guest.name }}</h4>
                    <span class="text-sm text-gray-600">{{ review.date }}</span>
                  </div>
                  <div class="flex items-center gap-1 mb-2">
                    <Star
                      v-for="(filled, i) in renderStars(review.rating)"
                      :key="i"
                      :class="[
                        'w-4 h-4',
                        filled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                      ]"
                    />
                  </div>
                  <p class="text-gray-700">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Availability Tab -->
        <div v-if="activeTab === 'availability'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">Availability Calendar</h3>
          <div class="p-12 bg-gray-100 rounded-xl text-center border-2 border-dashed border-gray-300">
            <Calendar class="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p class="text-gray-600">Calendar component would go here</p>
            <p class="text-sm text-gray-500 mt-1">Manage booking availability and blocked dates</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-white border border-red-200 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
      <p class="text-sm text-gray-600 mb-4">Irreversible actions for this property</p>
      <button @click="deleteProperty" class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
        <Trash2 class="w-4 h-4" />
        Delete Property
      </button>
    </div>
  </div>
</template>

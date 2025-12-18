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
  Upload,
  X,
  Clock,
  User,
  TrendingUp
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
})

const route = useRoute()
const propertyId = route.params.id

const isEditing = ref(false)
const activeTab = ref('overview')

// Mock property data
const property = ref({
  id: propertyId,
  name: 'Downtown Luxury Suite',
  description: 'A beautifully designed modern bathroom in the heart of downtown. Features premium amenities, excellent natural lighting, and a peaceful atmosphere perfect for a quick refresh or relaxation.',
  type: 'private',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  price: 1.50,
  minimumDuration: 15,
  maximumDuration: 120,
  rating: 4.9,
  reviews: 42,
  bookings: 128,
  status: 'active',
  instantBooking: true,
  advanceNotice: 2,
  images: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564540583246-934409427776?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&fit=crop'
  ],
  amenities: ['WiFi', 'Shower', 'Toiletries', 'Hair Dryer', 'Towels', 'Air Conditioning', 'Premium Products'],
  availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
})

const recentBookings = [
  {
    id: 'BK-1001',
    guest: { name: 'Sarah Johnson', avatar: 'SJ' },
    date: '2025-12-18',
    time: '14:30',
    duration: 45,
    amount: 67.50,
    status: 'confirmed'
  },
  {
    id: 'BK-1002',
    guest: { name: 'Michael Chen', avatar: 'MC' },
    date: '2025-12-17',
    time: '10:15',
    duration: 30,
    amount: 45.00,
    status: 'completed'
  },
  {
    id: 'BK-1003',
    guest: { name: 'Emily Rodriguez', avatar: 'ER' },
    date: '2025-12-19',
    time: '16:00',
    duration: 60,
    amount: 90.00,
    status: 'confirmed'
  }
]

const propertyReviews = [
  {
    id: 1,
    guest: { name: 'Sarah Johnson', avatar: 'SJ' },
    rating: 5,
    comment: 'Absolutely amazing experience! The bathroom was spotless and beautifully designed.',
    date: '2025-12-15',
    helpful: 12
  },
  {
    id: 2,
    guest: { name: 'Michael Chen', avatar: 'MC' },
    rating: 5,
    comment: 'Perfect for a quick refresh during my busy day. Great location and very clean.',
    date: '2025-12-14',
    helpful: 8
  },
  {
    id: 3,
    guest: { name: 'Emily Rodriguez', avatar: 'ER' },
    rating: 4,
    comment: 'Really nice space with modern aesthetic. Everything was clean and functional.',
    date: '2025-12-13',
    helpful: 5
  }
]

const stats = computed(() => ({
  totalEarnings: property.value.bookings * property.value.price * 30,
  avgDuration: 35,
  occupancyRate: 68,
  responseTime: '< 1 hour'
}))

const toggleStatus = () => {
  property.value.status = property.value.status === 'active' ? 'inactive' : 'active'
}

const saveChanges = () => {
  isEditing.value = false
  // Save changes
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
            {{ property.address }}, {{ property.city }}, {{ property.state }}
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
        <div class="text-2xl font-bold text-gray-900">{{ property.bookings }}</div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <Star class="w-5 h-5 text-yellow-600" />
          </div>
          <div class="text-sm text-gray-600">Rating</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="text-2xl font-bold text-gray-900">{{ property.rating }}</div>
          <div class="text-sm text-gray-600">({{ property.reviews }} reviews)</div>
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
                  <p class="mt-1 text-gray-900">${{ property.price }}</p>
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
                  <label class="block text-sm font-medium text-gray-700 mb-2">Price per Minute</label>
                  <input
                    v-model="property.price"
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
                {{ property.address }}<br>
                {{ property.city }}, {{ property.state }} {{ property.zipCode }}
              </p>
            </div>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeTab === 'photos'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Property Photos</h3>
            <button
              v-if="isEditing"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload class="w-4 h-4" />
              Upload Photos
            </button>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="(image, index) in property.images"
              :key="index"
              class="group relative aspect-square rounded-xl overflow-hidden"
            >
              <img :src="image" :alt="`Property photo ${index + 1}`" class="w-full h-full object-cover" />
              <div
                v-if="isEditing"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <button class="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>
            <button
              v-if="isEditing"
              class="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            >
              <Upload class="w-8 h-8 mb-2" />
              <span class="text-sm">Add Photo</span>
            </button>
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
              <p class="text-sm text-gray-600 mt-1">{{ property.reviews }} reviews with {{ property.rating }} average rating</p>
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
      <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
        <Trash2 class="w-4 h-4" />
        Delete Property
      </button>
    </div>
  </div>
</template>

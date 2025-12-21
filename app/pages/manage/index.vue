<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DollarSign,
  Calendar,
  Building2,
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  MapPin,
  Eye,
  AlertCircle,
  CreditCard,
  X
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const auth = useAuth()
const payload = usePayload()
const stripe = useStripe()

// Check Stripe Connect status
const { data: stripeStatusData } = await useAsyncData('stripe-status', async () => {
  try {
    return await stripe.getConnectAccountStatus()
  } catch (error) {
    return null
  }
})

const showStripeAlert = ref(true)
const dismissStripeAlert = () => {
  showStripeAlert.value = false
  // Store in localStorage to persist dismissal
  if (typeof window !== 'undefined') {
    localStorage.setItem('stripe-alert-dismissed', 'true')
  }
}

// Check if alert was previously dismissed
onMounted(() => {
  if (typeof window !== 'undefined') {
    const dismissed = localStorage.getItem('stripe-alert-dismissed')
    if (dismissed === 'true') {
      showStripeAlert.value = false
    }
  }
})

interface Property {
  id: string
  name: string
  pricePerMinute: number
  photos?: { image: { url: string } }[]
  status: string
}

interface Booking {
  id: string
  user: { id: string, firstName: string, lastName: string }
  property: { id: string, name: string }
  startTime: string
  endTime: string
  totalAmount: number
  providerPayout: number
  status: string
}

interface Review {
  id: string
  property: { id: string }
  rating: number
}

// Fetch provider's properties
const { data: propertiesData } = await useAsyncData('provider-properties', async () => {
  if (!auth.user.value?.id) return null
  return await payload.find<Property>('properties', {
    where: { owner: { equals: auth.user.value.id } },
    depth: 1
  })
})

// Fetch all bookings for provider's properties
const { data: bookingsData } = await useAsyncData('provider-bookings', async () => {
  if (!auth.user.value?.id) return null
  return await payload.find<Booking>('bookings', {
    where: {
      'property.owner': { equals: auth.user.value.id }
    },
    depth: 2,
    limit: 100,
    sort: '-createdAt'
  })
})

// Fetch reviews for provider's properties
const { data: reviewsData } = await useAsyncData('provider-reviews', async () => {
  if (!auth.user.value?.id) return null
  const propertyIds = propertiesData.value?.docs.map(p => p.id) || []
  if (propertyIds.length === 0) return null

  return await payload.find<Review>('reviews', {
    where: {
      property: { in: propertyIds }
    },
    depth: 1,
    limit: 1000
  })
})

const properties = computed(() => propertiesData.value?.docs || [])
const allBookings = computed(() => bookingsData.value?.docs || [])
const allReviews = computed(() => reviewsData.value?.docs || [])

// Calculate earnings
const earnings = computed(() => {
  const completedBookings = allBookings.value.filter(b => b.status === 'completed')
  const total = completedBookings.reduce((sum, b) => sum + (b.providerPayout || 0), 0) / 100

  // This month's earnings
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const thisMonthBookings = completedBookings.filter(b =>
    new Date(b.startTime) >= startOfMonth
  )
  const thisMonth = thisMonthBookings.reduce((sum, b) => sum + (b.providerPayout || 0), 0) / 100

  // Pending earnings (confirmed but not completed)
  const pendingBookings = allBookings.value.filter(b => b.status === 'confirmed')
  const pending = pendingBookings.reduce((sum, b) => sum + (b.providerPayout || 0), 0) / 100

  return { total, thisMonth, pending }
})

// Calculate stats
const stats = computed(() => {
  const activeListings = properties.value.filter(p => p.status === 'active').length
  const totalBookings = allBookings.value.length

  // Calculate average rating
  const totalRating = allReviews.value.reduce((sum, r) => sum + r.rating, 0)
  const averageRating = allReviews.value.length > 0
    ? (totalRating / allReviews.value.length).toFixed(1)
    : '0.0'

  return {
    totalBookings,
    activeListings,
    averageRating: parseFloat(averageRating)
  }
})

// Recent bookings (last 5)
const recentBookings = computed(() => {
  return allBookings.value.slice(0, 5).map(booking => {
    const user = booking.user
    const property = booking.property
    const startTime = new Date(booking.startTime)
    const endTime = new Date(booking.endTime)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))

    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''
    const propertyName = typeof property === 'object' ? property.name : 'Unknown Property'

    return {
      id: booking.id,
      guest: {
        name: `${firstName} ${lastName}`.trim(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      },
      property: propertyName,
      date: startTime.toISOString().split('T')[0],
      time: startTime.toTimeString().slice(0, 5),
      duration,
      amount: booking.totalAmount / 100,
      status: booking.status
    }
  })
})

// Top 4 properties for display
const topProperties = computed(() => {
  return properties.value.slice(0, 4).map(property => {
    const propertyReviews = allReviews.value.filter(r => r.property.id === property.id)
    const avgRating = propertyReviews.length > 0
      ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length
      : 0

    const propertyBookings = allBookings.value.filter(b =>
      typeof b.property === 'object' && b.property.id === property.id
    )

    return {
      id: property.id,
      image: property.photos?.[0]?.image?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      title: property.name,
      price: (property.pricePerMinute / 100).toFixed(2),
      rating: avgRating,
      reviews: propertyReviews.length,
      bookings: propertyBookings.length,
      status: property.status
    }
  })
})

const quickActions = [
  { label: 'Add Property', icon: Plus, color: 'blue', href: '/manage/properties/new' },
  { label: 'View Earnings', icon: DollarSign, color: 'green', href: '/manage/earnings' },
  { label: 'Manage Availability', icon: Calendar, color: 'purple', href: '/manage/availability' }
]

const getStatusColor = (status: string) => {
  const colors = {
    confirmed: 'bg-blue-100 text-blue-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Stripe Connect Alert -->
    <div
      v-if="showStripeAlert && stripeStatusData && !stripeStatusData.hasAccount"
      class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden"
    >
      <div class="p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <CreditCard class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-1">Connect Stripe to Get Paid</h3>
              <p class="text-blue-100 text-sm mb-4 max-w-2xl">
                Set up your Stripe account to start receiving payments from bookings. It only takes a few minutes to connect your bank account and verify your identity.
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink to="/manage/settings?tab=payouts">
                  <button class="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                    <CreditCard class="w-4 h-4" />
                    Connect Stripe Now
                  </button>
                </NuxtLink>
                <button
                  @click="dismissStripeAlert"
                  class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          <button
            @click="dismissStripeAlert"
            class="text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Incomplete Stripe Setup Alert -->
    <div
      v-else-if="showStripeAlert && stripeStatusData && stripeStatusData.hasAccount && !stripeStatusData.detailsSubmitted"
      class="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg overflow-hidden"
    >
      <div class="p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-1">Complete Your Stripe Setup</h3>
              <p class="text-yellow-100 text-sm mb-4 max-w-2xl">
                Your Stripe account is not fully set up. Complete the onboarding process to start receiving payments from your bookings.
              </p>
              <div class="flex flex-wrap gap-3">
                <NuxtLink to="/manage/settings?tab=payouts">
                  <button class="px-4 py-2 bg-white text-yellow-600 rounded-lg font-medium hover:bg-yellow-50 transition-colors flex items-center gap-2">
                    Complete Setup
                    <ArrowRight class="w-4 h-4" />
                  </button>
                </NuxtLink>
                <button
                  @click="dismissStripeAlert"
                  class="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
          <button
            @click="dismissStripeAlert"
            class="text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back! Here's what's happening with your properties.</p>
    </div>

    <!-- Earnings Summary -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-white/20 rounded-xl">
              <DollarSign class="w-6 h-6" />
            </div>
            <TrendingUp class="w-5 h-5 opacity-80" />
          </div>
          <div class="text-3xl font-bold mb-1">${{ earnings.total.toLocaleString() }}</div>
          <div class="text-blue-100 text-sm">Total Earned</div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-100 rounded-xl">
              <Calendar class="w-6 h-6 text-green-600" />
            </div>
            <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">${{ earnings.thisMonth.toLocaleString() }}</div>
          <div class="text-gray-600 text-sm">This Month</div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <Clock class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">${{ earnings.pending.toLocaleString() }}</div>
          <div class="text-gray-600 text-sm">Pending Payouts</div>
        </div>
      </div>
    </div>

    <!-- Booking Stats -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-100 rounded-xl">
              <Calendar class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ stats.totalBookings }}</div>
              <div class="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-xl">
              <Building2 class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ stats.activeListings }}</div>
              <div class="text-sm text-gray-600">Active Listings</div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-yellow-100 rounded-xl">
              <Star class="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div class="text-2xl font-bold text-gray-900">{{ stats.averageRating }}</div>
              <div class="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div>
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.href"
          class="group bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="`p-3 bg-${action.color}-100 rounded-xl group-hover:scale-110 transition-transform`">
                <component :is="action.icon" :class="`w-5 h-5 text-${action.color}-600`" />
              </div>
              <span class="font-medium text-gray-900">{{ action.label }}</span>
            </div>
            <ArrowRight class="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent Bookings -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        <NuxtLink to="/manage/bookings" class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View all
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="booking in recentBookings" :key="booking.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                      {{ booking.guest.avatar }}
                    </div>
                    <div class="font-medium text-gray-900">{{ booking.guest.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ booking.property }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.date }}</div>
                  <div class="text-xs text-gray-500">{{ booking.time }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ booking.duration }} min</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">${{ booking.amount.toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`">
                    {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="console.log('View booking:', booking.id)"
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Eye class="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Your Properties -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Your Properties</h2>
        <NuxtLink to="/manage/properties" class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View all
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="property in topProperties" :key="property.id" class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
          <div class="relative aspect-[4/3] overflow-hidden">
            <img :src="property.image" :alt="property.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Active
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-gray-900 mb-2 line-clamp-1">{{ property.title }}</h3>
            <div class="flex items-center gap-1 mb-3">
              <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span class="text-sm font-medium text-gray-900">{{ property.rating }}</span>
              <span class="text-sm text-gray-500">({{ property.reviews }})</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="text-lg font-bold text-gray-900">${{ property.price }}<span class="text-sm text-gray-500 font-normal">/min</span></div>
                <div class="text-xs text-gray-500">{{ property.bookings }} bookings</div>
              </div>
              <NuxtLink :to="`/manage/properties/${property.id}`" class="text-blue-600 hover:text-blue-700">
                <ArrowRight class="w-5 h-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

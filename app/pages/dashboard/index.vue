<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Welcome back, {{ user?.firstName || 'there' }}!</h1>
        <p class="mt-1 text-slate-600">Here's what's happening with your bookings today.</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" size="sm" @click="navigateTo('/search')">
          <Search class="w-4 h-4 mr-2" />
          Find Bathroom
        </Button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card class="hover:shadow-md transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Bookings</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.totalBookings }}</p>
              <p class="mt-1 text-xs text-green-600">+12% from last month</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-full">
              <Calendar class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-md transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Favorites</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.favorites }}</p>
              <p class="mt-1 text-xs text-slate-500">Saved properties</p>
            </div>
            <div class="p-3 bg-pink-100 rounded-full">
              <Heart class="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-md transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Upcoming</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.upcomingBookings }}</p>
              <p class="mt-1 text-xs text-slate-500">Next 7 days</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-full">
              <Clock class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="hover:shadow-md transition-shadow">
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Reviews Given</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ stats.reviewsGiven }}</p>
              <p class="mt-1 text-xs text-slate-500">Average: 4.8 stars</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-full">
              <Star class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Upcoming Bookings Section -->
      <div class="lg:col-span-2">
        <Card>
          <CardHeader class="border-b border-slate-200">
            <div class="flex items-center justify-between">
              <CardTitle class="text-xl">Upcoming Bookings</CardTitle>
              <Button variant="ghost" size="sm" @click="navigateTo('/dashboard/bookings')">
                View All
                <ChevronRight class="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-4">
              <div
                v-for="booking in upcomingBookings"
                :key="booking.id"
                class="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                @click="navigateTo(`/dashboard/bookings/${booking.id}`)"
              >
                <div class="flex-shrink-0">
                  <img
                    :src="booking.image"
                    :alt="booking.name"
                    class="w-full sm:w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="font-semibold text-slate-900">{{ booking.name }}</h3>
                      <div class="flex items-center mt-1 text-sm text-slate-600">
                        <MapPin class="w-4 h-4 mr-1" />
                        {{ booking.location }}
                      </div>
                    </div>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700"
                    >
                      {{ booking.status }}
                    </span>
                  </div>
                  <div class="flex flex-wrap items-center gap-4 mt-3 text-sm">
                    <div class="flex items-center text-slate-600">
                      <Calendar class="w-4 h-4 mr-1.5" />
                      {{ booking.date }}
                    </div>
                    <div class="flex items-center text-slate-600">
                      <Clock class="w-4 h-4 mr-1.5" />
                      {{ booking.time }}
                    </div>
                    <div class="font-semibold text-slate-900">${{ booking.price }}</div>
                  </div>
                </div>
              </div>

              <div v-if="upcomingBookings.length === 0" class="text-center py-8">
                <Calendar class="w-12 h-12 mx-auto text-slate-300" />
                <p class="mt-2 text-slate-600">No upcoming bookings</p>
                <Button class="mt-4" @click="navigateTo('/search')">
                  Find a Bathroom
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- My Reviews -->
        <Card class="mt-6">
          <CardHeader class="border-b border-slate-200">
            <div class="flex items-center justify-between">
              <CardTitle class="text-xl">My Reviews</CardTitle>
              <Button variant="ghost" size="sm" @click="navigateTo('/dashboard/bookings?tab=past')">
                View All
                <ChevronRight class="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div v-if="userReviewsData?.docs && userReviewsData.docs.length > 0" class="space-y-4">
              <div
                v-for="review in userReviewsData.docs.slice(0, 3)"
                :key="review.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <h4 class="font-semibold text-slate-900">{{ review.property?.name || 'Unknown Property' }}</h4>
                      <div class="flex items-center gap-1">
                        <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span class="font-semibold text-sm">{{ review.rating }}</span>
                      </div>
                    </div>
                    <p class="text-sm text-slate-700 line-clamp-2">{{ review.comment }}</p>
                    <div class="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{{ new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                      <div v-if="review.cleanliness || review.accuracy || review.communication" class="flex gap-3">
                        <span v-if="review.cleanliness">Clean: {{ review.cleanliness }}/5</span>
                        <span v-if="review.accuracy">Accurate: {{ review.accuracy }}/5</span>
                        <span v-if="review.communication">Communication: {{ review.communication }}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <Star class="w-12 h-12 mx-auto text-slate-300" />
              <p class="mt-2 text-slate-600">No reviews yet</p>
              <p class="text-sm text-slate-500 mt-1">Complete a booking to leave your first review</p>
            </div>
          </CardContent>
        </Card>

        <!-- Recently Viewed -->
        <Card class="mt-6">
          <CardHeader class="border-b border-slate-200">
            <div class="flex items-center justify-between">
              <CardTitle class="text-xl">Recently Viewed</CardTitle>
              <Button variant="ghost" size="sm" @click="navigateTo('/search')">
                Browse More
                <ChevronRight class="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                v-for="property in recentlyViewed"
                :key="property.id"
                class="flex gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                @click="navigateTo(`/bathrooms/${property.id}`)"
              >
                <img
                  :src="property.image"
                  :alt="property.name"
                  class="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div class="flex-1 min-w-0">
                  <h4 class="font-medium text-slate-900 text-sm truncate">{{ property.name }}</h4>
                  <div class="flex items-center mt-1 text-xs text-slate-600">
                    <MapPin class="w-3 h-3 mr-1" />
                    {{ property.location }}
                  </div>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center text-xs">
                      <Star class="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" />
                      {{ property.rating }}
                    </div>
                    <span class="text-sm font-semibold text-slate-900">${{ property.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Recent Activity Section -->
      <div class="lg:col-span-1">
        <Card class="h-full">
          <CardHeader class="border-b border-slate-200">
            <CardTitle class="text-xl">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex gap-3"
              >
                <div class="flex-shrink-0">
                  <div :class="[
                    'p-2 rounded-full',
                    activity.type === 'booking' && 'bg-blue-100',
                    activity.type === 'message' && 'bg-orange-100',
                    activity.type === 'review' && 'bg-yellow-100',
                    activity.type === 'payment' && 'bg-green-100'
                  ]">
                    <component
                      :is="activity.icon"
                      :class="[
                        'w-4 h-4',
                        activity.type === 'booking' && 'text-blue-600',
                        activity.type === 'message' && 'text-orange-600',
                        activity.type === 'review' && 'text-yellow-600',
                        activity.type === 'payment' && 'text-green-600'
                      ]"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-900">{{ activity.title }}</p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ activity.time }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle class="text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            variant="outline"
            class="h-auto py-6 flex-col gap-2 hover:border-blue-500 hover:bg-blue-50"
            @click="navigateTo('/search')"
          >
            <Search class="w-6 h-6" />
            <span>Find Bathroom</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-6 flex-col gap-2 hover:border-purple-500 hover:bg-purple-50"
            @click="navigateTo('/dashboard/bookings')"
          >
            <Calendar class="w-6 h-6" />
            <span>View Bookings</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-6 flex-col gap-2 hover:border-pink-500 hover:bg-pink-50"
            @click="navigateTo('/dashboard/favorites')"
          >
            <Heart class="w-6 h-6" />
            <span>My Favorites</span>
          </Button>
          <Button
            variant="outline"
            class="h-auto py-6 flex-col gap-2 hover:border-yellow-500 hover:bg-yellow-50"
            @click="navigateTo('/dashboard/settings')"
          >
            <Settings class="w-6 h-6" />
            <span>Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Calendar, MessageSquare, Star, MapPin, Clock, ChevronRight, Search, Heart, Settings, DollarSign } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'dashboard-user',
})

const { user } = useAuth()
const payload = usePayload()

// Client-side only data (localStorage)
const favoritesCount = ref(0)
const recentlyViewedItems = ref<any[]>([])

onMounted(() => {
  // Load favorites count from localStorage
  try {
    const favoritesStr = localStorage.getItem('favorites') || '[]'
    favoritesCount.value = JSON.parse(favoritesStr).length
  } catch {}

  // Load recently viewed from localStorage
  try {
    const viewedStr = localStorage.getItem('recentlyViewed') || '[]'
    recentlyViewedItems.value = JSON.parse(viewedStr).slice(0, 4)
  } catch {}
})

// Fetch user's bookings
const { data: bookingsData, pending: bookingsPending } = await useAsyncData(
  'dashboard-bookings',
  async () => {
    if (!user.value?.id) return null

    const now = new Date().toISOString()

    return await payload.find('bookings', {
      where: {
        user: { equals: user.value.id },
      },
      depth: 1,
      sort: '-startTime',
      limit: 100,
    })
  },
  {
    watch: [() => user.value?.id],
  }
)

// Fetch user's reviews
const { data: userReviewsData } = await useAsyncData(
  'dashboard-reviews',
  async () => {
    if (!user.value?.id) return null

    try {
      return await payload.find('reviews', {
        where: {
          user: { equals: user.value.id },
        },
        depth: 2,
        sort: '-createdAt',
        limit: 100,
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      return null
    }
  },
  {
    watch: [() => user.value?.id],
  }
)

// Computed values from real data
const allBookings = computed(() => bookingsData.value?.docs || [])

const upcomingBookings = computed(() => {
  const now = new Date()
  return allBookings.value
    .filter((b: any) => {
      const startTime = new Date(b.startTime)
      return startTime > now && b.status === 'confirmed'
    })
    .slice(0, 3)
    .map((booking: any) => {
      const property = booking.property
      const startTime = new Date(booking.startTime)
      const endTime = new Date(booking.endTime)

      return {
        id: booking.id,
        name: property?.name || 'Unknown Property',
        location: property?.address?.city && property?.address?.state
          ? `${property.address.city}, ${property.address.state}`
          : 'Location not available',
        date: startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
        price: booking.totalPrice,
        status: 'Confirmed',
        image: property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
      }
    })
})

// Calculate stats from real bookings data
const stats = computed(() => {
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcoming = allBookings.value.filter((b: any) => {
    const startTime = new Date(b.startTime)
    return startTime > now && startTime <= sevenDaysFromNow && b.status === 'confirmed'
  }).length

  // Get reviews count
  const reviewsCount = userReviewsData.value?.docs?.length || 0

  return {
    totalBookings: allBookings.value.length,
    favorites: favoritesCount.value,
    upcomingBookings: upcoming,
    reviewsGiven: reviewsCount,
  }
})

// Recently viewed (loaded from localStorage on mount)
const recentlyViewed = computed(() => recentlyViewedItems.value)

// Recent activity based on bookings
const recentActivity = computed(() => {
  const activities: any[] = []

  // Add recent bookings
  allBookings.value.slice(0, 5).forEach((booking: any) => {
    const startTime = new Date(booking.startTime)
    const now = new Date()
    const diffMs = now.getTime() - new Date(booking.createdAt).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    let timeStr = ''
    if (diffHours < 1) timeStr = 'Just now'
    else if (diffHours < 24) timeStr = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    else timeStr = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

    activities.push({
      id: booking.id,
      type: 'booking',
      title: booking.status === 'confirmed'
        ? `Booking confirmed for ${booking.property?.name || 'a property'}`
        : booking.status === 'completed'
        ? `Booking completed at ${booking.property?.name || 'a property'}`
        : `Booking ${booking.status}`,
      time: timeStr,
      icon: Calendar,
    })
  })

  return activities
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p class="mt-1 text-slate-600">Manage and track all your bathroom bookings</p>
      </div>
      <Button @click="navigateTo('/search')">
        <Plus class="w-4 h-4 mr-2" />
        New Booking
      </Button>
    </div>

    <!-- Filters and Tabs -->
    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Tabs Filter -->
          <Tabs v-model="activeTab" class="flex-1">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-200">{{ upcomingCount }}</span>
              </TabsTrigger>
              <TabsTrigger value="past">
                Past
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-200">{{ pastCount }}</span>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-200">{{ cancelledCount }}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <!-- Date Range Filter -->
          <div class="flex gap-2">
            <Button variant="outline" size="sm">
              <CalendarIcon class="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Bookings List -->
    <div class="space-y-4">
      <Card
        v-for="booking in filteredBookings"
        :key="booking.id"
        class="hover:shadow-md transition-shadow"
      >
        <CardContent class="p-6">
          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Image -->
            <div class="flex-shrink-0">
              <img
                :src="booking.image"
                :alt="booking.name"
                class="w-full lg:w-48 h-48 object-cover rounded-lg"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4 flex-wrap">
                <div class="flex-1 min-w-0">
                  <h3 class="text-xl font-semibold text-slate-900">{{ booking.name }}</h3>
                  <div class="flex items-center mt-1 text-sm text-slate-600">
                    <MapPin class="w-4 h-4 mr-1 flex-shrink-0" />
                    {{ booking.location }}
                  </div>
                </div>
                <span
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap',
                    booking.status === 'Confirmed' && 'bg-green-100 text-green-700',
                    booking.status === 'Completed' && 'bg-blue-100 text-blue-700',
                    booking.status === 'Cancelled' && 'bg-red-100 text-red-700',
                  ]"
                >
                  {{ booking.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div class="flex items-center text-sm text-slate-600">
                  <CalendarIcon class="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                  <span>{{ booking.date }}</span>
                </div>
                <div class="flex items-center text-sm text-slate-600">
                  <Clock class="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                  <span>{{ booking.time }}</span>
                </div>
                <div class="flex items-center text-sm text-slate-600">
                  <User class="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                  <span>{{ booking.host }}</span>
                </div>
                <div class="flex items-center text-sm font-semibold text-slate-900">
                  <DollarSign class="w-4 h-4 mr-1 text-slate-400 flex-shrink-0" />
                  <span>${{ booking.price }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-3 text-sm">
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span class="ml-1 font-medium">{{ booking.rating }}</span>
                </div>
                <span class="text-slate-400">•</span>
                <span class="text-slate-600">{{ booking.reviews }} reviews</span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-600">Booking #{{ booking.id }}</span>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-3 mt-6">
                <Button size="sm" variant="outline" @click="viewDetails(booking.id)">
                  <Eye class="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button
                  v-if="booking.status === 'Confirmed'"
                  size="sm"
                  variant="outline"
                  class="text-red-600 hover:text-red-700 hover:bg-red-50"
                  @click="cancelBooking(booking.id)"
                >
                  <X class="w-4 h-4 mr-2" />
                  Cancel Booking
                </Button>
                <Button
                  v-if="booking.status === 'Completed' && !booking.reviewed"
                  size="sm"
                  @click="leaveReview(booking.id)"
                >
                  <Star class="w-4 h-4 mr-2" />
                  Leave Review
                </Button>
                <Button
                  v-if="booking.status === 'Completed'"
                  size="sm"
                  variant="outline"
                  @click="bookAgain(booking.id)"
                >
                  <RefreshCw class="w-4 h-4 mr-2" />
                  Book Again
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Empty State -->
      <Card v-if="filteredBookings.length === 0" class="py-16">
        <CardContent class="text-center">
          <CalendarIcon class="w-16 h-16 mx-auto text-slate-300" />
          <h3 class="mt-4 text-lg font-semibold text-slate-900">No bookings found</h3>
          <p class="mt-2 text-slate-600">
            {{ activeTab === 'upcoming' ? 'You have no upcoming bookings' : activeTab === 'past' ? 'You have no past bookings' : 'You have no cancelled bookings' }}
          </p>
          <Button class="mt-6" @click="navigateTo('/search')">
            <Plus class="w-4 h-4 mr-2" />
            Find a Bathroom
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  Eye,
  X,
  Plus,
  User,
  DollarSign,
  RefreshCw,
} from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

definePageMeta({
  layout: 'dashboard-user',
})

const { user } = useAuth()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

const activeTab = ref('upcoming')

// Fetch all user bookings
const { data: bookingsData, pending, refresh } = await useAsyncData(
  'all-user-bookings',
  async () => {
    if (!user.value?.id) return null

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

// Fetch all user reviews to check which bookings have been reviewed
const { data: reviewsData } = await useAsyncData(
  'user-reviews',
  async () => {
    if (!user.value?.id) return null

    try {
      return await payload.find('reviews', {
        where: {
          user: { equals: user.value.id },
        },
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

// Create a set of booking IDs that have been reviewed
const reviewedBookingIds = computed(() => {
  const ids = new Set<string>()
  if (reviewsData.value?.docs) {
    reviewsData.value.docs.forEach((review: any) => {
      const bookingId = typeof review.booking === 'string' ? review.booking : review.booking?.id
      if (bookingId) {
        ids.add(bookingId)
      }
    })
  }
  return ids
})

// Transform bookings data for display
const allBookings = computed(() => {
  if (!bookingsData.value?.docs) return []

  return bookingsData.value.docs.map((booking: any) => {
    const property = booking.property
    const startTime = new Date(booking.startTime)
    const endTime = new Date(booking.endTime)
    const now = new Date()

    // Determine status for display
    let displayStatus = 'Confirmed'
    if (booking.status === 'cancelled') {
      displayStatus = 'Cancelled'
    } else if (endTime < now) {
      displayStatus = 'Completed'
    } else if (booking.status === 'confirmed') {
      displayStatus = 'Confirmed'
    }

    // Get property owner info
    const owner = property?.owner
    const hostName = owner?.firstName && owner?.lastName
      ? `${owner.firstName} ${owner.lastName}`
      : 'Property Owner'

    // Check if this booking has been reviewed
    const hasBeenReviewed = reviewedBookingIds.value.has(booking.id)

    return {
      id: booking.id,
      name: property?.name || 'Unknown Property',
      location: property?.address?.city && property?.address?.state
        ? `${property.address.city}, ${property.address.state}`
        : 'Location not available',
      date: startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      price: booking.totalPrice || 0,
      status: displayStatus,
      host: hostName,
      rating: property?.averageRating || 0,
      reviews: property?.reviewCount || 0,
      reviewed: hasBeenReviewed,
      image: property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
    }
  })
})

// Computed counts
const upcomingCount = computed(() =>
  allBookings.value.filter(b => b.status === 'Confirmed').length
)

const pastCount = computed(() =>
  allBookings.value.filter(b => b.status === 'Completed').length
)

const cancelledCount = computed(() =>
  allBookings.value.filter(b => b.status === 'Cancelled').length
)

// Filtered bookings
const filteredBookings = computed(() => {
  if (activeTab.value === 'upcoming') {
    return allBookings.value.filter(b => b.status === 'Confirmed')
  } else if (activeTab.value === 'past') {
    return allBookings.value.filter(b => b.status === 'Completed')
  } else if (activeTab.value === 'cancelled') {
    return allBookings.value.filter(b => b.status === 'Cancelled')
  }
  return allBookings.value
})

// Actions
const viewDetails = (id: string) => {
  navigateTo(`/dashboard/bookings/${id}`)
}

const leaveReview = (id: string) => {
  navigateTo(`/dashboard/bookings/${id}#review`)
}

const cancelBooking = async (id: string) => {
  const confirmed = await confirm({
    title: 'Cancel Booking',
    message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
    confirmText: 'Cancel Booking',
    variant: 'destructive',
  })

  if (!confirmed) return

  try {
    await payload.update('bookings', id, { status: 'cancelled' })
    await refresh()
    toast.success('Booking cancelled successfully')
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    toast.error('Failed to cancel booking. Please try again.')
  }
}

const bookAgain = (id: string) => {
  // Navigate to property page - we'll need to get the property ID from the booking
  const booking = allBookings.value.find(b => b.id === id)
  if (booking) {
    // For now, redirect to search page since we don't have property detail pages yet
    navigateTo('/search')
  }
}
</script>

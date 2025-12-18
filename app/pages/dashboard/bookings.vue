<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">My Bookings</h1>
        <p class="mt-1 text-slate-600">Manage and track all your bathroom bookings</p>
      </div>
      <Button @click="navigateTo('/bathrooms')">
        <Plus class="w-4 h-4 mr-2" />
        New Booking
      </Button>
    </div>

    <!-- Filters and Search -->
    <Card>
      <CardContent class="p-6">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Tabs Filter -->
          <Tabs v-model="activeTab" class="flex-1">
            <TabsList class="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-slate-200">{{ bookings.length }}</span>
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-200">{{ upcomingCount }}</span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-200">{{ completedCount }}</span>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled
                <span class="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-200">{{ cancelledCount }}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <!-- Search -->
          <div class="relative lg:w-80">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              v-model="searchQuery"
              placeholder="Search bookings..."
              class="pl-10"
            />
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
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-xl font-semibold text-slate-900">{{ booking.name }}</h3>
                  <div class="flex items-center mt-1 text-sm text-slate-600">
                    <MapPin class="w-4 h-4 mr-1" />
                    {{ booking.location }}
                  </div>
                </div>
                <span
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap',
                    booking.status === 'Confirmed' && 'bg-green-100 text-green-700',
                    booking.status === 'Completed' && 'bg-blue-100 text-blue-700',
                    booking.status === 'Cancelled' && 'bg-red-100 text-red-700',
                    booking.status === 'Pending' && 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ booking.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div class="flex items-center text-sm text-slate-600">
                  <Calendar class="w-4 h-4 mr-2 text-slate-400" />
                  <span>{{ booking.date }}</span>
                </div>
                <div class="flex items-center text-sm text-slate-600">
                  <Clock class="w-4 h-4 mr-2 text-slate-400" />
                  <span>{{ booking.time }}</span>
                </div>
                <div class="flex items-center text-sm text-slate-600">
                  <User class="w-4 h-4 mr-2 text-slate-400" />
                  <span>Host: {{ booking.host }}</span>
                </div>
                <div class="flex items-center text-sm font-semibold text-slate-900">
                  <DollarSign class="w-4 h-4 mr-1 text-slate-400" />
                  <span>${{ booking.price }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-4 text-sm">
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
                <Button size="sm" variant="outline" @click="messageProvider(booking.id)">
                  <MessageSquare class="w-4 h-4 mr-2" />
                  Message Provider
                </Button>
                <Button
                  v-if="booking.status === 'Completed' && !booking.reviewed"
                  size="sm"
                  variant="outline"
                  @click="leaveReview(booking.id)"
                >
                  <Star class="w-4 h-4 mr-2" />
                  Leave Review
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
          <Calendar class="w-16 h-16 mx-auto text-slate-300" />
          <h3 class="mt-4 text-lg font-semibold text-slate-900">No bookings found</h3>
          <p class="mt-2 text-slate-600">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Start by booking your first bathroom' }}
          </p>
          <Button class="mt-6" @click="navigateTo('/bathrooms')">
            <Plus class="w-4 h-4 mr-2" />
            Find a Bathroom
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Pagination -->
    <Card v-if="filteredBookings.length > 0">
      <CardContent class="p-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600">
            Showing <span class="font-medium">{{ startItem }}</span> to <span class="font-medium">{{ endItem }}</span> of <span class="font-medium">{{ filteredBookings.length }}</span> results
          </div>
          <div class="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft class="w-4 h-4" />
            </Button>
            <Button
              v-for="page in totalPages"
              :key="page"
              size="sm"
              :variant="currentPage === page ? 'default' : 'outline'"
              @click="currentPage = page"
            >
              {{ page }}
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              <ChevronRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Star,
  MessageSquare,
  Eye,
  X,
  Plus,
  User,
  DollarSign,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

definePageMeta({
  layout: 'dashboard',
})

const activeTab = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

// Mock bookings data
const bookings = ref([
  {
    id: 1001,
    name: 'Luxury Downtown Restroom',
    location: 'Manhattan, NY',
    date: 'Dec 18, 2025',
    time: '2:00 PM - 2:30 PM',
    price: 15,
    status: 'Confirmed',
    host: 'John Smith',
    rating: 4.9,
    reviews: 127,
    reviewed: false,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
  },
  {
    id: 1002,
    name: 'Cozy Cafe Bathroom',
    location: 'Brooklyn, NY',
    date: 'Dec 20, 2025',
    time: '10:00 AM - 10:30 AM',
    price: 8,
    status: 'Confirmed',
    host: 'Emma Wilson',
    rating: 4.7,
    reviews: 89,
    reviewed: false,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
  },
  {
    id: 1003,
    name: 'Modern Office Restroom',
    location: 'Queens, NY',
    date: 'Dec 15, 2025',
    time: '4:00 PM - 4:30 PM',
    price: 12,
    status: 'Completed',
    host: 'Michael Brown',
    rating: 4.8,
    reviews: 156,
    reviewed: true,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
  },
  {
    id: 1004,
    name: 'Premium Hotel Facilities',
    location: 'Manhattan, NY',
    date: 'Dec 10, 2025',
    time: '1:00 PM - 1:30 PM',
    price: 20,
    status: 'Completed',
    host: 'Sarah Davis',
    rating: 5.0,
    reviews: 203,
    reviewed: false,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=300&fit=crop',
  },
  {
    id: 1005,
    name: 'Quiet Library Restroom',
    location: 'Bronx, NY',
    date: 'Dec 8, 2025',
    time: '11:00 AM - 11:30 AM',
    price: 6,
    status: 'Cancelled',
    host: 'David Lee',
    rating: 4.6,
    reviews: 74,
    reviewed: false,
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=400&h=300&fit=crop',
  },
  {
    id: 1006,
    name: 'Spa-Like Bathroom',
    location: 'Manhattan, NY',
    date: 'Dec 5, 2025',
    time: '3:00 PM - 3:30 PM',
    price: 18,
    status: 'Completed',
    host: 'Lisa Anderson',
    rating: 4.9,
    reviews: 142,
    reviewed: true,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop',
  },
  {
    id: 1007,
    name: 'Trendy Restaurant Restroom',
    location: 'Brooklyn, NY',
    date: 'Dec 22, 2025',
    time: '7:00 PM - 7:30 PM',
    price: 10,
    status: 'Pending',
    host: 'James Taylor',
    rating: 4.5,
    reviews: 91,
    reviewed: false,
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=400&h=300&fit=crop',
  },
])

// Computed counts
const upcomingCount = computed(() =>
  bookings.value.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length
)

const completedCount = computed(() =>
  bookings.value.filter(b => b.status === 'Completed').length
)

const cancelledCount = computed(() =>
  bookings.value.filter(b => b.status === 'Cancelled').length
)

// Filtered bookings
const filteredBookings = computed(() => {
  let filtered = bookings.value

  // Filter by tab
  if (activeTab.value === 'upcoming') {
    filtered = filtered.filter(b => b.status === 'Confirmed' || b.status === 'Pending')
  } else if (activeTab.value === 'completed') {
    filtered = filtered.filter(b => b.status === 'Completed')
  } else if (activeTab.value === 'cancelled') {
    filtered = filtered.filter(b => b.status === 'Cancelled')
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      b =>
        b.name.toLowerCase().includes(query) ||
        b.location.toLowerCase().includes(query) ||
        b.host.toLowerCase().includes(query) ||
        b.id.toString().includes(query)
    )
  }

  return filtered
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredBookings.value.length / itemsPerPage))
const startItem = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage, filteredBookings.value.length))

// Actions
const viewDetails = (id: number) => {
  navigateTo(`/bathrooms/${id}`)
}

const messageProvider = (id: number) => {
  navigateTo('/dashboard/messages')
}

const leaveReview = (id: number) => {
  alert(`Leave review for booking #${id}`)
}

const cancelBooking = (id: number) => {
  if (confirm('Are you sure you want to cancel this booking?')) {
    const booking = bookings.value.find(b => b.id === id)
    if (booking) {
      booking.status = 'Cancelled'
    }
  }
}

const bookAgain = (id: number) => {
  const booking = bookings.value.find(b => b.id === id)
  if (booking) {
    navigateTo(`/bathrooms/${id}`)
  }
}
</script>

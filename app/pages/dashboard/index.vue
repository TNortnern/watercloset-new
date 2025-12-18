<template>
  <div class="space-y-6">
    <!-- Welcome Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Welcome back, {{ user.name }}!</h1>
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
import { ref } from 'vue'
import { Calendar, MessageSquare, Star, MapPin, Clock, ChevronRight, Search, Heart, Settings, DollarSign } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'dashboard-user',
})

// Mock user data
const user = ref({
  name: 'Sarah Johnson',
  email: 'sarah.j@example.com',
})

// Mock stats
const stats = ref({
  totalBookings: 24,
  favorites: 8,
  upcomingBookings: 3,
  reviewsGiven: 18,
})

// Mock upcoming bookings (next 3)
const upcomingBookings = ref([
  {
    id: 1,
    name: 'Luxury Downtown Restroom',
    location: 'Manhattan, NY',
    date: 'Dec 18, 2025',
    time: '2:00 PM - 2:30 PM',
    price: 15,
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: 'Cozy Cafe Bathroom',
    location: 'Brooklyn, NY',
    date: 'Dec 20, 2025',
    time: '10:00 AM - 10:30 AM',
    price: 8,
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: 'Modern Office Restroom',
    location: 'Queens, NY',
    date: 'Dec 22, 2025',
    time: '4:00 PM - 4:30 PM',
    price: 12,
    status: 'Confirmed',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop',
  },
])

// Mock recently viewed properties
const recentlyViewed = ref([
  {
    id: 201,
    name: 'Spa-Like Bathroom',
    location: 'Manhattan, NY',
    rating: 4.9,
    price: 18,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=200&h=200&fit=crop',
  },
  {
    id: 202,
    name: 'Premium Hotel Facilities',
    location: 'Manhattan, NY',
    rating: 5.0,
    price: 20,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=200&h=200&fit=crop',
  },
  {
    id: 203,
    name: 'Trendy Restaurant Restroom',
    location: 'Brooklyn, NY',
    rating: 4.5,
    price: 10,
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=200&h=200&fit=crop',
  },
  {
    id: 204,
    name: 'Quiet Library Restroom',
    location: 'Bronx, NY',
    rating: 4.6,
    price: 6,
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=200&h=200&fit=crop',
  },
])

// Mock recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'booking',
    title: 'Booking confirmed for Luxury Downtown Restroom',
    time: '2 hours ago',
    icon: Calendar,
  },
  {
    id: 2,
    type: 'message',
    title: 'New message from property owner',
    time: '5 hours ago',
    icon: MessageSquare,
  },
  {
    id: 3,
    type: 'review',
    title: 'Your review was posted',
    time: '1 day ago',
    icon: Star,
  },
  {
    id: 4,
    type: 'payment',
    title: 'Payment processed successfully',
    time: '2 days ago',
    icon: DollarSign,
  },
  {
    id: 5,
    type: 'booking',
    title: 'Booking completed at Cozy Cafe',
    time: '3 days ago',
    icon: Calendar,
  },
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Provider Dashboard Example</h1>
      <p class="mt-2 text-slate-600">
        This is an example of a provider dashboard with different navigation items.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Properties</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">12</p>
            </div>
            <div class="p-3 bg-cyan-100 rounded-lg">
              <Building2 class="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Bookings</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">156</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <Calendar class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Earnings</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">$2,450</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <DollarSign class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Avg. Rating</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">4.8</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <Star class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Properties List -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Your Properties</CardTitle>
            <CardDescription>Manage and monitor your bathroom listings</CardDescription>
          </div>
          <Button>
            <Plus class="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="property in properties"
            :key="property.id"
            class="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-cyan-300 hover:shadow-sm transition-all"
          >
            <img
              :src="property.image"
              :alt="property.name"
              class="w-20 h-20 object-cover rounded-lg"
            />
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-semibold text-slate-900">{{ property.name }}</h3>
                  <div class="flex items-center mt-1 text-sm text-slate-600">
                    <MapPin class="w-4 h-4 mr-1" />
                    {{ property.location }}
                  </div>
                </div>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': property.status === 'Active',
                    'bg-yellow-100 text-yellow-700': property.status === 'Pending',
                    'bg-slate-100 text-slate-700': property.status === 'Inactive'
                  }"
                >
                  {{ property.status }}
                </span>
              </div>
              <div class="flex items-center gap-4 mt-2 text-sm">
                <div class="flex items-center text-slate-600">
                  <Star class="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                  {{ property.rating }} ({{ property.reviews }} reviews)
                </div>
                <div class="font-semibold text-slate-900">
                  ${{ property.price }}/visit
                </div>
                <div class="text-slate-600">
                  {{ property.bookings }} bookings
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Settings,
  MessageSquare,
  MapPin,
  Plus
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Define custom navigation for provider
const providerNavigation = [
  { name: 'Dashboard', href: '/manage', icon: LayoutDashboard },
  { name: 'Properties', href: '/manage/properties', icon: Building2, badge: 2 },
  { name: 'Bookings', href: '/manage/bookings', icon: Calendar, badge: 5 },
  { name: 'Earnings', href: '/manage/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/manage/reviews', icon: Star },
  { name: 'Messages', href: '/manage/messages', icon: MessageSquare, badge: 3 },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
]

definePageMeta({
  layout: 'dashboard',
  // You can pass custom props to the layout like this in the actual implementation
})

const properties = ref([
  {
    id: 1,
    name: 'Luxury Downtown Restroom',
    location: 'Manhattan, NY',
    status: 'Active',
    rating: 4.9,
    reviews: 45,
    price: 15,
    bookings: 89,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Cozy Cafe Bathroom',
    location: 'Brooklyn, NY',
    status: 'Active',
    rating: 4.7,
    reviews: 32,
    price: 8,
    bookings: 67,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Modern Office Restroom',
    location: 'Queens, NY',
    status: 'Pending',
    rating: 0,
    reviews: 0,
    price: 12,
    bookings: 0,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=200&h=200&fit=crop'
  },
])
</script>

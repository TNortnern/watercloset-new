<script setup lang="ts">
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
  Eye
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
})

// Mock data
const earnings = {
  total: 12450,
  thisMonth: 3240,
  pending: 890
}

const stats = {
  totalBookings: 156,
  activeListings: 8,
  averageRating: 4.8
}

const recentBookings = [
  {
    id: 'BK-1001',
    guest: { name: 'Sarah Johnson', avatar: 'SJ' },
    property: 'Downtown Luxury Suite',
    date: '2025-12-18',
    time: '14:30',
    duration: 45,
    amount: 67.50,
    status: 'confirmed'
  },
  {
    id: 'BK-1002',
    guest: { name: 'Michael Chen', avatar: 'MC' },
    property: 'Spa Retreat Bathroom',
    date: '2025-12-18',
    time: '16:00',
    duration: 30,
    amount: 45.00,
    status: 'confirmed'
  },
  {
    id: 'BK-1003',
    guest: { name: 'Emily Rodriguez', avatar: 'ER' },
    property: 'Modern Minimalist Washroom',
    date: '2025-12-19',
    time: '10:15',
    duration: 60,
    amount: 90.00,
    status: 'pending'
  },
  {
    id: 'BK-1004',
    guest: { name: 'David Kim', avatar: 'DK' },
    property: 'Executive Suite Bath',
    date: '2025-12-17',
    time: '12:00',
    duration: 30,
    amount: 52.50,
    status: 'completed'
  },
  {
    id: 'BK-1005',
    guest: { name: 'Lisa Thompson', avatar: 'LT' },
    property: 'Garden View Powder Room',
    date: '2025-12-17',
    time: '09:30',
    duration: 20,
    amount: 30.00,
    status: 'completed'
  }
]

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    title: 'Downtown Luxury Suite',
    price: 1.50,
    rating: 4.9,
    reviews: 42,
    bookings: 28,
    status: 'active'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    title: 'Spa Retreat Bathroom',
    price: 1.50,
    rating: 4.8,
    reviews: 35,
    bookings: 22,
    status: 'active'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=800&h=600&fit=crop',
    title: 'Modern Minimalist Washroom',
    price: 1.50,
    rating: 4.7,
    reviews: 28,
    bookings: 19,
    status: 'active'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&fit=crop',
    title: 'Executive Suite Bath',
    price: 1.75,
    rating: 5.0,
    reviews: 18,
    bookings: 15,
    status: 'active'
  }
]

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
        <div v-for="property in properties" :key="property.id" class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
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

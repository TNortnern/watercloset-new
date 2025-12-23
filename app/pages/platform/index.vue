<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <p class="text-gray-600 mt-1">Platform overview and analytics</p>
    </div>

    <!-- Alerts/Flags Requiring Attention -->
    <div v-if="alerts.length > 0" class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div class="flex items-start space-x-3">
        <AlertTriangle class="w-5 h-5 text-orange-600 mt-0.5" />
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-orange-900 mb-2">Items Requiring Attention</h3>
          <ul class="space-y-1">
            <li v-for="alert in alerts" :key="alert.id" class="text-sm text-orange-800">
              <button @click="navigateTo(alert.link)" class="hover:underline text-left">{{ alert.message }}</button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalUsers.toLocaleString() }}</p>
            <p class="text-sm text-green-600 mt-2">+12% from last month</p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <Users class="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Providers</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalProviders.toLocaleString() }}</p>
            <p class="text-sm text-green-600 mt-2">+8% from last month</p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
            <Building2 class="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Total Bookings</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalBookings.toLocaleString() }}</p>
            <p class="text-sm text-green-600 mt-2">+24% from last month</p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <Calendar class="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">Platform Revenue</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">${{ stats.revenue.toLocaleString() }}</p>
            <p class="text-sm text-green-600 mt-2">+18% from last month</p>
          </div>
          <div class="p-3 bg-emerald-50 rounded-lg">
            <TrendingUp class="w-8 h-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- User Signups Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">User Signups</h3>
        <div class="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
          <div class="text-center">
            <TrendingUp class="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p class="text-sm text-blue-600 font-medium">Line Chart Placeholder</p>
            <p class="text-xs text-blue-500 mt-1">User signups over time</p>
          </div>
        </div>
      </div>

      <!-- Bookings Trend Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Bookings Trend</h3>
        <div class="h-64 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
          <div class="text-center">
            <TrendingUp class="w-12 h-12 text-purple-400 mx-auto mb-2" />
            <p class="text-sm text-purple-600 font-medium">Line Chart Placeholder</p>
            <p class="text-xs text-purple-500 mt-1">Bookings over time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activity Feed -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div :class="[
              'p-2 rounded-lg',
              activity.type === 'signup' && 'bg-blue-50',
              activity.type === 'booking' && 'bg-green-50',
              activity.type === 'refund' && 'bg-orange-50',
              activity.type === 'property' && 'bg-purple-50'
            ]">
              <Users v-if="activity.type === 'signup'" class="w-5 h-5 text-blue-600" />
              <Calendar v-if="activity.type === 'booking'" class="w-5 h-5 text-green-600" />
              <AlertTriangle v-if="activity.type === 'refund'" class="w-5 h-5 text-orange-600" />
              <Building2 v-if="activity.type === 'property'" class="w-5 h-5 text-purple-600" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div class="space-y-3">
          <NuxtLink to="/platform/users" class="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
            <span class="text-sm font-medium">Manage Users</span>
            <Users class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/platform/properties" class="w-full flex items-center justify-between px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
            <span class="text-sm font-medium">Review Properties</span>
            <Building2 class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/platform/bookings" class="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
            <span class="text-sm font-medium">View Bookings</span>
            <Calendar class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/platform/analytics" class="w-full flex items-center justify-between px-4 py-3 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-lg transition-colors">
            <span class="text-sm font-medium">Analytics</span>
            <BarChart3 class="w-5 h-5" />
          </NuxtLink>
          <NuxtLink to="/platform/settings" class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors">
            <span class="text-sm font-medium">Platform Settings</span>
            <Settings class="w-5 h-5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Building2, Calendar, TrendingUp, Settings, AlertTriangle, BarChart3 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
  middleware: 'admin',
})

const payload = usePayload()

interface User {
  id: string
  role: 'user' | 'provider' | 'admin'
}

interface Property {
  id: string
  status: 'pending' | 'active' | 'inactive' | 'suspended'
}

interface Booking {
  id: string
  status: string
  totalAmount: number
  platformFee: number
  user: any
  property: any
  createdAt: string
}

const stats = ref({
  totalUsers: 0,
  totalProviders: 0,
  totalBookings: 0,
  revenue: 0
})

const alerts = ref<Array<{ id: number; message: string; link: string }>>([])
const recentActivities = ref<Array<any>>([])
const loading = ref(true)

// Fetch dashboard data
onMounted(async () => {
  try {
    // Fetch all users
    const usersResponse = await payload.find<User>('users', { limit: 1000 })
    stats.value.totalUsers = usersResponse.totalDocs
    stats.value.totalProviders = usersResponse.docs.filter(u => u.role === 'provider').length

    // Fetch all properties
    const propertiesResponse = await payload.find<Property>('properties', { limit: 1000 })
    const pendingProperties = propertiesResponse.docs.filter(p => p.status === 'pending').length

    // Fetch all bookings
    const bookingsResponse = await payload.find<Booking>('bookings', { limit: 1000, depth: 2 })
    stats.value.totalBookings = bookingsResponse.totalDocs

    // Calculate revenue (sum of platform fees)
    stats.value.revenue = Math.round(
      bookingsResponse.docs.reduce((sum, b) => sum + (b.platformFee || 0), 0) / 100
    )

    // Count refund requests
    const refundRequests = bookingsResponse.docs.filter(b => b.status === 'refunded' || b.status === 'cancelled').length

    // Build alerts
    if (pendingProperties > 0) {
      alerts.value.push({
        id: 1,
        message: `${pendingProperties} new ${pendingProperties === 1 ? 'property' : 'properties'} pending approval`,
        link: '/platform/properties?status=pending'
      })
    }

    // Build recent activities from bookings and users
    const recentBookings = bookingsResponse.docs
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .slice(0, 3)
      .map(b => ({
        id: `booking-${b.id}`,
        type: 'booking',
        title: 'New Booking',
        description: `${b.user?.firstName || 'User'} ${b.user?.lastName || ''} booked ${b.property?.name || 'property'}`,
        time: formatTimeAgo(b.createdAt)
      }))

    const recentUsers = usersResponse.docs
      .slice(0, 3)
      .map(u => ({
        id: `user-${u.id}`,
        type: 'signup',
        title: 'New User Signup',
        description: `${(u as any).firstName || 'User'} ${(u as any).lastName || ''} joined the platform`,
        time: formatTimeAgo((u as any).createdAt)
      }))

    recentActivities.value = [...recentBookings, ...recentUsers]
      .sort((a, b) => {
        // Simple sort by time string (this is approximate)
        return a.time.localeCompare(b.time)
      })
      .slice(0, 6)

  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    loading.value = false
  }
})

// Helper function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}
</script>

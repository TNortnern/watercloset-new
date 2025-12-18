<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/users" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">User Details</h1>
          <p class="text-gray-600 mt-1">View and manage user account</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="console.log('Send email to user:', user.email)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Mail class="w-5 h-5 inline mr-2" />
          Send Email
        </button>
        <button @click="console.log('Edit user:', user.id)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Edit class="w-5 h-5 inline mr-2" />
          Edit User
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User Profile Card -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mx-auto">
              {{ user.initials }}
            </div>
            <h2 class="text-xl font-bold text-gray-900 mt-4">{{ user.name }}</h2>
            <p class="text-gray-600 text-sm mt-1">{{ user.email }}</p>

            <div class="flex items-center justify-center space-x-2 mt-4">
              <span :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                user.role === 'admin' && 'bg-red-100 text-red-800',
                user.role === 'provider' && 'bg-purple-100 text-purple-800',
                user.role === 'user' && 'bg-blue-100 text-blue-800'
              ]">
                {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
              </span>
              <span :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                user.status === 'active' && 'bg-green-100 text-green-800',
                user.status === 'suspended' && 'bg-red-100 text-red-800'
              ]">
                {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
              </span>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Member Since</span>
              <span class="text-sm font-medium text-gray-900">{{ user.joinedDate }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Bookings</span>
              <span class="text-sm font-medium text-gray-900">{{ user.bookingsCount }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Spent</span>
              <span class="text-sm font-medium text-gray-900">${{ user.totalSpent.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Last Login</span>
              <span class="text-sm font-medium text-gray-900">{{ user.lastLogin }}</span>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Account Actions</h3>
            <button @click="console.log('Verify account:', user.id)" class="w-full flex items-center justify-between px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">Verify Account</span>
              <CheckCircle class="w-5 h-5" />
            </button>
            <button @click="console.log('Suspend account:', user.id)" class="w-full flex items-center justify-between px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">Suspend Account</span>
              <Ban class="w-5 h-5" />
            </button>
            <button @click="console.log('Delete account:', user.id)" class="w-full flex items-center justify-between px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">Delete Account</span>
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Activity History -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Activity History</h3>
          <div class="space-y-4">
            <div v-for="activity in activityHistory" :key="activity.id" class="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div :class="[
                'p-2 rounded-lg',
                activity.type === 'booking' && 'bg-green-50',
                activity.type === 'login' && 'bg-blue-50',
                activity.type === 'profile' && 'bg-purple-50',
                activity.type === 'payment' && 'bg-emerald-50'
              ]">
                <Calendar v-if="activity.type === 'booking'" class="w-5 h-5 text-green-600" />
                <LogIn v-if="activity.type === 'login'" class="w-5 h-5 text-blue-600" />
                <User v-if="activity.type === 'profile'" class="w-5 h-5 text-purple-600" />
                <CreditCard v-if="activity.type === 'payment'" class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bookings List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button @click="navigateTo('/admin/bookings')" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ booking.id }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ booking.property }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ booking.date }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${{ booking.amount }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      booking.status === 'completed' && 'bg-green-100 text-green-800',
                      booking.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                      booking.status === 'cancelled' && 'bg-red-100 text-red-800'
                    ]">
                      {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Email</label>
              <p class="text-sm text-gray-900 mt-1">{{ user.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Phone</label>
              <p class="text-sm text-gray-900 mt-1">{{ user.phone }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-600">Address</label>
              <p class="text-sm text-gray-900 mt-1">{{ user.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Mail, Edit, CheckCircle, Ban, Trash2, Calendar, LogIn, User, CreditCard } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const route = useRoute()
const userId = route.params.id

// Mock user data - in a real app, this would be fetched from an API
const user = {
  id: userId,
  name: 'Sarah Johnson',
  initials: 'SJ',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, New York, NY 10001',
  role: 'user',
  status: 'active',
  joinedDate: 'Dec 15, 2024',
  lastLogin: '2 hours ago',
  bookingsCount: 12,
  totalSpent: 1450
}

const activityHistory = [
  {
    id: 1,
    type: 'booking',
    title: 'New Booking Created',
    description: 'Booked Premium Suite at Downtown Plaza',
    timestamp: 'Dec 18, 2024 at 10:30 AM'
  },
  {
    id: 2,
    type: 'payment',
    title: 'Payment Processed',
    description: 'Paid $45.00 for booking #BC-12345',
    timestamp: 'Dec 18, 2024 at 10:28 AM'
  },
  {
    id: 3,
    type: 'login',
    title: 'Account Login',
    description: 'Logged in from New York, NY',
    timestamp: 'Dec 18, 2024 at 10:15 AM'
  },
  {
    id: 4,
    type: 'profile',
    title: 'Profile Updated',
    description: 'Updated contact information',
    timestamp: 'Dec 17, 2024 at 3:45 PM'
  },
  {
    id: 5,
    type: 'booking',
    title: 'Booking Completed',
    description: 'Completed stay at Executive Lounge',
    timestamp: 'Dec 16, 2024 at 6:00 PM'
  }
]

const bookings = [
  {
    id: '#BC-12345',
    property: 'Premium Suite',
    date: 'Dec 18, 2024',
    amount: 45,
    status: 'confirmed'
  },
  {
    id: '#BC-12344',
    property: 'Executive Lounge',
    date: 'Dec 16, 2024',
    amount: 35,
    status: 'completed'
  },
  {
    id: '#BC-12343',
    property: 'Deluxe Bathroom',
    date: 'Dec 14, 2024',
    amount: 50,
    status: 'completed'
  },
  {
    id: '#BC-12342',
    property: 'Standard Suite',
    date: 'Dec 12, 2024',
    amount: 30,
    status: 'completed'
  },
  {
    id: '#BC-12341',
    property: 'Premium Suite',
    date: 'Dec 10, 2024',
    amount: 45,
    status: 'cancelled'
  }
]
</script>

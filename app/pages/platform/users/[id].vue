<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/platform/users" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
          <div v-if="user" class="text-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mx-auto">
              {{ userInitials }}
            </div>
            <h2 class="text-xl font-bold text-gray-900 mt-4">{{ userName }}</h2>
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
              <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>

          <div v-if="user" class="mt-6 pt-6 border-t border-gray-200 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Member Since</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(user.createdAt) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Bookings</span>
              <span class="text-sm font-medium text-gray-900">{{ bookings.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Spent</span>
              <span class="text-sm font-medium text-gray-900">${{ totalSpent.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Last Updated</span>
              <span class="text-sm font-medium text-gray-900">{{ formatTimeAgo(user.updatedAt) }}</span>
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
        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div v-if="bookings.length > 0" class="space-y-4">
            <div v-for="booking in bookings.slice(0, 5)" :key="booking.id" class="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div class="p-2 rounded-lg bg-green-50">
                <Calendar class="w-5 h-5 text-green-600" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">{{ booking.property?.name || 'Property' }}</p>
                <p class="text-sm text-gray-600 mt-1">${{ (booking.totalAmount / 100).toFixed(2) }} - {{ booking.status }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(booking.createdAt) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            No bookings yet
          </div>
        </div>

        <!-- Bookings List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button @click="navigateTo('/platform/bookings')" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
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
                <tr v-for="booking in bookings.slice(0, 10)" :key="booking.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ booking.id }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ booking.property?.name || 'N/A' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ formatDate(booking.startTime) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${{ (booking.totalAmount / 100).toFixed(2) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      booking.status === 'completed' && 'bg-green-100 text-green-800',
                      booking.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                      booking.status === 'cancelled' && 'bg-red-100 text-red-800',
                      booking.status === 'pending' && 'bg-yellow-100 text-yellow-800'
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
        <div v-if="user" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-600">Email</label>
              <p class="text-sm text-gray-900 mt-1">{{ user.email }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-600">Phone</label>
              <p class="text-sm text-gray-900 mt-1">{{ user.phone || 'Not provided' }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-600">User ID</label>
              <p class="text-sm text-gray-900 mt-1 font-mono">{{ user.id }}</p>
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
  middleware: 'admin',
})

const route = useRoute()
const payload = usePayload()
const { toast } = useToast()
const userId = route.params.id as string

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: 'user' | 'provider' | 'admin'
  createdAt: string
  updatedAt: string
}

const user = ref<any>(null)
const bookings = ref<any[]>([])
const loading = ref(true)

// Computed properties
const userInitials = computed(() => {
  if (!user.value) return ''
  const first = user.value.firstName?.[0] || ''
  const last = user.value.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase()
})

const userName = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
})

const totalSpent = computed(() => {
  return Math.round(bookings.value.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / 100)
})

// Fetch user data
onMounted(async () => {
  try {
    loading.value = true

    // Fetch user
    user.value = await payload.findByID<UserData>('users', userId)

    // Fetch user's bookings
    const bookingsResponse = await payload.find('bookings', {
      where: { user: { equals: userId } },
      limit: 100,
      depth: 2,
      sort: '-createdAt'
    })

    bookings.value = bookingsResponse.docs

  } catch (error) {
    console.error('Failed to fetch user data:', error)
  } finally {
    loading.value = false
  }
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return `${seconds} seconds ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}

async function changeUserRole(newRole: string) {
  try {
    await payload.update('users', userId, { role: newRole })
    if (user.value) {
      user.value.role = newRole
    }
    toast.success('User role updated')
  } catch (error) {
    console.error('Failed to update user role:', error)
    toast.error('Failed to update user role')
  }
}
</script>

<script setup lang="ts">
import {
  Calendar,
  Search,
  Filter,
  Download,
  MessageSquare,
  Eye,
  X,
  Clock,
  DollarSign,
  MapPin,
  User
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const auth = useAuth()
const payload = usePayload()
const { toast } = useToast()

interface Booking {
  id: string
  user: { id: string, firstName: string, lastName: string, email: string }
  property: { id: string, name: string, location: { address: string, city: string, state: string } }
  startTime: string
  endTime: string
  totalAmount: number
  status: string
}

const searchQuery = ref('')
const selectedTab = ref('all')
const showDatePicker = ref(false)

// Fetch all bookings for provider's properties
const { data: bookingsData, refresh: refreshBookings } = await useAsyncData('provider-bookings-page', async () => {
  if (!auth.user.value?.id) return null
  return await payload.find<Booking>('bookings', {
    where: {
      'property.owner': { equals: auth.user.value.id }
    },
    depth: 2,
    limit: 200,
    sort: '-createdAt'
  })
})

const allBookings = computed(() => bookingsData.value?.docs || [])

// Transform bookings for display
const bookings = computed(() => {
  return allBookings.value.map(booking => {
    const user = booking.user
    const property = booking.property
    const startTime = new Date(booking.startTime)
    const endTime = new Date(booking.endTime)
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const bookingDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate())

    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''
    const email = typeof user === 'object' ? user.email : ''
    const propertyName = typeof property === 'object' ? property.name : 'Unknown Property'
    const propertyAddress = typeof property === 'object' && property.location
      ? `${property.location.address}, ${property.location.city}`
      : 'Unknown Address'

    // Determine category
    let category = 'completed'
    if (booking.status === 'confirmed' || booking.status === 'in-progress') {
      if (bookingDate.getTime() === today.getTime()) {
        category = 'today'
      } else if (bookingDate > today) {
        category = 'upcoming'
      }
    }

    return {
      id: booking.id,
      guest: {
        name: `${firstName} ${lastName}`.trim(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
        email
      },
      property: {
        name: propertyName,
        address: propertyAddress
      },
      date: startTime.toISOString().split('T')[0],
      time: startTime.toTimeString().slice(0, 5),
      duration,
      amount: booking.totalAmount / 100, // Convert from cents to dollars
      status: booking.status,
      category
    }
  })
})

// Calculate tab counts
const tabs = computed(() => {
  const all = bookings.value.length
  const today = bookings.value.filter(b => b.category === 'today').length
  const upcoming = bookings.value.filter(b => b.category === 'upcoming').length
  const completed = bookings.value.filter(b => b.category === 'completed').length

  return [
    { value: 'all', label: 'All Bookings', count: all },
    { value: 'today', label: 'Today', count: today },
    { value: 'upcoming', label: 'Upcoming', count: upcoming },
    { value: 'completed', label: 'Completed', count: completed }
  ]
})

// Filter bookings
const filteredBookings = computed(() => {
  let filtered = bookings.value

  if (selectedTab.value !== 'all') {
    filtered = filtered.filter(b => b.category === selectedTab.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(b =>
      b.guest.name.toLowerCase().includes(query) ||
      b.property.name.toLowerCase().includes(query) ||
      b.id.toLowerCase().includes(query)
    )
  }

  return filtered
})

const updateBookingStatus = async (bookingId: string, newStatus: string) => {
  try {
    await payload.update('bookings', bookingId, { status: newStatus })
    await refreshBookings()
    toast.success('Booking status updated')
  } catch (error) {
    console.error('Failed to update booking status:', error)
    toast.error('Failed to update booking status')
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    confirmed: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
}

const getStatusLabel = (status: string) => {
  const labels = {
    confirmed: 'Confirmed',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return labels[status as keyof typeof labels] || status
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Bookings</h1>
        <p class="mt-2 text-gray-600">Manage incoming reservations for your properties</p>
      </div>
      <button class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
        <Download class="w-5 h-5" />
        Export
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by guest, property, or booking ID..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Date Range Picker -->
        <div class="relative">
          <button
            @click="showDatePicker = !showDatePicker"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar class="w-5 h-5" />
            Date Range
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 mt-4 overflow-x-auto pb-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="selectedTab = tab.value"
          :class="[
            'px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
            selectedTab === tab.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tab.label }}
          <span :class="[
            'ml-2 px-2 py-0.5 rounded-full text-xs',
            selectedTab === tab.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          ]">
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Bookings List -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ booking.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                    {{ booking.guest.avatar }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ booking.guest.name }}</div>
                    <div class="text-xs text-gray-500">{{ booking.guest.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="max-w-xs">
                  <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ booking.property.name }}</div>
                  <div class="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin class="w-3 h-3" />
                    {{ booking.property.address }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2 text-sm text-gray-900">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  {{ booking.date }}
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Clock class="w-3 h-3" />
                  {{ booking.time }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ booking.duration }} min</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <DollarSign class="w-4 h-4 text-green-600" />
                  {{ booking.amount.toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`">
                  {{ getStatusLabel(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <button
                    @click="console.log('View booking:', booking.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    @click="console.log('Message guest:', booking.guest.name)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Message Guest"
                  >
                    <MessageSquare class="w-4 h-4" />
                  </button>
                  <button
                    v-if="booking.status !== 'completed' && booking.status !== 'cancelled'"
                    @click="updateBookingStatus(booking.id, 'cancelled')"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredBookings.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
        <p class="text-gray-600">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'You don\'t have any bookings yet' }}
        </p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredBookings.length > 0" class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredBookings.length }}</span> of <span class="font-medium">{{ filteredBookings.length }}</span> results
      </div>
      <div class="flex gap-2">
        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Previous
        </button>
        <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">All Bookings</h1>
      <p class="text-gray-600 mt-1">Manage all platform bookings</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search by Confirmation Code -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Confirmation code or email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <!-- Date From -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
          <div class="relative">
            <Calendar class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="dateFrom"
              type="date"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Date To -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
          <div class="relative">
            <Calendar class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="dateTo"
              type="date"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Bookings Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmation</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <Hash class="w-4 h-4 text-gray-400" />
                  <span class="text-sm font-mono font-medium text-gray-900">{{ booking.confirmationCode }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ booking.userName }}</div>
                  <div class="text-sm text-gray-500">{{ booking.userEmail }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ booking.providerName }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ booking.property }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ booking.date }}</div>
                  <div class="text-sm text-gray-500">{{ booking.time }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">${{ booking.amount.toFixed(2) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  booking.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                  booking.status === 'completed' && 'bg-green-100 text-green-800',
                  booking.status === 'cancelled' && 'bg-red-100 text-red-800',
                  booking.status === 'refunded' && 'bg-orange-100 text-orange-800'
                ]">
                  {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="selectedBooking = booking"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye class="w-4 h-4" />
                  </button>
                  <button
                    v-if="booking.status === 'confirmed'"
                    @click="console.log('Cancel booking:', booking.confirmationCode)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  <button
                    v-if="booking.status === 'completed' || booking.status === 'cancelled'"
                    @click="console.log('Process refund for booking:', booking.confirmationCode)"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Process Refund"
                  >
                    <DollarSign class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ bookings.length }}</span> results
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <div
      v-if="selectedBooking"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedBooking = null"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h2 class="text-xl font-bold text-white">Booking Details</h2>
            <p class="text-blue-100 text-sm mt-1">{{ selectedBooking.confirmationCode }}</p>
          </div>
          <button
            @click="selectedBooking = null"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- User & Provider Info -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">User Information</h3>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-500">Name</p>
                  <p class="text-sm text-gray-900">{{ selectedBooking.userName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm text-gray-900">{{ selectedBooking.userEmail }}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Provider Information</h3>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-500">Provider</p>
                  <p class="text-sm text-gray-900">{{ selectedBooking.providerName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Property</p>
                  <p class="text-sm text-gray-900">{{ selectedBooking.property }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Booking Details -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Booking Details</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500">Date</p>
                <p class="text-sm text-gray-900">{{ selectedBooking.date }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Time</p>
                <p class="text-sm text-gray-900">{{ selectedBooking.time }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Amount</p>
                <p class="text-sm font-semibold text-gray-900">${{ selectedBooking.amount.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Status</p>
                <span :class="[
                  'inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full',
                  selectedBooking.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                  selectedBooking.status === 'completed' && 'bg-green-100 text-green-800',
                  selectedBooking.status === 'cancelled' && 'bg-red-100 text-red-800',
                  selectedBooking.status === 'refunded' && 'bg-orange-100 text-orange-800'
                ]">
                  {{ selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-lg">
          <button
            @click="selectedBooking = null"
            class="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            v-if="selectedBooking.status === 'confirmed'"
            @click="console.log('Cancel booking:', selectedBooking.confirmationCode); selectedBooking = null"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cancel Booking
          </button>
          <button
            v-if="selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled'"
            @click="console.log('Process refund for booking:', selectedBooking.confirmationCode); selectedBooking = null"
            class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Process Refund
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Calendar, Hash, Eye, X, DollarSign, ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const searchQuery = ref('')
const selectedStatus = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const selectedBooking = ref(null)

const bookings = [
  {
    id: 1,
    confirmationCode: 'BC-12345',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    providerName: 'Luxury Towers',
    property: 'Premium Suite A',
    date: 'Dec 20, 2024',
    time: '10:00 AM - 11:00 AM',
    amount: 25.00,
    status: 'confirmed'
  },
  {
    id: 2,
    confirmationCode: 'BC-12346',
    userName: 'Michael Chen',
    userEmail: 'michael.c@example.com',
    providerName: 'Downtown Plaza',
    property: 'Executive Lounge',
    date: 'Dec 19, 2024',
    time: '2:00 PM - 3:00 PM',
    amount: 30.00,
    status: 'completed'
  },
  {
    id: 3,
    confirmationCode: 'BC-12347',
    userName: 'Emma Davis',
    userEmail: 'emma.d@example.com',
    providerName: 'City Center',
    property: 'Standard Bathroom',
    date: 'Dec 18, 2024',
    time: '11:30 AM - 12:00 PM',
    amount: 15.00,
    status: 'refunded'
  },
  {
    id: 4,
    confirmationCode: 'BC-12348',
    userName: 'David Wilson',
    userEmail: 'david.w@example.com',
    providerName: 'Metro Business Park',
    property: 'Deluxe Suite B',
    date: 'Dec 21, 2024',
    time: '9:00 AM - 10:00 AM',
    amount: 28.00,
    status: 'confirmed'
  },
  {
    id: 5,
    confirmationCode: 'BC-12349',
    userName: 'Jessica Martinez',
    userEmail: 'jessica.m@example.com',
    providerName: 'Executive Suites',
    property: 'Premium Bathroom',
    date: 'Dec 17, 2024',
    time: '3:30 PM - 4:00 PM',
    amount: 20.00,
    status: 'completed'
  },
  {
    id: 6,
    confirmationCode: 'BC-12350',
    userName: 'Ryan Thompson',
    userEmail: 'ryan.t@example.com',
    providerName: 'Luxury Towers',
    property: 'VIP Lounge',
    date: 'Dec 16, 2024',
    time: '1:00 PM - 2:00 PM',
    amount: 35.00,
    status: 'cancelled'
  },
  {
    id: 7,
    confirmationCode: 'BC-12351',
    userName: 'Ashley Brown',
    userEmail: 'ashley.b@example.com',
    providerName: 'Downtown Plaza',
    property: 'Standard Suite',
    date: 'Dec 22, 2024',
    time: '4:00 PM - 5:00 PM',
    amount: 22.00,
    status: 'confirmed'
  },
  {
    id: 8,
    confirmationCode: 'BC-12352',
    userName: 'James Anderson',
    userEmail: 'james.a@example.com',
    providerName: 'City Center',
    property: 'Executive Bathroom',
    date: 'Dec 15, 2024',
    time: '12:00 PM - 1:00 PM',
    amount: 26.00,
    status: 'completed'
  },
  {
    id: 9,
    confirmationCode: 'BC-12353',
    userName: 'Olivia Garcia',
    userEmail: 'olivia.g@example.com',
    providerName: 'Metro Business Park',
    property: 'Premium Suite C',
    date: 'Dec 23, 2024',
    time: '10:30 AM - 11:30 AM',
    amount: 32.00,
    status: 'confirmed'
  },
  {
    id: 10,
    confirmationCode: 'BC-12354',
    userName: 'Daniel Lee',
    userEmail: 'daniel.l@example.com',
    providerName: 'Executive Suites',
    property: 'Deluxe Lounge',
    date: 'Dec 14, 2024',
    time: '5:00 PM - 6:00 PM',
    amount: 29.00,
    status: 'completed'
  }
]

const filteredBookings = computed(() => {
  return bookings.filter(booking => {
    const matchesSearch = !searchQuery.value ||
      booking.confirmationCode.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || booking.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})
</script>

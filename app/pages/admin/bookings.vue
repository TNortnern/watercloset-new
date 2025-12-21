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
                  <span class="text-sm font-mono font-medium text-gray-900">{{ booking.id }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ getUserName(booking) }}</div>
                  <div class="text-sm text-gray-500">{{ getUserEmail(booking) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getProviderName(booking) }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ getPropertyName(booking) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ formatDate(booking.startTime) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(booking.startTime, booking.endTime) }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">${{ ((booking.totalAmount || 0) / 100).toFixed(2) }}</div>
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
                    @click="cancelBooking(booking.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Booking"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  <button
                    v-if="booking.status === 'completed' || booking.status === 'cancelled'"
                    @click="processRefund(booking.id)"
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
            <p class="text-blue-100 text-sm mt-1">{{ selectedBooking.id }}</p>
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
                  <p class="text-sm text-gray-900">{{ getUserName(selectedBooking) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm text-gray-900">{{ getUserEmail(selectedBooking) }}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Provider Information</h3>
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-gray-500">Provider</p>
                  <p class="text-sm text-gray-900">{{ getProviderName(selectedBooking) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Property</p>
                  <p class="text-sm text-gray-900">{{ getPropertyName(selectedBooking) }}</p>
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
                <p class="text-sm text-gray-900">{{ formatDate(selectedBooking.startTime) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Time</p>
                <p class="text-sm text-gray-900">{{ formatTime(selectedBooking.startTime, selectedBooking.endTime) }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Amount</p>
                <p class="text-sm font-semibold text-gray-900">${{ ((selectedBooking.totalAmount || 0) / 100).toFixed(2) }}</p>
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
            @click="cancelBooking(selectedBooking.id)"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cancel Booking
          </button>
          <button
            v-if="selectedBooking.status === 'completed' || selectedBooking.status === 'cancelled'"
            @click="processRefund(selectedBooking.id)"
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
  middleware: 'admin',
})

const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

const loading = ref(true)
const bookings = ref<any[]>([])
const searchQuery = ref('')
const selectedStatus = ref('all')
const dateFrom = ref('')
const dateTo = ref('')
const selectedBooking = ref<any>(null)

onMounted(async () => {
  await fetchBookings()
})

async function fetchBookings() {
  try {
    loading.value = true
    const response = await payload.find('bookings', {
      limit: 1000,
      depth: 2,
      sort: '-createdAt'
    })
    bookings.value = response.docs
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
  } finally {
    loading.value = false
  }
}

const filteredBookings = computed(() => {
  return bookings.value.filter(booking => {
    const matchesSearch = !searchQuery.value ||
      booking.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (booking.user?.email || '').toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || booking.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

function getUserName(booking: any): string {
  if (typeof booking.user === 'string') return 'Loading...'
  return `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim() || booking.user?.email || 'Unknown'
}

function getUserEmail(booking: any): string {
  if (typeof booking.user === 'string') return ''
  return booking.user?.email || ''
}

function getProviderName(booking: any): string {
  if (typeof booking.property === 'string') return 'Loading...'
  const owner = booking.property?.owner
  if (typeof owner === 'string') return 'Loading...'
  return `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || owner?.email || 'Unknown'
}

function getPropertyName(booking: any): string {
  if (typeof booking.property === 'string') return 'Loading...'
  return booking.property?.name || 'Unknown Property'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(startTime: string, endTime: string): string {
  const start = new Date(startTime)
  const end = new Date(endTime)
  return `${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

async function cancelBooking(bookingId: string) {
  const confirmed = await confirm({
    title: 'Cancel Booking',
    message: 'Are you sure you want to cancel this booking?',
    confirmText: 'Cancel Booking',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await payload.update('bookings', bookingId, { status: 'cancelled' })
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) booking.status = 'cancelled'
    selectedBooking.value = null
    toast.success('Booking cancelled')
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    toast.error('Failed to cancel booking')
  }
}

async function processRefund(bookingId: string) {
  const confirmed = await confirm({
    title: 'Process Refund',
    message: 'Are you sure you want to process a refund for this booking?',
    confirmText: 'Process Refund',
    variant: 'default',
  })
  if (!confirmed) return
  try {
    await payload.update('bookings', bookingId, { status: 'refunded' })
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) booking.status = 'refunded'
    selectedBooking.value = null
    toast.success('Refund processed')
  } catch (error) {
    console.error('Failed to process refund:', error)
    toast.error('Failed to process refund')
  }
}
</script>

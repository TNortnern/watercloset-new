<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Refund Requests</h1>
      <p class="text-gray-600 mt-1">Manage and process refund requests</p>
    </div>

    <!-- Filter Tabs -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        :class="[
          'px-6 py-2 rounded-md text-sm font-medium transition-colors relative',
          activeTab === tab.value
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        ]"
      >
        {{ tab.label }}
        <span
          v-if="tab.count > 0"
          :class="[
            'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
            activeTab === tab.value
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Refund Requests List -->
    <div class="space-y-4">
      <div
        v-for="request in filteredRequests"
        :key="request.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-start justify-between">
            <!-- Left Side: Request Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-3">
                <div class="p-2 bg-orange-50 rounded-lg">
                  <DollarSign class="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Request #{{ request.requestId }}</h3>
                  <p class="text-sm text-gray-500">Booking {{ request.bookingReference }}</p>
                </div>
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  request.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                  request.status === 'processing' && 'bg-blue-100 text-blue-800',
                  request.status === 'completed' && 'bg-green-100 text-green-800',
                  request.status === 'declined' && 'bg-red-100 text-red-800'
                ]">
                  {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div class="flex items-center space-x-2">
                  <User class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-xs text-gray-500">User</p>
                    <p class="text-sm font-medium text-gray-900">{{ request.userName }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <DollarSign class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-xs text-gray-500">Amount</p>
                    <p class="text-sm font-semibold text-gray-900">${{ request.amount.toFixed(2) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-xs text-gray-500">Requested</p>
                    <p class="text-sm text-gray-900">{{ request.requestedDate }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <Clock class="w-4 h-4 text-gray-400" />
                  <div>
                    <p class="text-xs text-gray-500">Booking Date</p>
                    <p class="text-sm text-gray-900">{{ request.bookingDate }}</p>
                  </div>
                </div>
              </div>

              <!-- Reason Preview -->
              <div class="bg-gray-50 rounded-lg p-4">
                <p class="text-xs font-medium text-gray-500 mb-1">Reason:</p>
                <p class="text-sm text-gray-700">{{ request.reason }}</p>
              </div>
            </div>

            <!-- Right Side: Actions -->
            <div class="flex flex-col space-y-2 ml-6">
              <button
                @click="selectedRequest = request"
                class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Eye class="w-4 h-4" />
                <span>View Details</span>
              </button>
              <button
                v-if="request.status === 'pending'"
                @click="approveRefund(request.id)"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Check class="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                v-if="request.status === 'pending'"
                @click="declineRefund(request.id)"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <X class="w-4 h-4" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredRequests.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No refund requests found</h3>
        <p class="text-gray-600">There are no {{ activeTab }} refund requests at this time.</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedRequest"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedRequest = null"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-white">Refund Request Details</h2>
            <p class="text-orange-100 text-sm mt-1">Request #{{ selectedRequest.requestId }}</p>
          </div>
          <button
            @click="selectedRequest = null"
            class="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X class="w-5 h-5 text-white" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Request Overview -->
          <div class="grid grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Request Information</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500">Request ID</p>
                  <p class="text-sm font-medium text-gray-900">#{{ selectedRequest.requestId }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Status</p>
                  <span :class="[
                    'inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full',
                    selectedRequest.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    selectedRequest.status === 'processing' && 'bg-blue-100 text-blue-800',
                    selectedRequest.status === 'completed' && 'bg-green-100 text-green-800',
                    selectedRequest.status === 'declined' && 'bg-red-100 text-red-800'
                  ]">
                    {{ selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1) }}
                  </span>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Requested Amount</p>
                  <p class="text-lg font-bold text-gray-900">${{ selectedRequest.amount.toFixed(2) }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Requested Date</p>
                  <p class="text-sm text-gray-900">{{ selectedRequest.requestedDate }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Booking Information</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-500">Booking Reference</p>
                  <p class="text-sm font-medium text-gray-900">{{ selectedRequest.bookingReference }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">User Name</p>
                  <p class="text-sm text-gray-900">{{ selectedRequest.userName }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">User Email</p>
                  <p class="text-sm text-gray-900">{{ selectedRequest.userEmail }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Booking Date</p>
                  <p class="text-sm text-gray-900">{{ selectedRequest.bookingDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Refund Reason -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Refund Reason</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-sm text-gray-900">{{ selectedRequest.reason }}</p>
            </div>
          </div>

          <!-- Conversation/Activity Log -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Activity Log</h3>
            <div class="space-y-3">
              <div
                v-for="activity in selectedRequest.activityLog"
                :key="activity.id"
                class="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div :class="[
                  'p-2 rounded-lg flex-shrink-0',
                  activity.type === 'request' && 'bg-orange-50',
                  activity.type === 'review' && 'bg-blue-50',
                  activity.type === 'approved' && 'bg-green-50',
                  activity.type === 'declined' && 'bg-red-50'
                ]">
                  <MessageSquare class="w-4 h-4 text-gray-600" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-sm text-gray-600 mt-1">{{ activity.description }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Admin Notes -->
          <div>
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Admin Notes</h3>
            <textarea
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Add internal notes about this refund request..."
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            @click="selectedRequest = null"
            class="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            v-if="selectedRequest.status === 'pending'"
            @click="declineRefund(selectedRequest.id)"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Decline Request
          </button>
          <button
            v-if="selectedRequest.status === 'pending'"
            @click="approveRefund(selectedRequest.id)"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Approve & Process Refund
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DollarSign, User, Calendar, Clock, Eye, Check, X, MessageSquare } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
  middleware: 'admin',
})

const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

interface Booking {
  id: string
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  property: {
    id: string
    name: string
  }
  startTime: string
  totalAmount: number
  status: 'confirmed' | 'completed' | 'cancelled' | 'refunded'
  createdAt: string
  updatedAt: string
}

const activeTab = ref('pending')
const selectedRequest = ref<any>(null)
const loading = ref(true)
const bookings = ref<Booking[]>([])

onMounted(async () => {
  await fetchRefundBookings()
})

async function fetchRefundBookings() {
  try {
    loading.value = true
    // Fetch cancelled and refunded bookings
    const response = await payload.find<Booking>('bookings', {
      where: {
        status: {
          in: ['cancelled', 'refunded']
        }
      },
      limit: 1000,
      depth: 2,
      sort: '-updatedAt'
    })
    bookings.value = response.docs
  } catch (error) {
    console.error('Failed to fetch refund bookings:', error)
  } finally {
    loading.value = false
  }
}

// Transform bookings into refund request format
const refundRequests = computed(() => {
  return bookings.value.map(booking => {
    const user = booking.user
    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''
    const email = typeof user === 'object' ? user.email : ''

    // Map booking status to refund status
    let status = 'pending'
    if (booking.status === 'refunded') {
      status = 'completed'
    } else if (booking.status === 'cancelled') {
      status = 'pending' // Cancelled bookings need refund decision
    }

    const activityLog = [
      {
        id: 1,
        type: 'request',
        title: 'Booking Cancelled',
        description: 'Booking was cancelled and may require refund',
        timestamp: formatDateTime(booking.updatedAt)
      }
    ]

    if (booking.status === 'refunded') {
      activityLog.push({
        id: 2,
        type: 'approved',
        title: 'Refund Processed',
        description: 'Full refund has been processed',
        timestamp: formatDateTime(booking.updatedAt)
      })
    }

    return {
      id: booking.id,
      requestId: `RF-${booking.id.slice(0, 6).toUpperCase()}`,
      bookingReference: `BC-${booking.id.slice(0, 6).toUpperCase()}`,
      userName: `${firstName} ${lastName}`.trim() || email,
      userEmail: email,
      amount: (booking.totalAmount || 0) / 100,
      requestedDate: formatDate(booking.updatedAt),
      bookingDate: formatDate(booking.startTime),
      reason: 'Booking was cancelled by user or provider.',
      status,
      activityLog
    }
  })
})

const tabs = computed(() => {
  const pending = refundRequests.value.filter(r => r.status === 'pending').length
  const processing = refundRequests.value.filter(r => r.status === 'processing').length
  const completed = refundRequests.value.filter(r => r.status === 'completed').length
  const declined = refundRequests.value.filter(r => r.status === 'declined').length

  return [
    { label: 'Pending', value: 'pending', count: pending },
    { label: 'Processing', value: 'processing', count: processing },
    { label: 'Completed', value: 'completed', count: completed },
    { label: 'Declined', value: 'declined', count: declined }
  ]
})

const filteredRequests = computed(() => {
  return refundRequests.value.filter(request => request.status === activeTab.value)
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return `${formatDate(dateString)} at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
}

async function approveRefund(bookingId: string) {
  try {
    await payload.update('bookings', bookingId, { status: 'refunded' })
    await fetchRefundBookings()
    selectedRequest.value = null
    toast.success('Refund processed successfully')
  } catch (error) {
    console.error('Failed to approve refund:', error)
    toast.error('Failed to process refund')
  }
}

async function declineRefund(bookingId: string) {
  const confirmed = await confirm({
    title: 'Decline Refund',
    message: 'Are you sure you want to decline this refund request?',
    confirmText: 'Decline',
    variant: 'destructive',
  })
  if (!confirmed) return

  try {
    // Mark as completed without refund (keep cancelled status)
    // In a real app, you might have a separate refund status field
    await fetchRefundBookings()
    selectedRequest.value = null
    toast.info('Refund declined. Booking remains cancelled without refund.')
  } catch (error) {
    console.error('Failed to decline refund:', error)
    toast.error('Failed to decline refund')
  }
}
</script>

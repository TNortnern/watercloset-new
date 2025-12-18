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
                @click="console.log('Approve refund request:', request.requestId)"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Check class="w-4 h-4" />
                <span>Approve</span>
              </button>
              <button
                v-if="request.status === 'pending'"
                @click="console.log('Decline refund request:', request.requestId)"
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
            @click="console.log('Decline refund request:', selectedRequest.requestId); selectedRequest = null"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Decline Request
          </button>
          <button
            v-if="selectedRequest.status === 'pending'"
            @click="console.log('Approve and process refund:', selectedRequest.requestId); selectedRequest = null"
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
})

const activeTab = ref('pending')
const selectedRequest = ref(null)

const tabs = [
  { label: 'Pending', value: 'pending', count: 4 },
  { label: 'Processing', value: 'processing', count: 2 },
  { label: 'Completed', value: 'completed', count: 8 },
  { label: 'Declined', value: 'declined', count: 1 }
]

const refundRequests = [
  {
    id: 1,
    requestId: 'RF-10001',
    bookingReference: 'BC-12345',
    userName: 'Emma Davis',
    userEmail: 'emma.d@example.com',
    amount: 15.00,
    requestedDate: 'Dec 16, 2024',
    bookingDate: 'Dec 18, 2024',
    reason: 'The facility was not clean when I arrived. There were maintenance issues that made the bathroom unusable.',
    status: 'pending',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'User submitted refund request citing cleanliness issues',
        timestamp: 'Dec 16, 2024 at 2:30 PM'
      }
    ]
  },
  {
    id: 2,
    requestId: 'RF-10002',
    bookingReference: 'BC-12356',
    userName: 'Ryan Thompson',
    userEmail: 'ryan.t@example.com',
    amount: 35.00,
    requestedDate: 'Dec 15, 2024',
    bookingDate: 'Dec 16, 2024',
    reason: 'Had to cancel due to emergency. Could not use the booking.',
    status: 'pending',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'User cancelled booking due to emergency',
        timestamp: 'Dec 15, 2024 at 9:15 AM'
      }
    ]
  },
  {
    id: 3,
    requestId: 'RF-10003',
    bookingReference: 'BC-12367',
    userName: 'John Smith',
    userEmail: 'john.s@example.com',
    amount: 22.00,
    requestedDate: 'Dec 14, 2024',
    bookingDate: 'Dec 15, 2024',
    reason: 'Facility was closed when I arrived despite having a confirmed booking.',
    status: 'pending',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Facility was closed upon arrival',
        timestamp: 'Dec 14, 2024 at 4:45 PM'
      }
    ]
  },
  {
    id: 4,
    requestId: 'RF-10004',
    bookingReference: 'BC-12378',
    userName: 'Lisa Anderson',
    userEmail: 'lisa.a@example.com',
    amount: 18.00,
    requestedDate: 'Dec 13, 2024',
    bookingDate: 'Dec 14, 2024',
    reason: 'Double charged for the booking. Need refund for duplicate transaction.',
    status: 'pending',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Duplicate charge reported',
        timestamp: 'Dec 13, 2024 at 11:20 AM'
      }
    ]
  },
  {
    id: 5,
    requestId: 'RF-10005',
    bookingReference: 'BC-12389',
    userName: 'Michael Brown',
    userEmail: 'michael.b@example.com',
    amount: 28.00,
    requestedDate: 'Dec 12, 2024',
    bookingDate: 'Dec 13, 2024',
    reason: 'Amenities advertised were not available.',
    status: 'processing',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Missing advertised amenities',
        timestamp: 'Dec 12, 2024 at 3:00 PM'
      },
      {
        id: 2,
        type: 'review',
        title: 'Under Review',
        description: 'Admin team reviewing the request',
        timestamp: 'Dec 12, 2024 at 5:30 PM'
      }
    ]
  },
  {
    id: 6,
    requestId: 'RF-10006',
    bookingReference: 'BC-12390',
    userName: 'Sarah Wilson',
    userEmail: 'sarah.w@example.com',
    amount: 20.00,
    requestedDate: 'Dec 11, 2024',
    bookingDate: 'Dec 12, 2024',
    reason: 'Accessibility features not as described.',
    status: 'processing',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Accessibility issues reported',
        timestamp: 'Dec 11, 2024 at 1:15 PM'
      },
      {
        id: 2,
        type: 'review',
        title: 'Under Review',
        description: 'Verifying accessibility claims with provider',
        timestamp: 'Dec 11, 2024 at 4:00 PM'
      }
    ]
  },
  {
    id: 7,
    requestId: 'RF-10007',
    bookingReference: 'BC-12391',
    userName: 'David Chen',
    userEmail: 'david.c@example.com',
    amount: 25.00,
    requestedDate: 'Dec 8, 2024',
    bookingDate: 'Dec 9, 2024',
    reason: 'Facility maintenance made the space unusable.',
    status: 'completed',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Maintenance issues reported',
        timestamp: 'Dec 8, 2024 at 10:00 AM'
      },
      {
        id: 2,
        type: 'review',
        title: 'Under Review',
        description: 'Reviewing maintenance logs',
        timestamp: 'Dec 8, 2024 at 2:00 PM'
      },
      {
        id: 3,
        type: 'approved',
        title: 'Refund Approved',
        description: 'Full refund processed',
        timestamp: 'Dec 9, 2024 at 11:00 AM'
      }
    ]
  },
  {
    id: 8,
    requestId: 'RF-10008',
    bookingReference: 'BC-12392',
    userName: 'Tom Harris',
    userEmail: 'tom.h@example.com',
    amount: 12.00,
    requestedDate: 'Dec 5, 2024',
    bookingDate: 'Dec 6, 2024',
    reason: 'Changed mind about the booking.',
    status: 'declined',
    activityLog: [
      {
        id: 1,
        type: 'request',
        title: 'Refund Request Submitted',
        description: 'Cancellation request',
        timestamp: 'Dec 5, 2024 at 8:00 AM'
      },
      {
        id: 2,
        type: 'review',
        title: 'Under Review',
        description: 'Reviewing cancellation policy',
        timestamp: 'Dec 5, 2024 at 10:00 AM'
      },
      {
        id: 3,
        type: 'declined',
        title: 'Refund Declined',
        description: 'Outside cancellation window per policy',
        timestamp: 'Dec 5, 2024 at 3:00 PM'
      }
    ]
  }
]

const filteredRequests = computed(() => {
  return refundRequests.filter(request => request.status === activeTab.value)
})
</script>

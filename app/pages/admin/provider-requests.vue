<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Provider Applications</h1>
      <p class="text-gray-600 mt-1">Review and manage provider requests</p>
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

    <!-- Applications List -->
    <div class="grid grid-cols-1 gap-6">
      <div
        v-for="application in filteredApplications"
        :key="application.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <!-- Left Side: Application Info -->
          <div class="flex-1">
            <div class="flex items-start space-x-4">
              <!-- Avatar -->
              <div class="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {{ application.initials }}
              </div>

              <!-- Details -->
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{ application.name }}</h3>
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    application.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                    application.status === 'approved' && 'bg-green-100 text-green-800',
                    application.status === 'rejected' && 'bg-red-100 text-red-800'
                  ]">
                    {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ application.email }}</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div class="flex items-center space-x-2 text-sm">
                    <Calendar class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">Submitted: <span class="font-medium text-gray-900">{{ application.submittedDate }}</span></span>
                  </div>
                  <div class="flex items-center space-x-2 text-sm">
                    <Building2 class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">Properties: <span class="font-medium text-gray-900">{{ application.propertyCount }}</span></span>
                  </div>
                  <div class="flex items-center space-x-2 text-sm">
                    <Shield class="w-4 h-4 text-gray-400" />
                    <span class="text-gray-600">ID Verification:
                      <span :class="[
                        'font-medium ml-1',
                        application.idVerified ? 'text-green-600' : 'text-orange-600'
                      ]">
                        {{ application.idVerified ? 'Verified' : 'Pending' }}
                      </span>
                    </span>
                  </div>
                </div>

                <!-- Business Description Preview -->
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p class="text-sm text-gray-700">{{ application.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side: Actions -->
          <div class="flex flex-col space-y-2 ml-6">
            <button
              v-if="application.status === 'pending'"
              @click="console.log('Approve provider application:', application.id)"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Check class="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              v-if="application.status === 'pending'"
              @click="console.log('Reject provider application:', application.id)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <X class="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              @click="selectedApplication = application"
              class="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Eye class="w-4 h-4" />
              <span>View Details</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredApplications.length === 0" class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No applications found</h3>
        <p class="text-gray-600">There are no {{ activeTab }} provider applications at this time.</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedApplication"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedApplication = null"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900">Application Details</h2>
          <button
            @click="selectedApplication = null"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X class="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Applicant Info -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Full Name</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.name }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Email</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.email }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Phone</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.phone }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Submitted Date</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.submittedDate }}</p>
              </div>
            </div>
          </div>

          <!-- Business Info -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-500">Business Description</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.description }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Number of Properties</p>
                <p class="text-sm text-gray-900 mt-1">{{ selectedApplication.propertyCount }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">ID Verification</p>
                <p :class="[
                  'text-sm mt-1 font-medium',
                  selectedApplication.idVerified ? 'text-green-600' : 'text-orange-600'
                ]">
                  {{ selectedApplication.idVerified ? 'Verified' : 'Pending Verification' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Documents Placeholder -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <FileText class="w-5 h-5 text-gray-400" />
                  <span class="text-sm text-gray-900">Business License.pdf</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">Download</button>
              </div>
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                  <FileText class="w-5 h-5 text-gray-400" />
                  <span class="text-sm text-gray-900">ID Verification.pdf</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">Download</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            @click="selectedApplication = null"
            class="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            v-if="selectedApplication.status === 'pending'"
            @click="console.log('Reject provider application:', selectedApplication.id); selectedApplication = null"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reject Application
          </button>
          <button
            v-if="selectedApplication.status === 'pending'"
            @click="console.log('Approve provider application:', selectedApplication.id); selectedApplication = null"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Approve Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shield, Calendar, Building2, Check, X, Eye, FileText } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const activeTab = ref('pending')
const selectedApplication = ref(null)

const tabs = [
  { label: 'Pending', value: 'pending', count: 5 },
  { label: 'Approved', value: 'approved', count: 12 },
  { label: 'Rejected', value: 'rejected', count: 3 }
]

const applications = [
  {
    id: 1,
    name: 'Luxury Towers Inc',
    initials: 'LT',
    email: 'contact@luxurytowers.com',
    phone: '+1 (555) 123-4567',
    submittedDate: 'Dec 15, 2024',
    propertyCount: 3,
    idVerified: true,
    status: 'pending',
    description: 'Premium commercial building with state-of-the-art facilities in downtown area. We specialize in high-end office spaces and executive lounges.'
  },
  {
    id: 2,
    name: 'Downtown Plaza',
    initials: 'DP',
    email: 'info@downtownplaza.com',
    phone: '+1 (555) 234-5678',
    submittedDate: 'Dec 12, 2024',
    propertyCount: 5,
    idVerified: true,
    status: 'pending',
    description: 'Multi-purpose commercial complex with retail, dining, and office spaces. Located in the heart of the business district.'
  },
  {
    id: 3,
    name: 'City Center Management',
    initials: 'CC',
    email: 'admin@citycenter.com',
    phone: '+1 (555) 345-6789',
    submittedDate: 'Dec 10, 2024',
    propertyCount: 8,
    idVerified: false,
    status: 'pending',
    description: 'Large-scale commercial property management company overseeing multiple buildings across the metropolitan area.'
  },
  {
    id: 4,
    name: 'Executive Suites Co',
    initials: 'ES',
    email: 'contact@executivesuites.com',
    phone: '+1 (555) 456-7890',
    submittedDate: 'Dec 8, 2024',
    propertyCount: 2,
    idVerified: true,
    status: 'pending',
    description: 'Boutique office building offering premium executive suites and meeting rooms with concierge services.'
  },
  {
    id: 5,
    name: 'Metro Business Park',
    initials: 'MB',
    email: 'info@metrobusinesspark.com',
    phone: '+1 (555) 567-8901',
    submittedDate: 'Dec 5, 2024',
    propertyCount: 12,
    idVerified: true,
    status: 'pending',
    description: 'Expansive business park with modern facilities, ample parking, and convenient access to public transportation.'
  },
  {
    id: 6,
    name: 'Riverside Commercial',
    initials: 'RC',
    email: 'contact@riversidecommercial.com',
    phone: '+1 (555) 678-9012',
    submittedDate: 'Nov 28, 2024',
    propertyCount: 4,
    idVerified: true,
    status: 'approved',
    description: 'Waterfront commercial properties with scenic views and modern amenities for businesses of all sizes.'
  },
  {
    id: 7,
    name: 'Tech Hub Buildings',
    initials: 'TH',
    email: 'admin@techhub.com',
    phone: '+1 (555) 789-0123',
    submittedDate: 'Nov 20, 2024',
    propertyCount: 6,
    idVerified: true,
    status: 'approved',
    description: 'Innovation-focused workspace designed for tech startups and established companies in the technology sector.'
  },
  {
    id: 8,
    name: 'Budget Office Spaces',
    initials: 'BO',
    email: 'info@budgetoffices.com',
    phone: '+1 (555) 890-1234',
    submittedDate: 'Nov 15, 2024',
    propertyCount: 1,
    idVerified: false,
    status: 'rejected',
    description: 'Affordable office solutions for small businesses. Application rejected due to incomplete documentation.'
  }
]

const filteredApplications = computed(() => {
  return applications.filter(app => app.status === activeTab.value)
})
</script>

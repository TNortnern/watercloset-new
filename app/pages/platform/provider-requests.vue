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
              @click="approveProvider(application.id)"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Check class="w-4 h-4" />
              <span>Approve</span>
            </button>
            <button
              v-if="application.status === 'pending'"
              @click="rejectProvider(application.id)"
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
            @click="rejectProvider(selectedApplication.id)"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Reject Application
          </button>
          <button
            v-if="selectedApplication.status === 'pending'"
            @click="approveProvider(selectedApplication.id)"
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
  middleware: 'admin',
})

const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

interface Property {
  id: string
  name: string
  status: 'pending' | 'active' | 'inactive' | 'suspended'
  owner: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    createdAt: string
  }
  createdAt: string
}

const activeTab = ref('pending')
const selectedApplication = ref<any>(null)
const loading = ref(true)
const properties = ref<Property[]>([])

// Fetch properties with their owners
onMounted(async () => {
  await fetchProperties()
})

async function fetchProperties() {
  try {
    loading.value = true
    const response = await payload.find<Property>('properties', {
      limit: 1000,
      depth: 2,
      sort: '-createdAt'
    })
    properties.value = response.docs
  } catch (error) {
    console.error('Failed to fetch properties:', error)
  } finally {
    loading.value = false
  }
}

// Group properties by owner to create "applications"
const applications = computed(() => {
  const ownerMap = new Map<string, any>()

  properties.value.forEach(property => {
    if (typeof property.owner === 'string') return

    const ownerId = property.owner?.id
    if (!ownerId) return

    if (!ownerMap.has(ownerId)) {
      const owner = property.owner
      const firstName = owner.firstName || ''
      const lastName = owner.lastName || ''
      const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'XX'

      ownerMap.set(ownerId, {
        id: ownerId,
        name: `${firstName} ${lastName}`.trim() || owner.email,
        initials,
        email: owner.email,
        phone: owner.phone || 'Not provided',
        submittedDate: formatDate(owner.createdAt),
        properties: [],
        idVerified: true, // Assume verified if they have properties
      })
    }

    ownerMap.get(ownerId).properties.push(property)
  })

  // Convert to array and determine status based on properties
  return Array.from(ownerMap.values()).map(app => {
    const pendingProps = app.properties.filter((p: Property) => p.status === 'pending')
    const activeProps = app.properties.filter((p: Property) => p.status === 'active')
    const inactiveProps = app.properties.filter((p: Property) => p.status === 'inactive' || p.status === 'suspended')

    // Determine overall application status
    let status = 'approved'
    if (pendingProps.length > 0) {
      status = 'pending'
    } else if (activeProps.length === 0 && inactiveProps.length > 0) {
      status = 'rejected'
    }

    return {
      ...app,
      status,
      propertyCount: app.properties.length,
      description: `Provider with ${app.properties.length} ${app.properties.length === 1 ? 'property' : 'properties'} on the platform.`
    }
  })
})

const tabs = computed(() => {
  const pending = applications.value.filter(a => a.status === 'pending').length
  const approved = applications.value.filter(a => a.status === 'approved').length
  const rejected = applications.value.filter(a => a.status === 'rejected').length

  return [
    { label: 'Pending', value: 'pending', count: pending },
    { label: 'Approved', value: 'approved', count: approved },
    { label: 'Rejected', value: 'rejected', count: rejected }
  ]
})

const filteredApplications = computed(() => {
  return applications.value.filter(app => app.status === activeTab.value)
})

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function approveProvider(applicationId: string) {
  const app = applications.value.find(a => a.id === applicationId)
  if (!app) return

  try {
    // Approve all pending properties for this provider
    for (const property of app.properties) {
      if (property.status === 'pending') {
        await payload.update('properties', property.id, { status: 'active' })
      }
    }
    await fetchProperties()
    selectedApplication.value = null
    toast.success('Provider approved successfully')
  } catch (error) {
    console.error('Failed to approve provider:', error)
    toast.error('Failed to approve provider')
  }
}

async function rejectProvider(applicationId: string) {
  const confirmed = await confirm({
    title: 'Reject Provider',
    message: 'Are you sure you want to reject this provider application?',
    confirmText: 'Reject',
    variant: 'destructive',
  })
  if (!confirmed) return

  const app = applications.value.find(a => a.id === applicationId)
  if (!app) return

  try {
    // Reject all pending properties for this provider
    for (const property of app.properties) {
      if (property.status === 'pending') {
        await payload.update('properties', property.id, { status: 'inactive' })
      }
    }
    await fetchProperties()
    selectedApplication.value = null
    toast.success('Provider application rejected')
  } catch (error) {
    console.error('Failed to reject provider:', error)
    toast.error('Failed to reject provider')
  }
}
</script>

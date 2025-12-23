<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Property Management</h1>
        <p class="text-gray-600 mt-1">Review and manage all platform properties</p>
      </div>
      <button @click="console.log('Add new property')" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Plus class="w-5 h-5" />
        <span>Add Property</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search properties..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="status in statuses"
            :key="status.value"
            @click="selectedStatus = status.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p class="text-sm text-gray-600">Total Properties</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ properties.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p class="text-sm text-gray-600">Pending Approval</p>
        <p class="text-2xl font-bold text-orange-600 mt-1">{{ properties.filter(p => p.status === 'pending').length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p class="text-sm text-gray-600">Approved</p>
        <p class="text-2xl font-bold text-green-600 mt-1">{{ properties.filter(p => p.status === 'approved').length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <p class="text-sm text-gray-600">Featured</p>
        <p class="text-2xl font-bold text-purple-600 mt-1">{{ properties.filter(p => p.featured).length }}</p>
      </div>
    </div>

    <!-- Properties Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="property in filteredProperties" :key="property.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Building2 class="w-6 h-6 text-white" />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ property.name }}</div>
                    <div class="text-xs text-gray-500" v-if="property.featured">
                      <Star class="w-3 h-3 inline text-yellow-500 fill-yellow-500" />
                      Featured
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getOwnerName(property) }}</div>
                <div class="text-xs text-gray-500">{{ getOwnerEmail(property) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getPropertyLocation(property) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  property.status === 'active' && 'bg-green-100 text-green-800',
                  property.status === 'pending' && 'bg-orange-100 text-orange-800',
                  property.status === 'suspended' && 'bg-red-100 text-red-800',
                  property.status === 'inactive' && 'bg-gray-100 text-gray-800'
                ]">
                  {{ property.status.charAt(0).toUpperCase() + property.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span class="text-sm font-medium text-gray-900">{{ property.stats?.averageRating?.toFixed(1) || '0.0' }}</span>
                  <span class="text-xs text-gray-500 ml-1">({{ property.stats?.reviewCount || 0 }})</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ property.stats?.totalBookings || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <NuxtLink :to="`/platform/properties/${property.id}`" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <Eye class="w-4 h-4" />
                  </NuxtLink>
                  <button
                    v-if="property.status === 'pending'"
                    @click="approveProperty(property.id)"
                    class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Approve"
                  >
                    <Check class="w-4 h-4" />
                  </button>
                  <button
                    v-if="property.status === 'pending'"
                    @click="rejectProperty(property.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <X class="w-4 h-4" />
                  </button>
                  <button
                    @click="toggleFeatured(property.id)"
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      property.featured
                        ? 'text-yellow-600 hover:bg-yellow-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    ]"
                    title="Toggle Featured"
                  >
                    <Star :class="[property.featured ? 'fill-yellow-600' : '']" class="w-4 h-4" />
                  </button>
                  <button
                    @click="suspendProperty(property.id)"
                    class="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    title="Suspend"
                  >
                    <Ban class="w-4 h-4" />
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
          Showing <span class="font-medium">1</span> to <span class="font-medium">{{ Math.min(10, filteredProperties.length) }}</span> of <span class="font-medium">{{ filteredProperties.length }}</span> results
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Building2, Plus, Search, Eye, Check, X, Ban, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
  middleware: 'admin',
})

const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

const searchQuery = ref('')
const selectedStatus = ref('all')
const loading = ref(true)
const properties = ref<any[]>([])

const statuses = [
  { label: 'All Status', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' }
]

onMounted(async () => {
  await fetchProperties()
})

async function fetchProperties() {
  try {
    loading.value = true
    const response = await payload.find('properties', {
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

const filteredProperties = computed(() => {
  return properties.value.filter(property => {
    const matchesStatus = selectedStatus.value === 'all' || property.status === selectedStatus.value
    const matchesSearch = !searchQuery.value ||
      property.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (property.owner?.firstName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (property.owner?.lastName || '').toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      property.location?.address?.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesStatus && matchesSearch
  })
})

function getPropertyLocation(property: any): string {
  return `${property.location?.address || ''}, ${property.location?.city || ''}`.trim()
}

function getOwnerName(property: any): string {
  if (typeof property.owner === 'string') return 'Loading...'
  return `${property.owner?.firstName || ''} ${property.owner?.lastName || ''}`.trim() || property.owner?.email || 'Unknown'
}

function getOwnerEmail(property: any): string {
  if (typeof property.owner === 'string') return ''
  return property.owner?.email || ''
}

async function approveProperty(propertyId: string) {
  try {
    await payload.update('properties', propertyId, { status: 'active' })
    const property = properties.value.find(p => p.id === propertyId)
    if (property) property.status = 'active'
    toast.success('Property approved')
  } catch (error) {
    console.error('Failed to approve property:', error)
    toast.error('Failed to approve property')
  }
}

async function rejectProperty(propertyId: string) {
  const confirmed = await confirm({
    title: 'Reject Property',
    message: 'Are you sure you want to reject this property?',
    confirmText: 'Reject',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await payload.update('properties', propertyId, { status: 'inactive' })
    const property = properties.value.find(p => p.id === propertyId)
    if (property) property.status = 'inactive'
    toast.success('Property rejected')
  } catch (error) {
    console.error('Failed to reject property:', error)
    toast.error('Failed to reject property')
  }
}

async function toggleFeatured(propertyId: string) {
  try {
    const property = properties.value.find(p => p.id === propertyId)
    if (!property) return

    await payload.update('properties', propertyId, { featured: !property.featured })
    property.featured = !property.featured
    toast.success(property.featured ? 'Property featured' : 'Property unfeatured')
  } catch (error) {
    console.error('Failed to toggle featured:', error)
    toast.error('Failed to toggle featured status')
  }
}

async function suspendProperty(propertyId: string) {
  const confirmed = await confirm({
    title: 'Suspend Property',
    message: 'Are you sure you want to suspend this property?',
    confirmText: 'Suspend',
    variant: 'destructive',
  })
  if (!confirmed) return
  try {
    await payload.update('properties', propertyId, { status: 'suspended' })
    const property = properties.value.find(p => p.id === propertyId)
    if (property) property.status = 'suspended'
    toast.success('Property suspended')
  } catch (error) {
    console.error('Failed to suspend property:', error)
    toast.error('Failed to suspend property')
  }
}
</script>

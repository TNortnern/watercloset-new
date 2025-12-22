<script setup lang="ts">
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  MapPin,
  DollarSign,
  Eye,
  MoreVertical,
  Filter,
  Building2
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const auth = useAuth()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()
const { getAmenityLabel } = usePropertyUtils()

interface Property {
  id: string
  name: string
  location: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  pricePerMinute: number
  photos?: { image: { url: string } }[]
  status: string
  amenities: string[]
}

interface Booking {
  id: string
  property: { id: string }
  status: string
}

interface Review {
  id: string
  property: { id: string }
  rating: number
}

const searchQuery = ref('')
const selectedStatus = ref('all')

// Use reactive refs for data - no caching to ensure fresh data
const propertiesData = ref<{ docs: Property[], totalDocs: number }>({ docs: [], totalDocs: 0 })
const bookingsData = ref<{ docs: Booking[], totalDocs: number }>({ docs: [], totalDocs: 0 })
const reviewsData = ref<{ docs: Review[], totalDocs: number }>({ docs: [], totalDocs: 0 })
const propertiesPending = ref(true)

// Fetch functions
const fetchProperties = async () => {
  if (!auth.user.value?.id) {
    propertiesData.value = { docs: [], totalDocs: 0 }
    return
  }

  propertiesPending.value = true
  try {
    const result = await payload.find<Property>('properties', {
      where: { owner: { equals: auth.user.value.id } },
      depth: 1,
      limit: 100
    })
    propertiesData.value = result
  } catch (error) {
    console.error('Failed to fetch properties:', error)
    propertiesData.value = { docs: [], totalDocs: 0 }
  } finally {
    propertiesPending.value = false
  }
}

const fetchBookings = async () => {
  if (!auth.user.value?.id) {
    bookingsData.value = { docs: [], totalDocs: 0 }
    return
  }

  try {
    const result = await payload.find<Booking>('bookings', {
      where: {
        'property.owner': { equals: auth.user.value.id }
      },
      depth: 1,
      limit: 1000
    })
    bookingsData.value = result
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
  }
}

const fetchReviews = async () => {
  if (!auth.user.value?.id) {
    reviewsData.value = { docs: [], totalDocs: 0 }
    return
  }

  const propertyIds = propertiesData.value?.docs?.map(p => p.id) || []
  if (propertyIds.length === 0) {
    reviewsData.value = { docs: [], totalDocs: 0 }
    return
  }

  try {
    const result = await payload.find<Review>('reviews', {
      where: {
        property: { in: propertyIds }
      },
      depth: 1,
      limit: 1000
    })
    reviewsData.value = result
  } catch (error) {
    console.error('Failed to fetch reviews:', error)
  }
}

const refreshProperties = async () => {
  await fetchProperties()
  await fetchReviews()
}

// Fetch data on mount and when user changes
onMounted(async () => {
  // Clear any cached Nuxt data
  clearNuxtData('my-properties-list')
  clearNuxtData('my-properties-bookings')
  clearNuxtData('my-properties-reviews')

  await fetchProperties()
  await Promise.all([fetchBookings(), fetchReviews()])
})

// Watch for user changes
watch(() => auth.user.value?.id, async (newId, oldId) => {
  if (newId !== oldId) {
    await fetchProperties()
    await Promise.all([fetchBookings(), fetchReviews()])
  }
})

const allProperties = computed(() => propertiesData.value?.docs || [])
const allBookings = computed(() => bookingsData.value?.docs || [])
const allReviews = computed(() => reviewsData.value?.docs || [])

// Calculate status counts
const statusOptions = computed(() => {
  const all = allProperties.value.length
  const active = allProperties.value.filter(p => p.status === 'active').length
  const inactive = allProperties.value.filter(p => p.status === 'inactive').length
  const draft = allProperties.value.filter(p => p.status === 'draft').length

  return [
    { value: 'all', label: 'All Properties', count: all },
    { value: 'active', label: 'Active', count: active },
    { value: 'inactive', label: 'Inactive', count: inactive },
    { value: 'draft', label: 'Draft', count: draft }
  ]
})

// Transform properties for display
const properties = computed(() => {
  return allProperties.value.map(property => {
    const propertyReviews = allReviews.value.filter(r => r.property.id === property.id)
    const avgRating = propertyReviews.length > 0
      ? propertyReviews.reduce((sum, r) => sum + r.rating, 0) / propertyReviews.length
      : 0

    const propertyBookings = allBookings.value.filter(b =>
      typeof b.property === 'object' && b.property.id === property.id
    )

    const location = property.location
    const addressStr = `${location.address}, ${location.city}, ${location.state}`

    return {
      id: property.id,
      image: property.photos?.[0]?.image?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      title: property.name,
      address: addressStr,
      price: (property.pricePerMinute / 100).toFixed(2), // Convert from cents to dollars
      rating: avgRating,
      reviews: propertyReviews.length,
      bookings: propertyBookings.length,
      status: property.status,
      amenities: property.amenities || []
    }
  })
})

// Filter properties
const filteredProperties = computed(() => {
  let filtered = properties.value

  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(p => p.status === selectedStatus.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getStatusBadge = (status: string) => {
  const badges = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    draft: 'bg-yellow-100 text-yellow-700'
  }
  return badges[status as keyof typeof badges]
}

const deleteProperty = async (propertyId: string) => {
  const confirmed = await confirm({
    title: 'Delete Property',
    message: 'Are you sure you want to delete this property? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'destructive',
  })

  if (!confirmed) return

  try {
    await payload.remove('properties', propertyId)
    await refreshProperties()
    toast.success('Property deleted successfully')
  } catch (error) {
    console.error('Failed to delete property:', error)
    toast.error('Failed to delete property. Please try again.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Properties</h1>
        <p class="mt-2 text-gray-600">Manage your bathroom listings</p>
      </div>
      <NuxtLink
        to="/manage/properties/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
      >
        <Plus class="w-5 h-5" />
        Add New Property
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search properties..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Status Filter -->
        <div class="flex gap-2 overflow-x-auto">
          <button
            v-for="option in statusOptions"
            :key="option.value"
            @click="selectedStatus = option.value"
            :class="[
              'px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
              selectedStatus === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ option.label }}
            <span :class="[
              'ml-2 px-2 py-0.5 rounded-full text-xs',
              selectedStatus === option.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            ]">
              {{ option.count }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Properties Grid -->
    <div v-if="filteredProperties.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="property in filteredProperties"
        :key="property.id"
        class="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <!-- Image -->
        <div class="relative aspect-[4/3] overflow-hidden">
          <img
            :src="property.image"
            :alt="property.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div class="absolute top-3 right-3">
            <span :class="`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`">
              {{ property.status.charAt(0).toUpperCase() + property.status.slice(1) }}
            </span>
          </div>
          <div class="absolute top-3 left-3">
            <button class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
              <MoreVertical class="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <h3 class="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">{{ property.title }}</h3>

          <div class="flex items-start gap-2 mb-3">
            <MapPin class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p class="text-sm text-gray-600 line-clamp-1">{{ property.address }}</p>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
            <div v-if="property.rating > 0" class="flex items-center gap-1">
              <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span class="text-sm font-medium text-gray-900">{{ property.rating }}</span>
              <span class="text-sm text-gray-500">({{ property.reviews }})</span>
            </div>
            <div v-else class="text-sm text-gray-500">No reviews yet</div>
            <div class="text-sm text-gray-500">
              <span class="font-medium text-gray-900">{{ property.bookings }}</span> bookings
            </div>
          </div>

          <!-- Amenities -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="amenity in property.amenities.slice(0, 3)"
              :key="amenity"
              class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
            >
              {{ getAmenityLabel(amenity) }}
            </span>
          </div>

          <!-- Price and Actions -->
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-gray-900">
                ${{ property.price }}
                <span class="text-sm text-gray-500 font-normal">/min</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink
                :to="`/manage/properties/${property.id}`"
                class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye class="w-5 h-5" />
              </NuxtLink>
              <NuxtLink
                :to="`/manage/properties/${property.id}`"
                class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Edit class="w-5 h-5" />
              </NuxtLink>
              <button @click="deleteProperty(property.id)" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
        <p class="text-gray-600 mb-6">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'Get started by adding your first property' }}
        </p>
        <NuxtLink
          to="/manage/properties/new"
          class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <Plus class="w-5 h-5" />
          Add New Property
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

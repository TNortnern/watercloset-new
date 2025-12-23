<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading property details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <NuxtLink to="/platform/properties" class="text-blue-600 hover:underline">Back to Properties</NuxtLink>
    </div>

    <!-- Main Content -->
    <template v-else-if="property">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/platform/properties" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft class="w-5 h-5 text-gray-600" />
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Property Details</h1>
            <p class="text-gray-600 mt-1">Review and manage property</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="contactOwner" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Mail class="w-5 h-5 inline mr-2" />
            Contact Owner
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Property Info Card -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="text-center">
              <div class="w-full h-48 rounded-lg overflow-hidden mb-4">
                <img
                  v-if="propertyImage"
                  :src="propertyImage"
                  :alt="property.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                  <Building2 class="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 class="text-xl font-bold text-gray-900">{{ property.name }}</h2>
              <p class="text-gray-600 text-sm mt-1">{{ propertyLocation }}</p>

              <div class="flex items-center justify-center space-x-2 mt-4">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  property.status === 'active' && 'bg-green-100 text-green-800',
                  property.status === 'pending' && 'bg-orange-100 text-orange-800',
                  property.status === 'suspended' && 'bg-red-100 text-red-800',
                  property.status === 'inactive' && 'bg-gray-100 text-gray-800'
                ]">
                  {{ property.status.charAt(0).toUpperCase() + property.status.slice(1) }}
                </span>
                <span v-if="property.featured" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Price per minute</span>
                <span class="text-sm font-bold text-gray-900">${{ pricePerMinute }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Rating</span>
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span class="text-sm font-medium text-gray-900">{{ property.stats?.averageRating?.toFixed(1) || '0.0' }}</span>
                  <span class="text-xs text-gray-500 ml-1">({{ property.stats?.reviewCount || 0 }} reviews)</span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Total Bookings</span>
                <span class="text-sm font-medium text-gray-900">{{ property.stats?.totalBookings || 0 }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Revenue Generated</span>
                <span class="text-sm font-medium text-gray-900">${{ ((property.stats?.totalEarnings || 0) / 100).toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Listed Date</span>
                <span class="text-sm font-medium text-gray-900">{{ formatDate(property.createdAt) }}</span>
              </div>
            </div>

            <!-- Admin Actions -->
            <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <h3 class="text-sm font-semibold text-gray-900 mb-3">Admin Actions</h3>
              <button
                v-if="property.status === 'pending'"
                @click="approveProperty"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">Approve Property</span>
                <Check class="w-5 h-5" />
              </button>
              <button
                v-if="property.status === 'pending'"
                @click="rejectProperty"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">Reject Property</span>
                <X class="w-5 h-5" />
              </button>
              <button
                @click="toggleFeatured"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">{{ property.featured ? 'Remove Featured' : 'Add Featured' }}</span>
                <Star class="w-5 h-5" />
              </button>
              <button
                v-if="property.status === 'active'"
                @click="suspendProperty"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">Suspend Property</span>
                <Ban class="w-5 h-5" />
              </button>
              <button
                v-if="property.status === 'suspended'"
                @click="reactivateProperty"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">Reactivate Property</span>
                <Check class="w-5 h-5" />
              </button>
              <button
                @click="deleteProperty"
                :disabled="actionLoading"
                class="w-full flex items-center justify-between px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <span class="text-sm font-medium">Delete Property</span>
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Owner Info -->
          <div v-if="owner" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
            <div class="flex items-center space-x-3 mb-4">
              <div class="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                {{ ownerInitials }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ ownerName }}</p>
                <p class="text-xs text-gray-500">{{ owner.email }}</p>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Role</span>
                <span class="text-gray-900 capitalize">{{ owner.role }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Member Since</span>
                <span class="text-gray-900">{{ formatDate(owner.createdAt) }}</span>
              </div>
            </div>
            <NuxtLink :to="`/platform/users/${owner.id}`" class="mt-4 block w-full text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium">
              View Owner Profile
            </NuxtLink>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Description -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p class="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{{ propertyDescription }}</p>
          </div>

          <!-- Amenities -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
            <div v-if="property.amenities && property.amenities.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="amenity in property.amenities" :key="amenity" class="flex items-center space-x-2 text-sm text-gray-700">
                <Check class="w-4 h-4 text-green-600" />
                <span>{{ formatAmenity(amenity) }}</span>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm">No amenities listed</p>
          </div>

          <!-- Booking History -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Booking History</h3>
              <NuxtLink to="/platform/bookings" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</NuxtLink>
            </div>
            <div v-if="bookings.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ getBookingUserName(booking) }}</td>
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
            <p v-else class="text-gray-500 text-sm text-center py-4">No bookings yet</p>
          </div>

          <!-- Reviews -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            </div>
            <div v-if="reviews.length > 0" class="space-y-4">
              <div v-for="review in reviews" :key="review.id" class="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                      {{ getReviewUserInitials(review) }}
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ getReviewUserName(review) }}</p>
                      <div class="flex items-center mt-1">
                        <Star v-for="i in 5" :key="i" :class="[
                          'w-3 h-3',
                          i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                        ]" />
                      </div>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500">{{ formatDate(review.createdAt) }}</span>
                </div>
                <p class="text-sm text-gray-700">{{ review.comment }}</p>
              </div>
            </div>
            <p v-else class="text-gray-500 text-sm text-center py-4">No reviews yet</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Mail, Check, X, Ban, Trash2, Star, Building2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
  middleware: 'admin',
})

const route = useRoute()
const router = useRouter()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

const propertyId = route.params.id as string
const loading = ref(true)
const error = ref<string | null>(null)
const actionLoading = ref(false)
const property = ref<any>(null)
const bookings = ref<any[]>([])
const reviews = ref<any[]>([])

// Fetch property data
async function fetchProperty() {
  try {
    loading.value = true
    error.value = null
    property.value = await payload.findByID('properties', propertyId, 2)
  } catch (e: any) {
    console.error('Failed to fetch property:', e)
    error.value = e.message || 'Failed to load property'
  } finally {
    loading.value = false
  }
}

// Fetch bookings for this property
async function fetchBookings() {
  try {
    const response = await payload.find('bookings', {
      where: {
        property: { equals: propertyId }
      },
      limit: 10,
      sort: '-createdAt',
      depth: 1
    })
    bookings.value = response.docs
  } catch (e) {
    console.error('Failed to fetch bookings:', e)
  }
}

// Fetch reviews for this property
async function fetchReviews() {
  try {
    const response = await payload.find('reviews', {
      where: {
        property: { equals: propertyId }
      },
      limit: 10,
      sort: '-createdAt',
      depth: 1
    })
    reviews.value = response.docs
  } catch (e) {
    console.error('Failed to fetch reviews:', e)
  }
}

// Computed properties
const owner = computed(() => {
  if (!property.value?.owner) return null
  return typeof property.value.owner === 'object' ? property.value.owner : null
})

const ownerName = computed(() => {
  if (!owner.value) return 'Unknown'
  return `${owner.value.firstName || ''} ${owner.value.lastName || ''}`.trim() || owner.value.email
})

const ownerInitials = computed(() => {
  if (!owner.value) return '?'
  const first = owner.value.firstName?.charAt(0) || ''
  const last = owner.value.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || owner.value.email?.charAt(0)?.toUpperCase() || '?'
})

const propertyLocation = computed(() => {
  if (!property.value?.location) return 'No location'
  const loc = property.value.location
  return `${loc.address || ''}, ${loc.city || ''}, ${loc.state || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
})

const pricePerMinute = computed(() => {
  if (!property.value?.pricePerMinute) return '0.00'
  return (property.value.pricePerMinute / 100).toFixed(2)
})

const propertyImage = computed(() => {
  if (!property.value?.photos?.[0]?.image) return null
  const image = property.value.photos[0].image
  return typeof image === 'object' ? image.url : image
})

const propertyDescription = computed(() => {
  const desc = property.value?.description
  if (!desc) return 'No description provided'
  if (typeof desc === 'string') return desc
  if (Array.isArray(desc)) {
    return desc.map(block => {
      if (block.type === 'paragraph' && block.children) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      return ''
    }).join('\n\n')
  }
  return 'No description provided'
})

// Helper functions
function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return 'N/A'
  }
}

function formatAmenity(amenity: string) {
  const labels: Record<string, string> = {
    'wheelchair': 'Wheelchair Accessible',
    'baby_changing': 'Baby Changing Station',
    'shower': 'Shower',
    'bidet': 'Bidet',
    'air_freshener': 'Air Freshener',
    'hand_dryer': 'Hand Dryer',
    'paper_towels': 'Paper Towels',
    'feminine': 'Feminine Products',
    'mirror': 'Mirror',
    'climate': 'Climate Controlled',
    'private': 'Private',
    'gender_neutral': 'Gender Neutral',
  }
  return labels[amenity] || amenity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function getBookingUserName(booking: any) {
  if (!booking.user) return 'Unknown'
  if (typeof booking.user === 'string') return 'Guest'
  return `${booking.user.firstName || ''} ${booking.user.lastName || ''}`.trim() || booking.user.email
}

function getReviewUserName(review: any) {
  if (!review.user) return 'Anonymous'
  if (typeof review.user === 'string') return 'User'
  return `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || 'Anonymous'
}

function getReviewUserInitials(review: any) {
  if (!review.user || typeof review.user === 'string') return '?'
  const first = review.user.firstName?.charAt(0) || ''
  const last = review.user.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
}

// Admin actions
async function approveProperty() {
  const confirmed = await confirm({
    title: 'Approve Property',
    message: 'Are you sure you want to approve this property?',
    confirmText: 'Approve',
    variant: 'default',
  })
  if (!confirmed) return
  actionLoading.value = true
  try {
    await payload.update('properties', propertyId, { status: 'active' })
    property.value.status = 'active'
    toast.success('Property approved successfully')
  } catch (e) {
    console.error('Failed to approve property:', e)
    toast.error('Failed to approve property')
  } finally {
    actionLoading.value = false
  }
}

async function rejectProperty() {
  const confirmed = await confirm({
    title: 'Reject Property',
    message: 'Are you sure you want to reject this property?',
    confirmText: 'Reject',
    variant: 'destructive',
  })
  if (!confirmed) return
  actionLoading.value = true
  try {
    await payload.update('properties', propertyId, { status: 'inactive' })
    property.value.status = 'inactive'
    toast.success('Property rejected')
  } catch (e) {
    console.error('Failed to reject property:', e)
    toast.error('Failed to reject property')
  } finally {
    actionLoading.value = false
  }
}

async function toggleFeatured() {
  actionLoading.value = true
  try {
    const newFeatured = !property.value.featured
    await payload.update('properties', propertyId, { featured: newFeatured })
    property.value.featured = newFeatured
    toast.success(newFeatured ? 'Property featured' : 'Property unfeatured')
  } catch (e) {
    console.error('Failed to toggle featured:', e)
    toast.error('Failed to update featured status')
  } finally {
    actionLoading.value = false
  }
}

async function suspendProperty() {
  const confirmed = await confirm({
    title: 'Suspend Property',
    message: 'Are you sure you want to suspend this property?',
    confirmText: 'Suspend',
    variant: 'destructive',
  })
  if (!confirmed) return
  actionLoading.value = true
  try {
    await payload.update('properties', propertyId, { status: 'suspended' })
    property.value.status = 'suspended'
    toast.success('Property suspended')
  } catch (e) {
    console.error('Failed to suspend property:', e)
    toast.error('Failed to suspend property')
  } finally {
    actionLoading.value = false
  }
}

async function reactivateProperty() {
  const confirmed = await confirm({
    title: 'Reactivate Property',
    message: 'Are you sure you want to reactivate this property?',
    confirmText: 'Reactivate',
    variant: 'default',
  })
  if (!confirmed) return
  actionLoading.value = true
  try {
    await payload.update('properties', propertyId, { status: 'active' })
    property.value.status = 'active'
    toast.success('Property reactivated')
  } catch (e) {
    console.error('Failed to reactivate property:', e)
    toast.error('Failed to reactivate property')
  } finally {
    actionLoading.value = false
  }
}

async function deleteProperty() {
  const confirmed = await confirm({
    title: 'Delete Property',
    message: 'Are you sure you want to DELETE this property? This action cannot be undone.',
    confirmText: 'Delete',
    variant: 'destructive',
  })
  if (!confirmed) return
  actionLoading.value = true
  try {
    await payload.remove('properties', propertyId)
    toast.success('Property deleted')
    router.push('/platform/properties')
  } catch (e) {
    console.error('Failed to delete property:', e)
    toast.error('Failed to delete property')
  } finally {
    actionLoading.value = false
  }
}

function contactOwner() {
  if (owner.value?.email) {
    window.location.href = `mailto:${owner.value.email}`
  }
}

// Initialize
onMounted(async () => {
  await fetchProperty()
  if (property.value) {
    await Promise.all([fetchBookings(), fetchReviews()])
  }
})
</script>

<script setup lang="ts">
import {
  Star,
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const auth = useAuth()
const payload = usePayload()

interface Property {
  id: string
  name: string
}

interface Review {
  id: string
  user: { id: string, firstName: string, lastName: string }
  property: { id: string, name: string }
  rating: number
  comment: string
  createdAt: string
  helpful?: number
  response?: {
    comment?: string
    respondedAt?: string
  }
}

const searchQuery = ref('')
const selectedProperty = ref('all')
const selectedRating = ref('all')

// Fetch provider's properties for filter
const { data: propertiesData } = await useAsyncData('reviews-properties', async () => {
  if (!auth.user.value?.id) return null
  return await payload.find<Property>('properties', {
    where: { owner: { equals: auth.user.value.id } },
    depth: 0,
    limit: 100
  })
})

const allProperties = computed(() => propertiesData.value?.docs || [])

// Build properties filter options
const properties = computed(() => {
  const options = [{ value: 'all', label: 'All Properties' }]
  allProperties.value.forEach(prop => {
    options.push({ value: prop.id, label: prop.name })
  })
  return options
})

// Fetch all reviews for provider's properties
const { data: reviewsData } = await useAsyncData('provider-reviews-page', async () => {
  if (!auth.user.value?.id) return null
  const propertyIds = allProperties.value.map(p => p.id)
  if (propertyIds.length === 0) return null

  return await payload.find<Review>('reviews', {
    where: {
      property: { in: propertyIds }
    },
    depth: 2,
    limit: 500,
    sort: '-createdAt'
  })
})

const allReviews = computed(() => reviewsData.value?.docs || [])

// Calculate rating stats
const ratingStats = computed(() => {
  const total = allReviews.value.length
  if (total === 0) {
    return {
      average: 0,
      total: 0,
      breakdown: [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 }
      ]
    }
  }

  const totalRating = allReviews.value.reduce((sum, r) => sum + r.rating, 0)
  const average = (totalRating / total).toFixed(1)

  const breakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = allReviews.value.filter(r => r.rating === stars).length
    const percentage = Math.round((count / total) * 100)
    return { stars, count, percentage }
  })

  return {
    average: parseFloat(average),
    total,
    breakdown
  }
})

// Transform reviews for display
const reviews = computed(() => {
  return allReviews.value.map(review => {
    const user = review.user
    const property = review.property
    const firstName = typeof user === 'object' ? user.firstName : ''
    const lastName = typeof user === 'object' ? user.lastName : ''
    const propertyName = typeof property === 'object' ? property.name : 'Unknown Property'
    const propertyId = typeof property === 'object' ? property.id : ''
    const createdAt = new Date(review.createdAt)

    return {
      id: review.id,
      guest: {
        name: `${firstName} ${lastName}`.trim(),
        avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      },
      property: propertyName,
      propertyId,
      rating: review.rating,
      comment: review.comment,
      date: createdAt.toISOString().split('T')[0],
      helpful: review.helpful || 0,
      responded: !!(review.response?.comment)
    }
  })
})

// Filter reviews
const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (selectedProperty.value !== 'all') {
    filtered = filtered.filter(r => r.propertyId === selectedProperty.value)
  }

  if (selectedRating.value !== 'all') {
    filtered = filtered.filter(r => r.rating === parseInt(selectedRating.value))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(r =>
      r.guest.name.toLowerCase().includes(query) ||
      r.comment.toLowerCase().includes(query) ||
      r.property.toLowerCase().includes(query)
    )
  }

  return filtered
})

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => i < rating)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Reviews</h1>
      <p class="mt-2 text-gray-600">Manage feedback from your guests</p>
    </div>

    <!-- Overall Rating -->
    <div class="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-8 text-white">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="flex flex-col items-center justify-center text-center">
          <div class="mb-4">
            <Award class="w-16 h-16 mx-auto mb-2" />
            <div class="text-sm font-medium opacity-90">Overall Rating</div>
          </div>
          <div class="text-6xl font-bold mb-3">{{ ratingStats.average }}</div>
          <div class="flex items-center gap-1 mb-2">
            <Star
              v-for="i in 5"
              :key="i"
              class="w-6 h-6 fill-white text-white"
            />
          </div>
          <div class="text-sm opacity-90">Based on {{ ratingStats.total }} reviews</div>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in ratingStats.breakdown"
            :key="item.stars"
            class="flex items-center gap-4"
          >
            <div class="flex items-center gap-1 w-20">
              <span class="text-sm font-medium">{{ item.stars }}</span>
              <Star class="w-4 h-4 fill-white text-white" />
            </div>
            <div class="flex-1">
              <div class="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  class="h-full bg-white rounded-full transition-all duration-500"
                  :style="{ width: `${item.percentage}%` }"
                />
              </div>
            </div>
            <div class="text-sm font-medium w-16 text-right">
              {{ item.count }} ({{ item.percentage }}%)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search -->
        <div class="md:col-span-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search reviews..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Property Filter -->
        <select
          v-model="selectedProperty"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="property in properties" :key="property.value" :value="property.value">
            {{ property.label }}
          </option>
        </select>

        <!-- Rating Filter -->
        <select
          v-model="selectedRating"
          class="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
      <div
        v-for="review in filteredReviews"
        :key="review.id"
        class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {{ review.guest.avatar }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">{{ review.guest.name }}</h3>
              <p class="text-sm text-gray-600">{{ review.property }}</p>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex items-center gap-0.5">
                  <Star
                    v-for="(filled, i) in renderStars(review.rating)"
                    :key="i"
                    :class="[
                      'w-4 h-4',
                      filled ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                    ]"
                  />
                </div>
                <span class="text-sm text-gray-500">{{ review.date }}</span>
              </div>
            </div>
          </div>
          <div v-if="review.responded" class="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Responded
          </div>
        </div>

        <p class="text-gray-700 leading-relaxed mb-4">{{ review.comment }}</p>

        <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
          <button class="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            <ThumbsUp class="w-4 h-4" />
            Helpful ({{ review.helpful }})
          </button>
          <button
            v-if="!review.responded"
            @click="console.log('Respond to review:', review.id)"
            class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <MessageSquare class="w-4 h-4" />
            Respond
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredReviews.length === 0" class="bg-white border border-gray-200 rounded-xl p-12 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No reviews found</h3>
        <p class="text-gray-600">
          {{ searchQuery ? 'Try adjusting your search or filters' : 'You don\'t have any reviews yet' }}
        </p>
      </div>
    </div>

    <!-- Load More -->
    <div v-if="filteredReviews.length > 0" class="text-center">
      <button class="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
        Load More Reviews
      </button>
    </div>
  </div>
</template>

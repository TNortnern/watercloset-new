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
})

const searchQuery = ref('')
const selectedProperty = ref('all')
const selectedRating = ref('all')

const ratingStats = {
  average: 4.8,
  total: 156,
  breakdown: [
    { stars: 5, count: 125, percentage: 80 },
    { stars: 4, count: 23, percentage: 15 },
    { stars: 3, count: 6, percentage: 4 },
    { stars: 2, count: 2, percentage: 1 },
    { stars: 1, count: 0, percentage: 0 }
  ]
}

const properties = [
  { value: 'all', label: 'All Properties' },
  { value: '1', label: 'Downtown Luxury Suite' },
  { value: '2', label: 'Spa Retreat Bathroom' },
  { value: '3', label: 'Modern Minimalist Washroom' },
  { value: '4', label: 'Executive Suite Bath' }
]

const reviews = [
  {
    id: 1,
    guest: {
      name: 'Sarah Johnson',
      avatar: 'SJ'
    },
    property: 'Downtown Luxury Suite',
    rating: 5,
    comment: 'Absolutely amazing experience! The bathroom was spotless, beautifully designed, and had all the amenities I needed. The host was very responsive and made check-in seamless. Highly recommend!',
    date: '2025-12-15',
    helpful: 12,
    responded: true
  },
  {
    id: 2,
    guest: {
      name: 'Michael Chen',
      avatar: 'MC'
    },
    property: 'Spa Retreat Bathroom',
    rating: 5,
    comment: 'Perfect for a quick refresh during my busy day. The spa-like atmosphere was incredibly relaxing. Great location and very clean. Will definitely book again!',
    date: '2025-12-14',
    helpful: 8,
    responded: false
  },
  {
    id: 3,
    guest: {
      name: 'Emily Rodriguez',
      avatar: 'ER'
    },
    property: 'Modern Minimalist Washroom',
    rating: 4,
    comment: 'Really nice space with a modern aesthetic. Everything was clean and functional. Only minor issue was the door lock was a bit tricky, but overall a great experience.',
    date: '2025-12-13',
    helpful: 5,
    responded: true
  },
  {
    id: 4,
    guest: {
      name: 'David Kim',
      avatar: 'DK'
    },
    property: 'Executive Suite Bath',
    rating: 5,
    comment: 'Premium quality all around. The attention to detail is impressive. Perfect for business travelers who need a quiet, clean space. The amenities provided were top-notch.',
    date: '2025-12-12',
    helpful: 15,
    responded: true
  },
  {
    id: 5,
    guest: {
      name: 'Lisa Thompson',
      avatar: 'LT'
    },
    property: 'Garden View Powder Room',
    rating: 5,
    comment: 'Lovely little powder room with a beautiful garden view. So peaceful and well-maintained. The host was friendly and the whole experience was delightful.',
    date: '2025-12-11',
    helpful: 6,
    responded: false
  },
  {
    id: 6,
    guest: {
      name: 'James Wilson',
      avatar: 'JW'
    },
    property: 'Downtown Luxury Suite',
    rating: 4,
    comment: 'Great location in the heart of downtown. Very convenient for my meetings. The space was clean and had everything I needed. Would have given 5 stars but the water pressure could be better.',
    date: '2025-12-10',
    helpful: 4,
    responded: true
  },
  {
    id: 7,
    guest: {
      name: 'Maria Garcia',
      avatar: 'MG'
    },
    property: 'Spa Retreat Bathroom',
    rating: 5,
    comment: 'This is my third time booking and it never disappoints! The spa products are luxurious and the bathtub is amazing. Perfect for unwinding after a long day.',
    date: '2025-12-09',
    helpful: 10,
    responded: true
  },
  {
    id: 8,
    guest: {
      name: 'Robert Taylor',
      avatar: 'RT'
    },
    property: 'Modern Minimalist Washroom',
    rating: 5,
    comment: 'Clean, modern, and exactly as described. The minimalist design is beautiful and calming. Host was great with communication. Excellent value for money.',
    date: '2025-12-08',
    helpful: 7,
    responded: false
  },
  {
    id: 9,
    guest: {
      name: 'Jennifer Lee',
      avatar: 'JL'
    },
    property: 'Executive Suite Bath',
    rating: 5,
    comment: 'Outstanding! The privacy and quiet atmosphere were perfect for my needs. Everything was immaculate and the booking process was smooth. Highly professional host.',
    date: '2025-12-07',
    helpful: 9,
    responded: true
  },
  {
    id: 10,
    guest: {
      name: 'Thomas Brown',
      avatar: 'TB'
    },
    property: 'Downtown Luxury Suite',
    rating: 3,
    comment: 'The space was nice but a bit smaller than expected from the photos. Still clean and functional, just not quite what I was anticipating. Host was responsive though.',
    date: '2025-12-06',
    helpful: 3,
    responded: true
  }
]

const filteredReviews = computed(() => {
  let filtered = reviews

  if (selectedProperty.value !== 'all') {
    const propertyName = properties.find(p => p.value === selectedProperty.value)?.label
    filtered = filtered.filter(r => r.property === propertyName)
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

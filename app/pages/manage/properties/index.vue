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
})

const searchQuery = ref('')
const selectedStatus = ref('all')

const statusOptions = [
  { value: 'all', label: 'All Properties', count: 8 },
  { value: 'active', label: 'Active', count: 5 },
  { value: 'inactive', label: 'Inactive', count: 2 },
  { value: 'draft', label: 'Draft', count: 1 }
]

const properties = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
    title: 'Downtown Luxury Suite',
    address: '123 Main Street, New York, NY',
    price: 1.50,
    rating: 4.9,
    reviews: 42,
    bookings: 28,
    status: 'active',
    amenities: ['WiFi', 'Shower', 'Toiletries']
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    title: 'Spa Retreat Bathroom',
    address: '456 Park Avenue, Manhattan, NY',
    price: 1.50,
    rating: 4.8,
    reviews: 35,
    bookings: 22,
    status: 'active',
    amenities: ['Bathtub', 'Spa Products', 'Towels']
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1564540583246-934409427776?w=800&h=600&fit=crop',
    title: 'Modern Minimalist Washroom',
    address: '789 Broadway, Brooklyn, NY',
    price: 1.50,
    rating: 4.7,
    reviews: 28,
    bookings: 19,
    status: 'active',
    amenities: ['Minimalist Design', 'Premium Soap', 'Mirror']
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&h=600&fit=crop',
    title: 'Executive Suite Bath',
    address: '321 Wall Street, Financial District, NY',
    price: 1.75,
    rating: 5.0,
    reviews: 18,
    bookings: 15,
    status: 'active',
    amenities: ['Executive Lounge', 'Premium Amenities', 'Privacy']
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    title: 'Garden View Powder Room',
    address: '654 Garden Street, Queens, NY',
    price: 1.25,
    rating: 4.6,
    reviews: 24,
    bookings: 18,
    status: 'active',
    amenities: ['Garden View', 'Natural Light', 'Fresh Towels']
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=800&h=600&fit=crop',
    title: 'Vintage Charm Restroom',
    address: '987 Heritage Lane, Brooklyn, NY',
    price: 1.30,
    rating: 4.5,
    reviews: 16,
    bookings: 12,
    status: 'inactive',
    amenities: ['Vintage Decor', 'Clawfoot Tub', 'Period Features']
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&h=600&fit=crop',
    title: 'Penthouse Premium Bath',
    address: '111 Skyline Drive, Manhattan, NY',
    price: 2.00,
    rating: 4.9,
    reviews: 31,
    bookings: 25,
    status: 'inactive',
    amenities: ['City Views', 'Luxury Finishes', 'Rain Shower']
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop',
    title: 'Eco-Friendly Washroom',
    address: '222 Green Street, Brooklyn, NY',
    price: 1.40,
    rating: 0,
    reviews: 0,
    bookings: 0,
    status: 'draft',
    amenities: ['Eco Products', 'Water Efficient', 'Sustainable']
  }
]

const filteredProperties = computed(() => {
  let filtered = properties

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
              {{ amenity }}
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
              <button class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

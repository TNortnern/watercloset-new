<template>
  <div class="space-y-6">
    <!-- Header with Back Button -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/admin/properties" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Property Details</h1>
          <p class="text-gray-600 mt-1">Review and manage property</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <button @click="console.log('Contact owner:', property.ownerEmail)" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Mail class="w-5 h-5 inline mr-2" />
          Contact Owner
        </button>
        <button @click="console.log('Edit property:', property.id)" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Edit class="w-5 h-5 inline mr-2" />
          Edit Property
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Property Info Card -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="text-center">
            <div class="w-full h-48 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
              <Building2 class="w-16 h-16 text-white" />
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ property.name }}</h2>
            <p class="text-gray-600 text-sm mt-1">{{ property.location }}</p>

            <div class="flex items-center justify-center space-x-2 mt-4">
              <span :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                property.status === 'approved' && 'bg-green-100 text-green-800',
                property.status === 'pending' && 'bg-orange-100 text-orange-800',
                property.status === 'suspended' && 'bg-red-100 text-red-800'
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
              <span class="text-sm text-gray-600">Price per hour</span>
              <span class="text-sm font-bold text-gray-900">${{ property.price }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Rating</span>
              <div class="flex items-center">
                <Star class="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span class="text-sm font-medium text-gray-900">{{ property.rating }}</span>
                <span class="text-xs text-gray-500 ml-1">({{ property.reviews }} reviews)</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Bookings</span>
              <span class="text-sm font-medium text-gray-900">{{ property.bookings }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Revenue Generated</span>
              <span class="text-sm font-medium text-gray-900">${{ property.revenue.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Listed Date</span>
              <span class="text-sm font-medium text-gray-900">{{ property.listedDate }}</span>
            </div>
          </div>

          <!-- Admin Actions -->
          <div class="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Admin Actions</h3>
            <button
              v-if="property.status === 'pending'"
              @click="console.log('Approve property:', property.id)"
              class="w-full flex items-center justify-between px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
            >
              <span class="text-sm font-medium">Approve Property</span>
              <Check class="w-5 h-5" />
            </button>
            <button @click="console.log('Toggle featured status for property:', property.id)" class="w-full flex items-center justify-between px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">{{ property.featured ? 'Remove' : 'Add' }} Featured</span>
              <Star class="w-5 h-5" />
            </button>
            <button @click="console.log('Suspend property:', property.id)" class="w-full flex items-center justify-between px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">Suspend Property</span>
              <Ban class="w-5 h-5" />
            </button>
            <button @click="console.log('Delete property:', property.id)" class="w-full flex items-center justify-between px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors">
              <span class="text-sm font-medium">Delete Property</span>
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Owner Info -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
          <div class="flex items-center space-x-3 mb-4">
            <div class="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
              {{ property.ownerInitials }}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ property.owner }}</p>
              <p class="text-xs text-gray-500">{{ property.ownerEmail }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Phone</span>
              <span class="text-gray-900">{{ property.ownerPhone }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Properties</span>
              <span class="text-gray-900">{{ property.ownerProperties }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-600">Member Since</span>
              <span class="text-gray-900">{{ property.ownerJoined }}</span>
            </div>
          </div>
          <NuxtLink :to="`/admin/users/${property.ownerId}`" class="mt-4 block w-full text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors text-sm font-medium">
            View Owner Profile
          </NuxtLink>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Description -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Description</h3>
          <p class="text-gray-700 text-sm leading-relaxed">{{ property.description }}</p>
        </div>

        <!-- Amenities -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div v-for="amenity in property.amenities" :key="amenity" class="flex items-center space-x-2 text-sm text-gray-700">
              <Check class="w-4 h-4 text-green-600" />
              <span>{{ amenity }}</span>
            </div>
          </div>
        </div>

        <!-- Booking History -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Booking History</h3>
            <button @click="navigateTo('/admin/bookings')" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="booking in bookingHistory" :key="booking.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ booking.id }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ booking.guest }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ booking.date }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${{ booking.amount }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                      booking.status === 'completed' && 'bg-green-100 text-green-800',
                      booking.status === 'confirmed' && 'bg-blue-100 text-blue-800',
                      booking.status === 'cancelled' && 'bg-red-100 text-red-800'
                    ]">
                      {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reviews -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            <button @click="console.log('View all reviews for property:', property.id)" class="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div class="space-y-4">
            <div v-for="review in reviews" :key="review.id" class="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div class="flex items-start justify-between mb-2">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {{ review.userInitials }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ review.userName }}</p>
                    <div class="flex items-center mt-1">
                      <Star v-for="i in 5" :key="i" :class="[
                        'w-3 h-3',
                        i <= review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                      ]" />
                    </div>
                  </div>
                </div>
                <span class="text-xs text-gray-500">{{ review.date }}</span>
              </div>
              <p class="text-sm text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Mail, Edit, Check, Ban, Trash2, Star, Building2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const route = useRoute()
const propertyId = route.params.id

// Mock property data
const property = {
  id: propertyId,
  name: 'Premium Suite',
  location: 'Downtown Plaza, NYC',
  status: 'approved',
  featured: true,
  price: 45,
  rating: 4.8,
  reviews: 124,
  bookings: 342,
  revenue: 15390,
  listedDate: 'Dec 10, 2024',
  description: 'Experience luxury and comfort in our Premium Suite bathroom facility. Located in the heart of downtown, this meticulously maintained space offers a peaceful retreat with modern amenities. Perfect for professionals and travelers seeking a premium restroom experience.',
  amenities: ['Wi-Fi', 'Climate Control', 'Premium Toiletries', 'Hand Dryer', 'Bidet', 'Air Freshener', 'Music System', 'Charging Station'],
  owner: 'Michael Chen',
  ownerInitials: 'MC',
  ownerId: 2,
  ownerEmail: 'michael@example.com',
  ownerPhone: '+1 (555) 234-5678',
  ownerProperties: 3,
  ownerJoined: 'Nov 2024'
}

const bookingHistory = [
  {
    id: '#BC-12345',
    guest: 'Sarah Johnson',
    date: 'Dec 18, 2024',
    amount: 45,
    status: 'confirmed'
  },
  {
    id: '#BC-12344',
    guest: 'Ryan Thompson',
    date: 'Dec 16, 2024',
    amount: 45,
    status: 'completed'
  },
  {
    id: '#BC-12343',
    guest: 'Jessica White',
    date: 'Dec 14, 2024',
    amount: 45,
    status: 'completed'
  },
  {
    id: '#BC-12342',
    guest: 'David Lee',
    date: 'Dec 12, 2024',
    amount: 45,
    status: 'completed'
  },
  {
    id: '#BC-12341',
    guest: 'Emma Brown',
    date: 'Dec 10, 2024',
    amount: 45,
    status: 'cancelled'
  }
]

const reviews = [
  {
    id: 1,
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    rating: 5,
    date: 'Dec 18, 2024',
    comment: 'Absolutely immaculate! The premium toiletries and climate control made it a perfect experience. Highly recommend!'
  },
  {
    id: 2,
    userName: 'Ryan Thompson',
    userInitials: 'RT',
    rating: 5,
    date: 'Dec 16, 2024',
    comment: 'Clean, modern, and well-maintained. The location is perfect for downtown professionals.'
  },
  {
    id: 3,
    userName: 'Jessica White',
    userInitials: 'JW',
    rating: 4,
    date: 'Dec 14, 2024',
    comment: 'Great facility with excellent amenities. The only minor issue was the music volume, but overall fantastic.'
  }
]
</script>

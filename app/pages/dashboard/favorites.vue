<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">My Favorites</h1>
        <p class="mt-1 text-slate-600">{{ favorites.length }} saved properties</p>
      </div>
      <Button @click="navigateTo('/search')">
        <Search class="w-4 h-4 mr-2" />
        Browse More
      </Button>
    </div>

    <!-- Favorites Grid -->
    <div v-if="favorites.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="property in favorites"
        :key="property.id"
        class="hover:shadow-lg transition-all overflow-hidden group"
      >
        <div class="relative">
          <img
            :src="property.image"
            :alt="property.name"
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform cursor-pointer"
            @click="navigateTo(`/bathrooms/${property.id}`)"
          />
          <button
            class="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
            @click="removeFavorite(property.id)"
          >
            <Heart class="w-5 h-5 text-pink-600 fill-pink-600" />
          </button>
        </div>
        <CardContent class="p-5">
          <div
            class="cursor-pointer"
            @click="navigateTo(`/bathrooms/${property.id}`)"
          >
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {{ property.name }}
            </h3>
            <div class="flex items-center mt-2 text-sm text-slate-600">
              <MapPin class="w-4 h-4 mr-1 flex-shrink-0" />
              <span class="truncate">{{ property.location }}</span>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center text-sm">
                <Star class="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span class="ml-1 font-semibold">{{ property.rating }}</span>
                <span class="ml-1 text-slate-600">({{ property.reviews }})</span>
              </div>
              <span class="text-lg font-bold text-slate-900">${{ property.price }}</span>
            </div>
            <div class="flex flex-wrap gap-1.5 mt-3">
              <span
                v-for="amenity in property.amenities.slice(0, 3)"
                :key="amenity"
                class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded"
              >
                {{ amenity }}
              </span>
              <span
                v-if="property.amenities.length > 3"
                class="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded"
              >
                +{{ property.amenities.length - 3 }}
              </span>
            </div>
          </div>
          <div class="flex gap-2 mt-4 pt-4 border-t border-slate-200">
            <Button class="flex-1" @click="bookNow(property.id)">
              <CalendarIcon class="w-4 h-4 mr-2" />
              Book Now
            </Button>
            <Button variant="outline" size="icon" @click="shareProperty(property.id)">
              <Share2 class="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Empty State -->
    <Card v-else class="py-16">
      <CardContent class="text-center">
        <Heart class="w-16 h-16 mx-auto text-slate-300" />
        <h3 class="mt-4 text-lg font-semibold text-slate-900">No favorites yet</h3>
        <p class="mt-2 text-slate-600 max-w-md mx-auto">
          Start exploring and save your favorite bathrooms for quick access later
        </p>
        <Button class="mt-6" @click="navigateTo('/search')">
          <Search class="w-4 h-4 mr-2" />
          Browse Bathrooms
        </Button>
      </CardContent>
    </Card>

    <!-- Quick Tips -->
    <Card v-if="favorites.length > 0">
      <CardHeader class="border-b border-slate-200">
        <CardTitle class="text-lg flex items-center">
          <Info class="w-5 h-5 mr-2" />
          Quick Tips
        </CardTitle>
      </CardHeader>
      <CardContent class="p-6">
        <ul class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>Book your favorite properties in advance to secure your preferred time slots</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>You can share your favorite properties with friends and family</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
            <span>Get notified when your favorite properties have special offers</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Heart,
  Search,
  MapPin,
  Star,
  Calendar as CalendarIcon,
  Share2,
  Info,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'dashboard-user',
})

// Mock favorites data
const favorites = ref([
  {
    id: 201,
    name: 'Spa-Like Bathroom',
    location: 'Manhattan, NY',
    rating: 4.9,
    reviews: 142,
    price: 18,
    amenities: ['Premium Toiletries', 'Heated Floors', 'Towel Warmer', 'Aromatherapy'],
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&h=400&fit=crop',
  },
  {
    id: 202,
    name: 'Premium Hotel Facilities',
    location: 'Manhattan, NY',
    rating: 5.0,
    reviews: 203,
    price: 20,
    amenities: ['Luxury Fixtures', 'Marble Counters', 'Rain Shower', 'Bidet'],
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&h=400&fit=crop',
  },
  {
    id: 203,
    name: 'Modern Office Restroom',
    location: 'Queens, NY',
    rating: 4.8,
    reviews: 156,
    price: 12,
    amenities: ['Clean & Modern', 'Well-lit', 'Wheelchair Accessible', 'Baby Changing'],
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop',
  },
  {
    id: 204,
    name: 'Cozy Cafe Bathroom',
    location: 'Brooklyn, NY',
    rating: 4.7,
    reviews: 89,
    price: 8,
    amenities: ['Artistic Decor', 'Plants', 'Natural Light', 'Music'],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
  },
  {
    id: 205,
    name: 'Luxury Downtown Restroom',
    location: 'Manhattan, NY',
    rating: 4.9,
    reviews: 127,
    price: 15,
    amenities: ['Smart Controls', 'Ambient Lighting', 'Designer Fixtures', 'Air Purifier'],
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
  },
  {
    id: 206,
    name: 'Trendy Restaurant Restroom',
    location: 'Brooklyn, NY',
    rating: 4.5,
    reviews: 91,
    price: 10,
    amenities: ['Instagram-worthy', 'Unique Design', 'Fresh Flowers', 'Signature Scent'],
    image: 'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=600&h=400&fit=crop',
  },
  {
    id: 207,
    name: 'Elegant Boutique Restroom',
    location: 'Manhattan, NY',
    rating: 4.7,
    reviews: 98,
    price: 14,
    amenities: ['Boutique Style', 'Plush Towels', 'Vanity Area', 'High-end Products'],
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&h=400&fit=crop',
  },
  {
    id: 208,
    name: 'Quiet Library Restroom',
    location: 'Bronx, NY',
    rating: 4.6,
    reviews: 74,
    price: 6,
    amenities: ['Peaceful', 'Well-maintained', 'Reading Material', 'Climate Control'],
    image: 'https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?w=600&h=400&fit=crop',
  },
])

// Actions
const removeFavorite = (id: number) => {
  console.log('Remove from favorites:', id)
  // TODO: Implement remove from favorites functionality
  if (confirm('Remove this property from your favorites?')) {
    const index = favorites.value.findIndex(f => f.id === id)
    if (index !== -1) {
      favorites.value.splice(index, 1)
    }
  }
}

const bookNow = (id: number) => {
  // Since individual property pages don't exist yet, go to search page
  navigateTo('/search')
}

const shareProperty = (id: number) => {
  alert(`Share property #${id} functionality`)
}
</script>

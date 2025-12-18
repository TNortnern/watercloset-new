<template>
  <div class="space-y-6">
    <!-- Back Button & Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="navigateTo('/dashboard/bookings')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Bookings
      </Button>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Booking Details</h1>
        <p class="mt-1 text-slate-600">Booking #{{ booking.id }}</p>
      </div>
      <span
        :class="[
          'px-4 py-2 text-sm font-medium rounded-full w-fit',
          booking.status === 'Confirmed' && 'bg-green-100 text-green-700',
          booking.status === 'Completed' && 'bg-blue-100 text-blue-700',
          booking.status === 'Cancelled' && 'bg-red-100 text-red-700',
        ]"
      >
        {{ booking.status }}
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Property Info -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="flex flex-col sm:flex-row gap-6">
              <img
                :src="booking.image"
                :alt="booking.name"
                class="w-full sm:w-64 h-64 object-cover rounded-lg"
              />
              <div class="flex-1">
                <h2 class="text-2xl font-semibold text-slate-900">{{ booking.name }}</h2>
                <div class="flex items-center mt-2 text-slate-600">
                  <MapPin class="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{{ booking.address }}</span>
                </div>
                <div class="flex items-center mt-3 text-sm">
                  <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span class="ml-1 font-semibold">{{ booking.rating }}</span>
                  <span class="ml-1 text-slate-600">({{ booking.reviews }} reviews)</span>
                </div>
                <div class="flex items-center gap-4 mt-4 text-sm text-slate-600">
                  <div class="flex items-center">
                    <User class="w-4 h-4 mr-1.5" />
                    Host: {{ booking.host }}
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span
                    v-for="amenity in booking.amenities"
                    :key="amenity"
                    class="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
                  >
                    {{ amenity }}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Booking Details -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div class="flex items-center text-slate-600 mb-2">
                  <CalendarIcon class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">Date</span>
                </div>
                <p class="text-lg font-semibold text-slate-900">{{ booking.date }}</p>
              </div>
              <div>
                <div class="flex items-center text-slate-600 mb-2">
                  <Clock class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">Time</span>
                </div>
                <p class="text-lg font-semibold text-slate-900">{{ booking.time }}</p>
              </div>
              <div>
                <div class="flex items-center text-slate-600 mb-2">
                  <Users class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">Duration</span>
                </div>
                <p class="text-lg font-semibold text-slate-900">{{ booking.duration }}</p>
              </div>
              <div>
                <div class="flex items-center text-slate-600 mb-2">
                  <DollarSign class="w-5 h-5 mr-2" />
                  <span class="text-sm font-medium">Total Price</span>
                </div>
                <p class="text-lg font-semibold text-slate-900">${{ booking.price }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Access Instructions (for confirmed bookings) -->
        <Card v-if="booking.status === 'Confirmed'">
          <CardHeader class="border-b border-slate-200">
            <CardTitle class="flex items-center">
              <Key class="w-5 h-5 mr-2" />
              Access Instructions
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-4">
              <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-sm text-blue-900 font-medium mb-2">Important Information</p>
                <p class="text-sm text-blue-800">Please arrive 5 minutes before your scheduled time. The access code will be sent to you 30 minutes before your booking.</p>
              </div>
              <div>
                <h4 class="text-sm font-semibold text-slate-900 mb-2">Steps to Access:</h4>
                <ol class="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Enter through the main entrance at {{ booking.address }}</li>
                  <li>Use the access code provided via SMS to unlock the door</li>
                  <li>The restroom is located on the ground floor, first door on the right</li>
                  <li>Please ensure to lock the door when you leave</li>
                </ol>
              </div>
              <div class="p-4 bg-slate-50 rounded-lg">
                <p class="text-sm font-medium text-slate-900 mb-1">Access Code</p>
                <p class="text-xs text-slate-600 mb-2">Will be sent 30 minutes before booking</p>
                <div class="flex items-center gap-2">
                  <div class="px-4 py-2 bg-white border-2 border-dashed border-slate-300 rounded font-mono text-lg tracking-wider text-slate-400">
                    ****
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Location Map -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle class="flex items-center">
              <MapPin class="w-5 h-5 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="bg-slate-100 h-64 rounded-lg flex items-center justify-center">
              <div class="text-center">
                <MapPin class="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p class="text-slate-600 text-sm">Map placeholder</p>
                <p class="text-xs text-slate-500 mt-1">{{ booking.address }}</p>
              </div>
            </div>
            <Button variant="outline" class="w-full mt-4">
              <Navigation class="w-4 h-4 mr-2" />
              Get Directions
            </Button>
          </CardContent>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Actions -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent class="p-6 space-y-3">
            <Button
              v-if="booking.status === 'Confirmed'"
              variant="outline"
              class="w-full"
              @click="modifyBooking"
            >
              <Edit class="w-4 h-4 mr-2" />
              Modify Booking
            </Button>
            <Button
              v-if="booking.status === 'Confirmed'"
              variant="outline"
              class="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              @click="cancelBooking"
            >
              <X class="w-4 h-4 mr-2" />
              Cancel Booking
            </Button>
            <Button
              v-if="booking.status === 'Completed' && !booking.reviewed"
              class="w-full"
              @click="leaveReview"
            >
              <Star class="w-4 h-4 mr-2" />
              Leave Review
            </Button>
            <Button
              v-if="booking.status === 'Completed'"
              variant="outline"
              class="w-full"
              @click="bookAgain"
            >
              <RefreshCw class="w-4 h-4 mr-2" />
              Book Again
            </Button>
            <Button variant="outline" class="w-full" @click="contactHost">
              <MessageSquare class="w-4 h-4 mr-2" />
              Contact Host
            </Button>
          </CardContent>
        </Card>

        <!-- Payment Summary -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Base price</span>
                <span class="text-slate-900">${{ booking.basePrice }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-600">Service fee</span>
                <span class="text-slate-900">${{ booking.serviceFee }}</span>
              </div>
              <div class="border-t border-slate-200 pt-3 flex justify-between font-semibold">
                <span class="text-slate-900">Total</span>
                <span class="text-slate-900">${{ booking.price }}</span>
              </div>
              <div class="pt-3 border-t border-slate-200">
                <div class="flex items-center text-sm text-slate-600 mb-1">
                  <CreditCard class="w-4 h-4 mr-2" />
                  <span>Payment Method</span>
                </div>
                <p class="text-sm font-medium text-slate-900">{{ booking.paymentMethod }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Host Information -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Host Information</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                <User class="w-8 h-8 text-slate-400" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-slate-900">{{ booking.host }}</h3>
                <div class="flex items-center mt-1 text-sm text-slate-600">
                  <Star class="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                  <span>4.9 rating</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">Hosting since 2023</p>
                <Button variant="outline" size="sm" class="mt-3 w-full" @click="viewHostProfile">
                  View Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Support -->
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-3">
              <Button variant="outline" class="w-full" @click="contactSupport">
                <MessageCircle class="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" class="w-full" @click="reportIssue">
                <AlertCircle class="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Star,
  User,
  Users,
  DollarSign,
  Key,
  Navigation,
  Edit,
  X,
  RefreshCw,
  MessageSquare,
  CreditCard,
  MessageCircle,
  AlertCircle,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'dashboard-user',
})

const route = useRoute()
const bookingId = route.params.id

// Mock booking data
const booking = ref({
  id: bookingId,
  name: 'Luxury Downtown Restroom',
  location: 'Manhattan, NY',
  address: '123 Broadway, Manhattan, NY 10001',
  date: 'Dec 18, 2025',
  time: '2:00 PM - 2:30 PM',
  duration: '30 minutes',
  price: 15,
  basePrice: 12,
  serviceFee: 3,
  status: 'Confirmed',
  host: 'John Smith',
  rating: 4.9,
  reviews: 127,
  reviewed: false,
  paymentMethod: 'Visa •••• 4242',
  amenities: ['Wheelchair Accessible', 'Baby Changing', 'Premium Toiletries', 'Climate Control'],
  image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop',
})

// Actions
const modifyBooking = () => {
  alert('Modify booking functionality')
}

const cancelBooking = () => {
  if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    booking.value.status = 'Cancelled'
    alert('Booking cancelled successfully')
  }
}

const leaveReview = () => {
  alert('Leave review modal would open here')
}

const bookAgain = () => {
  navigateTo('/bathrooms/' + bookingId)
}

const contactHost = () => {
  navigateTo('/dashboard/messages')
}

const viewHostProfile = () => {
  alert('View host profile')
}

const contactSupport = () => {
  alert('Contact support')
}

const reportIssue = () => {
  alert('Report issue form')
}
</script>

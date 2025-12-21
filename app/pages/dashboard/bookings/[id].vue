<template>
  <div class="space-y-6">
    <!-- Back Button & Header -->
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="navigateTo('/dashboard/bookings')">
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Bookings
      </Button>
    </div>

    <div v-if="!booking && !pending" class="text-center py-12">
      <p class="text-slate-600">Booking not found</p>
      <Button class="mt-4" @click="navigateTo('/dashboard/bookings')">
        Back to Bookings
      </Button>
    </div>

    <div v-else-if="booking" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

    <div v-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <p v-if="!booking.accessCode" class="text-xs text-slate-600 mb-2">Will be sent 30 minutes before booking</p>
                <div class="flex items-center gap-2">
                  <div class="px-4 py-2 bg-white border-2 border-dashed border-slate-300 rounded font-mono text-lg tracking-wider" :class="booking.accessCode ? 'text-slate-900' : 'text-slate-400'">
                    {{ booking.accessCode || '****' }}
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

        <!-- Review Section (for completed bookings) -->
        <Card v-if="booking.status === 'Completed' && !showReviewForm && !hasReview">
          <CardHeader class="border-b border-slate-200">
            <CardTitle class="flex items-center">
              <Star class="w-5 h-5 mr-2 text-yellow-500" />
              Leave a Review
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <p class="text-sm text-slate-600 mb-4">
              Share your experience to help other users and support the host.
            </p>
            <Button class="w-full" @click="showReviewForm = true">
              <Star class="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </CardContent>
        </Card>

        <!-- Review Form -->
        <Card v-if="showReviewForm && !hasReview">
          <CardContent class="p-6">
            <ReviewForm
              :booking-id="bookingId"
              :property-id="booking.propertyId"
              :property-name="booking.name"
              @success="handleReviewSuccess"
              @cancel="showReviewForm = false"
            />
          </CardContent>
        </Card>

        <!-- Review Submitted -->
        <Card v-if="hasReview">
          <CardHeader class="border-b border-slate-200">
            <CardTitle class="flex items-center">
              <Star class="w-5 h-5 mr-2 text-yellow-500 fill-yellow-500" />
              Your Review
            </CardTitle>
          </CardHeader>
          <CardContent class="p-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-600" />
                <p class="font-medium text-green-900">Review submitted successfully!</p>
              </div>
              <p class="text-sm text-green-700 mt-2">
                Thank you for sharing your experience. Your review helps other users make informed decisions.
              </p>
            </div>
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
import { computed, ref } from 'vue'
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
  CheckCircle2,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ReviewForm from '@/components/ReviewForm.vue'

definePageMeta({
  layout: 'dashboard-user',
})

const route = useRoute()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()
const bookingId = route.params.id as string

// Review state
const showReviewForm = ref(false)
const hasReview = ref(false)

// Fetch booking details
const { data: bookingData, pending, refresh } = await useAsyncData(
  `booking-${bookingId}`,
  async () => {
    return await payload.findByID('bookings', bookingId, 2)
  }
)

// Check if booking has been reviewed
const { data: reviewData } = await useAsyncData(
  `booking-review-${bookingId}`,
  async () => {
    try {
      const result = await payload.find('reviews', {
        where: {
          booking: { equals: bookingId }
        },
        limit: 1
      })
      return result
    } catch (error) {
      console.error('Error fetching review:', error)
      return null
    }
  }
)

// Set hasReview based on reviewData
if (reviewData.value?.docs && reviewData.value.docs.length > 0) {
  hasReview.value = true
}

// Transform booking data for display
const booking = computed(() => {
  if (!bookingData.value) return null

  const b = bookingData.value
  const property = b.property
  const startTime = new Date(b.startTime)
  const endTime = new Date(b.endTime)
  const now = new Date()

  // Determine display status
  let displayStatus = 'Confirmed'
  if (b.status === 'cancelled') {
    displayStatus = 'Cancelled'
  } else if (endTime < now) {
    displayStatus = 'Completed'
  } else if (b.status === 'confirmed') {
    displayStatus = 'Confirmed'
  }

  // Get duration in minutes
  const durationMs = endTime.getTime() - startTime.getTime()
  const durationMins = Math.floor(durationMs / (1000 * 60))

  // Get host name
  const owner = property?.owner
  const hostName = owner?.firstName && owner?.lastName
    ? `${owner.firstName} ${owner.lastName}`
    : 'Property Owner'

  // Get full address
  const addr = property?.address
  const fullAddress = addr
    ? `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zipCode || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ',')
    : 'Address not available'

  const propertyId = typeof property === 'string' ? property : property?.id

  return {
    id: b.id,
    propertyId: propertyId,
    name: property?.name || 'Unknown Property',
    location: addr?.city && addr?.state ? `${addr.city}, ${addr.state}` : 'Location not available',
    address: fullAddress,
    date: startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: `${startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
    duration: `${durationMins} minutes`,
    price: b.totalPrice || 0,
    basePrice: b.basePrice || 0,
    serviceFee: b.serviceFee || 0,
    status: displayStatus,
    host: hostName,
    rating: property?.averageRating || 0,
    reviews: property?.reviewCount || 0,
    reviewed: hasReview.value,
    paymentMethod: 'Card on file', // TODO: Get actual payment method if stored
    amenities: property?.amenities || [],
    image: property?.images?.[0]?.url || 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=600&fit=crop',
    accessCode: b.accessCode || null,
    accessInstructions: property?.accessInstructions || 'Access instructions will be provided.',
  }
})

// Actions
const modifyBooking = () => {
  // TODO: Implement modify booking modal
  toast.info('Modify booking functionality coming soon')
}

const cancelBooking = async () => {
  const confirmed = await confirm({
    title: 'Cancel Booking',
    message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
    confirmText: 'Cancel Booking',
    variant: 'destructive',
  })

  if (!confirmed) return

  try {
    await payload.update('bookings', bookingId, { status: 'cancelled' })
    await refresh()
    toast.success('Booking cancelled successfully')
  } catch (error) {
    console.error('Failed to cancel booking:', error)
    toast.error('Failed to cancel booking. Please try again.')
  }
}

const leaveReview = () => {
  showReviewForm.value = true
}

const handleReviewSuccess = async () => {
  hasReview.value = true
  showReviewForm.value = false

  // Refresh booking data
  await refresh()
}

const bookAgain = () => {
  // For now, redirect to search page
  navigateTo('/search')
}

const contactHost = () => {
  navigateTo('/dashboard/messages')
}

const viewHostProfile = () => {
  // TODO: Implement host profile view
  toast.info('Host profile feature coming soon')
}

const contactSupport = () => {
  // TODO: Implement support contact
  navigateTo('/contact')
}

const reportIssue = () => {
  // TODO: Implement issue reporting
  toast.info('Issue reporting feature coming soon')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Back button -->
      <NuxtLink
        :to="`/bathrooms/${propertyId}`"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to property
      </NuxtLink>

      <!-- Loading state -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle class="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 class="text-xl font-semibold text-red-800 mb-2">Error</h2>
        <p class="text-red-600">{{ error }}</p>
        <NuxtLink to="/search" class="mt-4 inline-block text-blue-600 hover:underline">
          Browse other bathrooms
        </NuxtLink>
      </div>

      <!-- Booking form -->
      <div v-else-if="property" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Booking details -->
        <div class="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle class="text-2xl">Complete Your Booking</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Property summary -->
              <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  :src="propertyImage"
                  :alt="property.name"
                  class="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 class="font-semibold text-gray-900">{{ property.name }}</h3>
                  <div class="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <MapPin class="w-4 h-4" />
                    {{ property.location?.address }}, {{ property.location?.city }}
                  </div>
                  <div class="mt-2 text-lg font-bold text-blue-600">
                    ${{ (property.pricePerMinute / 100).toFixed(2) }}/min
                  </div>
                </div>
              </div>

              <!-- Step 1: Date & Time -->
              <div v-if="step === 1" class="space-y-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <Calendar class="w-5 h-5 text-blue-600" />
                  Select Date & Time
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input
                      v-model="bookingDate"
                      type="date"
                      :min="minDate"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      v-model="startTime"
                      type="time"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Duration: {{ duration }} minutes
                  </label>
                  <input
                    v-model="duration"
                    type="range"
                    :min="property.minimumDuration || 15"
                    :max="property.maximumDuration || 60"
                    step="5"
                    class="w-full"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{{ property.minimumDuration || 15 }} min</span>
                    <span>{{ property.maximumDuration || 60 }} min</span>
                  </div>
                </div>

                <Button
                  @click="step = 2"
                  :disabled="!isStep1Valid"
                  class="w-full"
                  size="lg"
                >
                  Continue to Payment
                  <ArrowRight class="w-4 h-4 ml-2" />
                </Button>
              </div>

              <!-- Step 2: Payment - Redirect to Stripe Checkout -->
              <div v-else-if="step === 2" class="space-y-4">
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <CreditCard class="w-5 h-5 text-blue-600" />
                  Secure Payment
                </h3>

                <div class="flex flex-col items-center justify-center py-8">
                  <Loader2 class="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <span class="text-gray-600">Redirecting to secure checkout...</span>
                  <p class="text-sm text-gray-500 mt-2">You'll be redirected to Stripe to complete your payment.</p>
                </div>

                <div v-if="paymentError" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p class="text-red-600 text-sm mb-3">{{ paymentError }}</p>
                  <div class="flex gap-3">
                    <Button variant="outline" @click="step = 1" class="flex-1">
                      <ArrowLeft class="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button @click="retryCheckout" :disabled="processing" class="flex-1">
                      <Loader2 v-if="processing" class="w-4 h-4 mr-2 animate-spin" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Step 3: Confirmation -->
              <div v-else-if="step === 3" class="text-center py-8">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle class="w-10 h-10 text-green-600" />
                </div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p class="text-gray-600 mb-6">
                  Your booking has been confirmed. You'll receive access details shortly.
                </p>
                <div class="space-y-3">
                  <NuxtLink to="/dashboard/bookings">
                    <Button class="w-full">View My Bookings</Button>
                  </NuxtLink>
                  <NuxtLink to="/search">
                    <Button variant="outline" class="w-full">Browse More</Button>
                  </NuxtLink>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Right: Order summary -->
        <div class="lg:col-span-1">
          <Card class="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Date</span>
                  <span class="font-medium">{{ formattedDate }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Time</span>
                  <span class="font-medium">{{ startTime }} - {{ endTimeDisplay }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Duration</span>
                  <span class="font-medium">{{ duration }} minutes</span>
                </div>
              </div>

              <hr />

              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">
                    ${{ (property.pricePerMinute / 100).toFixed(2) }} x {{ duration }} min
                  </span>
                  <span class="font-medium">${{ basePrice.toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Service fee</span>
                  <span class="font-medium">${{ serviceFee.toFixed(2) }}</span>
                </div>
              </div>

              <hr />

              <div class="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span class="text-blue-600">${{ totalPrice.toFixed(2) }}</span>
              </div>

              <div class="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <Lock class="w-4 h-4 inline mr-1" />
                Secure checkout powered by Stripe
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CreditCard,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  Lock
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
definePageMeta({
  middleware: ['auth'],
})

const route = useRoute()
const propertyId = route.params.propertyId as string

const payload = usePayload()
const { createCheckoutSession } = useStripe()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const property = ref<any>(null)
const step = ref(1)

// Booking details
const bookingDate = ref('')
const startTime = ref('10:00')
const duration = ref(30)

// Payment state
const processing = ref(false)
const paymentError = ref<string | null>(null)
const bookingId = ref<string | null>(null)

// Computed
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const propertyImage = computed(() => {
  const photos = property.value?.photos
  if (photos?.[0]?.image?.url) {
    return photos[0].image.url
  }
  return 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=300&fit=crop'
})

const formattedDate = computed(() => {
  if (!bookingDate.value) return '-'
  return new Date(bookingDate.value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
})

const endTimeDisplay = computed(() => {
  if (!startTime.value) return '-'
  const [hours, minutes] = startTime.value.split(':').map(Number)
  const endMinutes = hours * 60 + minutes + duration.value
  const endHours = Math.floor(endMinutes / 60) % 24
  const endMins = endMinutes % 60
  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`
})

const basePrice = computed(() => {
  if (!property.value) return 0
  return (property.value.pricePerMinute / 100) * duration.value
})

const serviceFee = computed(() => basePrice.value * 0.15)

const totalPrice = computed(() => basePrice.value + serviceFee.value)

const isStep1Valid = computed(() => {
  return bookingDate.value && startTime.value && duration.value > 0
})

// Initialize Stripe when entering step 2
watch(step, async (newStep) => {
  if (newStep === 2) {
    await initializePayment()
  }
})

// Fetch property
onMounted(async () => {
  try {
    property.value = await payload.findByID('properties', propertyId, 2)

    // Set default date to today
    bookingDate.value = minDate.value

    // Set default duration
    if (property.value?.minimumDuration) {
      duration.value = property.value.minimumDuration
    }
  } catch (e: any) {
    error.value = e?.data?.message || 'Failed to load property'
  } finally {
    loading.value = false
  }
})

async function initializePayment() {
  processing.value = true
  paymentError.value = null

  try {
    // Calculate start and end times
    const [hours, minutes] = startTime.value.split(':').map(Number)
    const startDateTime = new Date(bookingDate.value)
    startDateTime.setHours(hours, minutes, 0, 0)

    const endDateTime = new Date(startDateTime)
    endDateTime.setMinutes(endDateTime.getMinutes() + duration.value)

    // Create booking - propertyId must be a number for Payload relationship
    const bookingResponse = await payload.create<{ doc: any; message: string }>('bookings', {
      property: parseInt(propertyId, 10),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    })

    // Payload returns { doc: {...}, message: "..." }
    const booking = bookingResponse.doc || bookingResponse
    bookingId.value = booking.id

    // Create Stripe Checkout session and redirect
    const session = await createCheckoutSession(booking.id)

    if (session.url) {
      // Redirect to Stripe Checkout
      window.location.href = session.url
    } else {
      throw new Error('Failed to create checkout session')
    }
  } catch (e: any) {
    paymentError.value = e?.data?.message || e?.message || 'Failed to initialize payment'
    processing.value = false
  }
}

async function retryCheckout() {
  if (!bookingId.value) {
    // No booking yet, try to create one
    await initializePayment()
    return
  }

  processing.value = true
  paymentError.value = null

  try {
    // Retry with existing booking
    const session = await createCheckoutSession(bookingId.value)

    if (session.url) {
      window.location.href = session.url
    } else {
      throw new Error('Failed to create checkout session')
    }
  } catch (e: any) {
    paymentError.value = e?.data?.message || e?.message || 'Failed to create checkout session'
    processing.value = false
  }
}
</script>

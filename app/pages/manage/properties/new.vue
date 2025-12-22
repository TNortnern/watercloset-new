<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Home,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Save
} from 'lucide-vue-next'
import { ImageUpload } from '@/components/ui/upload'

definePageMeta({
  layout: 'dashboard-provider',
  middleware: 'provider'
})

const auth = useAuth()
const payload = usePayload()
const router = useRouter()
const { toast } = useToast()
const locationApi = useLocationApi()

const currentStep = ref(1)
const totalSteps = 6
const isSubmitting = ref(false)

interface UploadedFile {
  id?: string | number
  url: string
  alt?: string
  filename?: string
}

const formData = ref({
  // Step 1: Basic Info
  name: '',
  description: '',
  type: 'residential',

  // Step 2: Location
  street: '',
  city: '',
  state: '',
  zipCode: '',

  // Step 3: Amenities
  amenities: [] as string[],

  // Step 4: Photos
  photos: [] as UploadedFile[],

  // Step 5: Pricing
  pricePerMinute: '',
  minimumDuration: '15',
  maximumDuration: '120',

  // Step 6: Availability
  instantBooking: true,
  advanceNotice: '1',
  availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
})

const bathroomTypes = [
  { value: 'residential', label: 'Residential', description: 'Private home or apartment bathroom' },
  { value: 'commercial', label: 'Commercial', description: 'Office or business restroom' },
  { value: 'restaurant', label: 'Restaurant/Cafe', description: 'Dining venue restroom' },
  { value: 'hotel', label: 'Hotel/Hospitality', description: 'Hotel or lodging facilities' }
]

const availableAmenities = [
  { value: 'wheelchair', label: 'Wheelchair Accessible' },
  { value: 'baby_changing', label: 'Baby Changing Station' },
  { value: 'shower', label: 'Shower' },
  { value: 'bidet', label: 'Bidet' },
  { value: 'air_freshener', label: 'Air Freshener' },
  { value: 'hand_dryer', label: 'Hand Dryer' },
  { value: 'paper_towels', label: 'Paper Towels' },
  { value: 'feminine', label: 'Feminine Products' },
  { value: 'mirror', label: 'Mirror' },
  { value: 'climate', label: 'Climate Controlled' },
  { value: 'private', label: 'Private' },
  { value: 'gender_neutral', label: 'Gender Neutral' }
]

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
]

const steps = [
  { number: 1, title: 'Basic Info', icon: Home },
  { number: 2, title: 'Location', icon: MapPin },
  { number: 3, title: 'Amenities', icon: Check },
  { number: 4, title: 'Photos', icon: ImageIcon },
  { number: 5, title: 'Pricing', icon: DollarSign },
  { number: 6, title: 'Review', icon: Calendar }
]

const selectedTypeLabel = computed(() => {
  return bathroomTypes.find(type => type.value === formData.value.type)?.label || formData.value.type
})

const getAmenityLabel = (value: string) => {
  return availableAmenities.find(amenity => amenity.value === value)?.label || value
}

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const toggleAmenity = (amenity: string) => {
  const index = formData.value.amenities.indexOf(amenity)
  if (index > -1) {
    formData.value.amenities.splice(index, 1)
  } else {
    formData.value.amenities.push(amenity)
  }
}

const toggleDay = (day: string) => {
  const index = formData.value.availableDays.indexOf(day)
  if (index > -1) {
    formData.value.availableDays.splice(index, 1)
  } else {
    formData.value.availableDays.push(day)
  }
}

// Helper to create richText structure from plain text
const createRichTextFromString = (text: string): any => {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [{ type: 'text', text, version: 1 }],
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

const submitForm = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    const photoIds = formData.value.photos
      .map(photo => photo.id)
      .filter(Boolean) as Array<string | number>

    if (photoIds.length === 0) {
      toast.warning('Please upload at least one photo')
      isSubmitting.value = false
      return
    }

    const addressParts = [
      formData.value.street,
      formData.value.city,
      formData.value.state,
      formData.value.zipCode,
    ]
      .map(part => part.trim())
      .filter(Boolean)
    const addressQuery = addressParts.join(', ')

    if (!addressQuery) {
      toast.warning('Please provide a complete address')
      isSubmitting.value = false
      return
    }

    const geocodeResponse = await locationApi.search({ text: addressQuery })
    const bestMatch = geocodeResponse?.results?.[0]
    if (!bestMatch) {
      toast.error('Unable to locate that address. Please double-check it.')
      isSubmitting.value = false
      return
    }

    const coordinates: [number, number] = [bestMatch.lng, bestMatch.lat]

    // Create property object (owner is set by beforeChange hook, status uses default 'pending')
    const propertyData = {
      name: formData.value.name,
      description: createRichTextFromString(formData.value.description),
      type: formData.value.type,
      location: {
        address: formData.value.street,
        city: formData.value.city,
        state: formData.value.state,
        zipCode: formData.value.zipCode,
        country: 'US',
        coordinates
      },
      pricePerMinute: Math.round(parseFloat(formData.value.pricePerMinute) * 100), // Convert to cents
      minimumDuration: parseInt(formData.value.minimumDuration),
      maximumDuration: parseInt(formData.value.maximumDuration),
      amenities: formData.value.amenities,
      photos: photoIds.map(id => ({ image: id })),
      availability: {
        instantBooking: formData.value.instantBooking,
        advanceNotice: parseInt(formData.value.advanceNotice),
        schedule: formData.value.availableDays.map(day => ({
          day,
          enabled: true,
          startTime: '08:00',
          endTime: '22:00'
        }))
      },
    }

    const newProperty = await payload.create('properties', propertyData)
    toast.success('Property created successfully!')
    router.push(`/manage/properties/${newProperty.id}`)
  } catch (error) {
    console.error('Failed to create property:', error)
    toast.error('Failed to create property. Please try again.')
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <NuxtLink
        to="/manage/properties"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <ArrowLeft class="w-5 h-5 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Add New Property</h1>
        <p class="mt-2 text-gray-600">List your bathroom for guests to book</p>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <div
          v-for="(step, index) in steps"
          :key="step.number"
          class="flex items-center"
        >
          <div class="flex flex-col items-center">
            <div
              :class="[
                'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                currentStep >= step.number
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              ]"
            >
              <component :is="step.icon" class="w-5 h-5" />
            </div>
            <div class="mt-2 text-center">
              <div
                :class="[
                  'text-xs font-medium whitespace-nowrap',
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                ]"
              >
                {{ step.title }}
              </div>
            </div>
          </div>
          <div
            v-if="index < steps.length - 1"
            :class="[
              'w-12 lg:w-24 h-0.5 mb-8 mx-2 transition-all',
              currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="bg-white border border-gray-200 rounded-xl p-8">
      <!-- Step 1: Basic Info -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Basic Information</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Property Name</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="e.g., Downtown Luxury Suite Bathroom"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            v-model="formData.description"
            rows="4"
            placeholder="Describe your bathroom, its features, and what makes it special..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-4">Bathroom Type</label>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="type in bathroomTypes"
              :key="type.value"
              @click="formData.type = type.value"
              :class="[
                'p-4 border-2 rounded-xl cursor-pointer transition-all',
                formData.type === type.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold text-gray-900">{{ type.label }}</h3>
                <div
                  :class="[
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    formData.type === type.value
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  ]"
                >
                  <Check v-if="formData.type === type.value" class="w-3 h-3 text-white" />
                </div>
              </div>
              <p class="text-sm text-gray-600">{{ type.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Location -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Location Details</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
          <input
            v-model="formData.street"
            type="text"
            placeholder="123 Main Street"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              v-model="formData.city"
              type="text"
              placeholder="New York"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              v-model="formData.state"
              type="text"
              placeholder="NY"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            <input
              v-model="formData.zipCode"
              type="text"
              placeholder="10001"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="mt-6 p-6 bg-gray-100 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <MapPin class="w-5 h-5 text-gray-600" />
            <h3 class="font-semibold text-gray-900">Map Preview</h3>
          </div>
          <div class="h-64 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <p class="text-gray-500">Interactive map would appear here</p>
          </div>
        </div>
      </div>

      <!-- Step 3: Amenities -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Amenities & Features</h2>
        <p class="text-gray-600">Select all amenities available in your bathroom</p>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <button
            v-for="amenity in availableAmenities"
            :key="amenity.value"
            @click="toggleAmenity(amenity.value)"
            :class="[
              'p-4 border-2 rounded-xl text-left transition-all',
              formData.amenities.includes(amenity.value)
                ? 'border-blue-600 bg-blue-50 text-blue-900'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ amenity.label }}</span>
              <Check
                v-if="formData.amenities.includes(amenity.value)"
                class="w-4 h-4 text-blue-600"
              />
            </div>
          </button>
        </div>

        <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-800">
            <strong>{{ formData.amenities.length }}</strong> amenities selected
          </p>
        </div>
      </div>

      <!-- Step 4: Photos -->
      <div v-if="currentStep === 4" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Property Photos</h2>
        <p class="text-gray-600">Upload high-quality photos of your bathroom</p>

        <ImageUpload
          v-model="formData.photos"
          multiple
          :max-files="10"
          :allow-url="false"
        />

        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p class="text-sm text-yellow-800">
            <strong>Tips:</strong> Upload at least 5 high-quality photos. Include photos of the toilet, sink, shower/tub, and overall space.
          </p>
        </div>
      </div>

      <!-- Step 5: Pricing & Availability -->
      <div v-if="currentStep === 5" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Pricing & Duration</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Price per Minute</label>
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</div>
            <input
              v-model="formData.pricePerMinute"
              type="number"
              step="0.01"
              placeholder="1.50"
              class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p class="mt-1 text-sm text-gray-600">Recommended: $1.00 - $2.00 per minute</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Minimum Duration (minutes)</label>
            <input
              v-model="formData.minimumDuration"
              type="number"
              placeholder="15"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Maximum Duration (minutes)</label>
            <input
              v-model="formData.maximumDuration"
              type="number"
              placeholder="120"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="p-6 bg-gray-50 rounded-xl">
          <h3 class="font-semibold text-gray-900 mb-4">Availability Settings</h3>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="font-medium text-gray-900">Instant Booking</h4>
                <p class="text-sm text-gray-600">Guests can book without your approval</p>
              </div>
              <button
                @click="formData.instantBooking = !formData.instantBooking"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  formData.instantBooking ? 'bg-blue-600' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    formData.instantBooking ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Advance Notice (hours)</label>
              <select
                v-model="formData.advanceNotice"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">8 hours</option>
                <option value="24">1 day</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  v-for="day in daysOfWeek"
                  :key="day.value"
                  @click="toggleDay(day.value)"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    formData.availableDays.includes(day.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ day.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 6: Review & Submit -->
      <div v-if="currentStep === 6" class="space-y-6">
        <h2 class="text-2xl font-bold text-gray-900">Review Your Listing</h2>
        <p class="text-gray-600">Please review all information before submitting</p>

        <div class="space-y-6">
          <div class="p-6 bg-gray-50 rounded-xl">
            <h3 class="font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Property Name:</span>
                <span class="font-medium text-gray-900">{{ formData.name || 'Not set' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Type:</span>
                <span class="font-medium text-gray-900">{{ selectedTypeLabel }}</span>
              </div>
            </div>
          </div>

          <div class="p-6 bg-gray-50 rounded-xl">
            <h3 class="font-semibold text-gray-900 mb-4">Location</h3>
            <div class="text-sm text-gray-700">
              {{ formData.street || 'Address not set' }}<br>
              {{ formData.city }}, {{ formData.state }} {{ formData.zipCode }}
            </div>
          </div>

          <div class="p-6 bg-gray-50 rounded-xl">
            <h3 class="font-semibold text-gray-900 mb-4">Amenities</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in formData.amenities"
                :key="amenity"
                class="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
              >
                {{ getAmenityLabel(amenity) }}
              </span>
              <span v-if="formData.amenities.length === 0" class="text-sm text-gray-500">
                No amenities selected
              </span>
            </div>
          </div>

          <div class="p-6 bg-gray-50 rounded-xl">
            <h3 class="font-semibold text-gray-900 mb-4">Pricing</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Price per Minute:</span>
                <span class="font-medium text-gray-900">${{ formData.pricePerMinute || '0.00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Duration Range:</span>
                <span class="font-medium text-gray-900">{{ formData.minimumDuration }}-{{ formData.maximumDuration }} min</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Instant Booking:</span>
                <span class="font-medium text-gray-900">{{ formData.instantBooking ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between">
      <button
        v-if="currentStep > 1"
        @click="prevStep"
        class="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
        Previous
      </button>
      <div v-else></div>

      <button
        v-if="currentStep < totalSteps"
        @click="nextStep"
        class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
      >
        Next
        <ArrowRight class="w-5 h-5" />
      </button>
      <button
        v-else
        @click="submitForm"
        :disabled="isSubmitting"
        class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save class="w-5 h-5" />
        {{ isSubmitting ? 'Creating...' : 'Submit Listing' }}
      </button>
    </div>
  </div>
</template>

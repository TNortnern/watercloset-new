<script setup lang="ts">
import { X, ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Property {
  id: string | number
  name: string
  description?: any
  pricePerMinute: number
  photos?: Array<{ image: { url: string }; caption?: string }>
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
  }
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  type?: string
  amenities?: string[]
  distance?: number
}

interface Props {
  property: Property | null
  properties: Property[]
  currentIndex: number
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'navigate': [direction: 'prev' | 'next']
}>()

const router = useRouter()

const canNavigatePrev = computed(() => props.currentIndex > 0)
const canNavigateNext = computed(() => props.currentIndex < props.properties.length - 1)

const navigatePrev = () => {
  if (canNavigatePrev.value) {
    emit('navigate', 'prev')
  }
}

const navigateNext = () => {
  if (canNavigateNext.value) {
    emit('navigate', 'next')
  }
}

const closeDrawer = () => {
  emit('update:show', false)
}

const viewFullDetails = () => {
  if (props.property) {
    router.push(`/bathrooms/${props.property.id}`)
  }
}

const getFirstPhotoUrl = (property: Property) => {
  if (property.photos?.length && property.photos[0]?.image?.url) {
    return property.photos[0].image.url
  }
  return '/images/bathrooms/luxurybathroom1.jpg'
}

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}

const formatDistance = (meters?: number) => {
  if (!meters) return null
  const miles = meters / 1609.34
  if (miles < 0.1) {
    return `${Math.round(meters * 3.281)} ft`
  }
  return `${miles.toFixed(1)} mi`
}

const getPlainDescription = (description: any): string => {
  if (!description) return 'No description available.'
  if (typeof description === 'string') return description

  // Handle Lexical rich text format
  if (description?.root?.children) {
    const extractText = (nodes: any[]): string => {
      return nodes.map(node => {
        if (node.text) return node.text
        if (node.children) return extractText(node.children)
        return ''
      }).join(' ')
    }
    return extractText(description.root.children)
  }

  return 'No description available.'
}

const showFullDescription = ref(false)
const descriptionLimit = 150

const truncatedDescription = computed(() => {
  const description = getPlainDescription(props.property?.description)
  if (showFullDescription.value || description.length <= descriptionLimit) {
    return description
  }
  return `${description.substring(0, descriptionLimit)}...`
})

const shouldShowSeeMore = computed(() => {
  const description = getPlainDescription(props.property?.description)
  return description.length > descriptionLimit && !showFullDescription.value
})

// Reset description state when property changes
watch(() => props.property?.id, () => {
  showFullDescription.value = false
})

const amenityLabels: Record<string, string> = {
  wheelchair: 'Wheelchair Accessible',
  baby_changing: 'Baby Changing',
  shower: 'Shower',
  bidet: 'Bidet',
  air_freshener: 'Air Freshener',
  hand_dryer: 'Hand Dryer',
  paper_towels: 'Paper Towels',
  feminine: 'Feminine Products',
  mirror: 'Mirror',
  climate: 'Climate Controlled',
  private: 'Private',
  gender_neutral: 'Gender Neutral',
}
</script>

<template>
  <Transition name="drawer">
    <div
      v-if="show && property"
      class="fixed left-0 top-0 h-full w-4/5 md:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
    >
      <!-- Header with close button -->
      <div class="flex items-center justify-between p-4 border-b">
        <h3 class="text-lg font-semibold">Property Details</h3>
        <button
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
          @click="closeDrawer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation arrows -->
      <div class="flex items-center justify-between px-4 py-2 bg-gray-50">
        <button
          :disabled="!canNavigatePrev"
          class="p-2 rounded-full transition-colors"
          :class="canNavigatePrev ? 'hover:bg-gray-200 text-gray-700' : 'text-gray-300 cursor-not-allowed'"
          @click="navigatePrev"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <span class="text-sm text-gray-600">
          {{ currentIndex + 1 }} of {{ properties.length }}
        </span>
        <button
          :disabled="!canNavigateNext"
          class="p-2 rounded-full transition-colors"
          :class="canNavigateNext ? 'hover:bg-gray-200 text-gray-700' : 'text-gray-300 cursor-not-allowed'"
          @click="navigateNext"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Image -->
        <div class="relative h-56">
          <img
            :src="getFirstPhotoUrl(property)"
            :alt="property.name"
            class="w-full h-full object-cover"
          />
          <!-- Price overlay -->
          <div class="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
            <span class="text-2xl font-bold">${{ formatPrice(property.pricePerMinute) }}</span>
            <span class="text-sm text-gray-600">/min</span>
          </div>
        </div>

        <!-- Property info -->
        <div class="p-4 space-y-4">
          <!-- Title and rating -->
          <div>
            <h2 class="text-xl font-semibold mb-1">{{ property.name }}</h2>
            <div class="flex items-center gap-2 text-sm">
              <template v-if="property.stats?.averageRating">
                <div class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span class="ml-1 font-medium">{{ property.stats.averageRating.toFixed(1) }}</span>
                  <span class="text-gray-500 ml-1">({{ property.stats.reviewCount || 0 }} reviews)</span>
                </div>
              </template>
              <span v-if="property.distance" class="text-gray-600">
                {{ property.stats?.averageRating ? '•' : '' }} {{ formatDistance(property.distance) }} away
              </span>
            </div>
          </div>

          <!-- Address -->
          <div class="text-sm text-gray-600 flex items-start gap-2">
            <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{{ property.location?.address }}, {{ property.location?.city }}, {{ property.location?.state }} {{ property.location?.zipCode }}</span>
          </div>

          <!-- Amenities -->
          <div v-if="property.amenities?.length">
            <h4 class="font-medium mb-2">Amenities</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="amenity in property.amenities.slice(0, 6)"
                :key="amenity"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {{ amenityLabels[amenity] || amenity }}
              </span>
              <span
                v-if="property.amenities.length > 6"
                class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-500"
              >
                +{{ property.amenities.length - 6 }} more
              </span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 class="font-medium mb-2">About this bathroom</h4>
            <p class="text-sm text-gray-600">
              {{ truncatedDescription }}
            </p>
            <button
              v-if="shouldShowSeeMore || showFullDescription"
              class="text-primary hover:text-primary/80 text-sm font-medium mt-1 transition-colors"
              @click="showFullDescription = !showFullDescription"
            >
              {{ showFullDescription ? 'See less' : 'See more' }}
            </button>
          </div>

          <!-- Action buttons -->
          <div class="space-y-2 pt-4">
            <Button class="w-full" @click="viewFullDetails">
              View Full Details & Book
            </Button>
            <Button variant="outline" class="w-full" @click="closeDrawer">
              Continue Browsing
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Overlay -->
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/25 z-40"
      @click="closeDrawer"
    />
  </Transition>
</template>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease-out;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

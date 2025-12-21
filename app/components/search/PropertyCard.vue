<script setup lang="ts">
import { Star, MapPin, DollarSign } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Property {
  id: string
  name: string
  description?: any
  pricePerMinute: number
  photos?: Array<{
    image: {
      url: string
      alt?: string
    }
    caption?: string
  }>
  location?: {
    address?: string
    city?: string
    state?: string
    zipCode?: string
    coordinates?: {
      type: string
      coordinates: [number, number]
    }
  }
  amenities?: string[]
  type?: string
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
}

interface Props {
  property: Property
}

const props = defineProps<Props>()

const primaryImage = computed(() => {
  return props.property.photos?.[0]?.image?.url || '/placeholder-bathroom.jpg'
})

const formattedAddress = computed(() => {
  const loc = props.property.location
  if (!loc) return 'Address not available'
  return `${loc.city || ''}, ${loc.state || ''}`.trim().replace(/^,\s*/, '')
})

const pricePerHour = computed(() => {
  // Convert cents per minute to dollars per hour
  return ((props.property.pricePerMinute / 100) * 60).toFixed(2)
})

// Map amenity values to display labels
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

const displayAmenities = computed(() => {
  return props.property.amenities?.map(a => amenityLabels[a] || a) || []
})

// Extract plain text from Lexical rich text format
const extractTextFromLexical = (lexical: any): string => {
  if (!lexical) return ''
  if (typeof lexical === 'string') return lexical

  // Handle Lexical root structure
  if (lexical.root?.children) {
    return extractChildrenText(lexical.root.children)
  }

  return ''
}

const extractChildrenText = (children: any[]): string => {
  if (!Array.isArray(children)) return ''

  return children
    .map((child: any) => {
      // Text node
      if (child.text) return child.text
      // Node with children (paragraph, etc)
      if (child.children) return extractChildrenText(child.children)
      return ''
    })
    .join(' ')
    .trim()
}

const descriptionText = computed(() => {
  return extractTextFromLexical(props.property.description)
})

const handleClick = () => {
  navigateTo(`/bathrooms/${props.property.id}`)
}
</script>

<template>
  <Card
    class="cursor-pointer hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    @click="handleClick"
  >
    <div class="relative h-48 overflow-hidden bg-gray-200">
      <img
        :src="primaryImage"
        :alt="property.name"
        class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
      />
      <div
        v-if="property.type"
        class="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-medium shadow-sm capitalize"
      >
        {{ property.type }}
      </div>
    </div>

    <CardHeader class="pb-2">
      <CardTitle class="text-lg line-clamp-1">
        {{ property.name }}
      </CardTitle>

      <div class="flex items-center gap-1 text-sm text-gray-600">
        <MapPin class="w-4 h-4" />
        <span class="line-clamp-1">{{ formattedAddress }}</span>
      </div>
    </CardHeader>

    <CardContent>
      <p
        v-if="descriptionText"
        class="text-sm text-gray-600 line-clamp-2 mb-3"
      >
        {{ descriptionText }}
      </p>

      <div class="flex items-center justify-between mt-2">
        <div class="flex items-center gap-1">
          <DollarSign class="w-4 h-4 text-green-600" />
          <span class="text-lg font-semibold">
            {{ pricePerHour }}
          </span>
          <span class="text-sm text-gray-500">/hour</span>
        </div>

        <div
          v-if="property.stats?.averageRating"
          class="flex items-center gap-1"
        >
          <Star class="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span class="font-medium">{{ property.stats.averageRating.toFixed(1) }}</span>
          <span
            v-if="property.stats.reviewCount"
            class="text-sm text-gray-500"
          >
            ({{ property.stats.reviewCount }})
          </span>
        </div>
      </div>

      <div
        v-if="displayAmenities.length > 0"
        class="mt-3 flex flex-wrap gap-1"
      >
        <span
          v-for="amenity in displayAmenities.slice(0, 3)"
          :key="amenity"
          class="text-xs bg-gray-100 px-2 py-1 rounded-full"
        >
          {{ amenity }}
        </span>
        <span
          v-if="displayAmenities.length > 3"
          class="text-xs bg-gray-100 px-2 py-1 rounded-full"
        >
          +{{ displayAmenities.length - 3 }} more
        </span>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export interface FilterOptions {
  priceRange: {
    min: number
    max: number
  }
  propertyTypes: string[]
  amenities: string[]
  minRating: number
}

interface Props {
  filters: FilterOptions
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const emit = defineEmits<{
  'update:filters': [filters: FilterOptions]
  'close': []
}>()

// Local copy of filters
const localFilters = ref<FilterOptions>({ ...props.filters })

// Available options
const propertyTypeOptions = [
  'Residential',
  'Commercial',
  'Restaurant',
  'Hotel',
  'Gas Station',
  'Park',
]

const amenityOptions = [
  { label: 'Wheelchair Accessible', value: 'wheelchair' },
  { label: 'Baby Changing Station', value: 'baby_changing' },
  { label: 'Shower', value: 'shower' },
  { label: 'Bidet', value: 'bidet' },
  { label: 'Air Freshener', value: 'air_freshener' },
  { label: 'Hand Dryer', value: 'hand_dryer' },
  { label: 'Paper Towels', value: 'paper_towels' },
  { label: 'Feminine Products', value: 'feminine' },
  { label: 'Mirror', value: 'mirror' },
  { label: 'Climate Controlled', value: 'climate' },
  { label: 'Private', value: 'private' },
  { label: 'Gender Neutral', value: 'gender_neutral' },
]

// Handle property type toggle
const togglePropertyType = (type: string) => {
  const index = localFilters.value.propertyTypes.indexOf(type)
  if (index > -1) {
    localFilters.value.propertyTypes.splice(index, 1)
  } else {
    localFilters.value.propertyTypes.push(type)
  }
  emitFilters()
}

// Handle amenity toggle
const toggleAmenity = (amenityValue: string) => {
  const index = localFilters.value.amenities.indexOf(amenityValue)
  if (index > -1) {
    localFilters.value.amenities.splice(index, 1)
  } else {
    localFilters.value.amenities.push(amenityValue)
  }
  emitFilters()
}

// Handle price range change
const updatePriceMin = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  localFilters.value.priceRange.min = value
  if (localFilters.value.priceRange.max < value) {
    localFilters.value.priceRange.max = value
  }
  emitFilters()
}

const updatePriceMax = (event: Event) => {
  const value = parseInt((event.target as HTMLInputElement).value)
  localFilters.value.priceRange.max = value
  if (localFilters.value.priceRange.min > value) {
    localFilters.value.priceRange.min = value
  }
  emitFilters()
}

// Handle rating change
const updateRating = (event: Event) => {
  localFilters.value.minRating = parseInt((event.target as HTMLInputElement).value)
  emitFilters()
}

// Emit filter changes
const emitFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

// Reset filters
const resetFilters = () => {
  localFilters.value = {
    priceRange: { min: 0, max: 100 },
    propertyTypes: [],
    amenities: [],
    minRating: 0,
  }
  emitFilters()
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <Filter class="w-5 h-5" />
        <h2 class="text-lg font-semibold">Filters</h2>
      </div>

      <div class="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          @click="resetFilters"
        >
          Reset
        </Button>

        <button
          class="lg:hidden p-1 hover:bg-gray-100 rounded"
          @click="emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6">
      <!-- Price Range -->
      <div class="space-y-3">
        <Label class="text-base font-semibold">Price per hour</Label>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Min: ${{ localFilters.priceRange.min }}</span>
            <span class="text-gray-600">Max: ${{ localFilters.priceRange.max }}</span>
          </div>

          <div class="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              :value="localFilters.priceRange.min"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              @input="updatePriceMin"
            />

            <input
              type="range"
              min="0"
              max="100"
              :value="localFilters.priceRange.max"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              @input="updatePriceMax"
            />
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="space-y-3">
        <Label class="text-base font-semibold">Minimum Rating</Label>

        <div class="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            :value="localFilters.minRating"
            class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            @input="updateRating"
          />
          <span class="text-sm font-medium w-12 text-right">
            {{ localFilters.minRating }}+
          </span>
        </div>
      </div>

      <!-- Property Types -->
      <Accordion
        type="single"
        collapsible
        default-value="property-types"
      >
        <AccordionItem value="property-types">
          <AccordionTrigger class="text-base font-semibold">
            Property Type
            <span
              v-if="localFilters.propertyTypes.length > 0"
              class="ml-2 text-sm text-blue-600"
            >
              ({{ localFilters.propertyTypes.length }})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div class="space-y-2 pt-2">
              <label
                v-for="type in propertyTypeOptions"
                :key="type"
                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  :checked="localFilters.propertyTypes.includes(type)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  @change="togglePropertyType(type)"
                />
                <span class="text-sm">{{ type }}</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <!-- Amenities -->
      <Accordion
        type="single"
        collapsible
        default-value="amenities"
      >
        <AccordionItem value="amenities">
          <AccordionTrigger class="text-base font-semibold">
            Amenities
            <span
              v-if="localFilters.amenities.length > 0"
              class="ml-2 text-sm text-blue-600"
            >
              ({{ localFilters.amenities.length }})
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div class="space-y-2 pt-2">
              <label
                v-for="amenity in amenityOptions"
                :key="amenity.value"
                class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
              >
                <input
                  type="checkbox"
                  :checked="localFilters.amenities.includes(amenity.value)"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  @change="toggleAmenity(amenity.value)"
                />
                <span class="text-sm">{{ amenity.label }}</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>

    <!-- Footer (mobile only) -->
    <div class="lg:hidden border-t border-gray-200 p-4">
      <Button
        class="w-full"
        @click="emit('close')"
      >
        Apply Filters
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* Custom range slider styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #2563eb;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: #2563eb;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>

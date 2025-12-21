<script setup lang="ts">
interface Property {
  id: string | number
  name: string
  pricePerMinute: number
  photos?: Array<{ image: { url: string } }>
  location?: {
    address?: string
    city?: string
    state?: string
  }
  stats?: {
    averageRating?: number
    reviewCount?: number
  }
  type?: string
}

interface Props {
  property: Property | null
  position?: { x: number; y: number }
}

const props = defineProps<Props>()

const getFirstPhotoUrl = (property: Property) => {
  if (property.photos?.length && property.photos[0]?.image?.url) {
    return property.photos[0].image.url
  }
  return '/images/bathrooms/luxurybathroom1.jpg'
}

const formatPrice = (cents: number) => {
  return (cents / 100).toFixed(2)
}

const tooltipStyle = computed(() => {
  if (!props.position) return {}
  return {
    left: `${props.position.x}px`,
    top: `${props.position.y - 10}px`,
    transform: 'translate(-50%, -100%)',
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="property && position"
        class="fixed pointer-events-none z-[9999]"
        :style="tooltipStyle"
      >
        <!-- Tooltip content -->
        <div class="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100 min-w-[260px] max-w-[300px]">
          <!-- Image section -->
          <div class="relative h-28 overflow-hidden">
            <img
              :src="getFirstPhotoUrl(property)"
              :alt="property.name"
              class="w-full h-full object-cover"
            />
            <!-- Price badge -->
            <div class="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-md">
              <span class="text-lg font-bold text-gray-900">${{ formatPrice(property.pricePerMinute) }}</span>
              <span class="text-xs text-gray-600">/min</span>
            </div>
          </div>

          <!-- Content section -->
          <div class="p-3">
            <!-- Title and rating -->
            <div class="mb-2">
              <h3 class="font-semibold text-gray-900 text-sm line-clamp-1">
                {{ property.name }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <template v-if="property.stats?.averageRating">
                  <div class="flex items-center">
                    <svg class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    <span class="ml-1 text-sm font-medium">{{ property.stats.averageRating.toFixed(1) }}</span>
                    <span class="text-xs text-gray-500 ml-1">({{ property.stats.reviewCount || 0 }})</span>
                  </div>
                </template>
                <span v-else class="text-xs text-gray-500">No ratings yet</span>
              </div>
            </div>

            <!-- Location -->
            <div class="text-xs text-gray-600 mb-2 line-clamp-1">
              <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ property.location?.city }}, {{ property.location?.state }}
            </div>

            <!-- Quick hint -->
            <div class="flex gap-2">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                Click for details
              </span>
            </div>
          </div>
        </div>

        <!-- Arrow pointing down -->
        <div class="absolute left-1/2 transform -translate-x-1/2 -bottom-2">
          <div class="w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.tooltip-enter-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-leave-active {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%) translateY(8px) scale(0.95);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

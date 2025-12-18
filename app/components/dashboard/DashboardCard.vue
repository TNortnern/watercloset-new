<template>
  <div
    class="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 group"
  >
    <div class="flex items-start justify-between">
      <!-- Icon & Title Section -->
      <div class="flex-1">
        <div class="flex items-center space-x-3 mb-3">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
            :class="iconBackground"
          >
            <component :is="icon" class="w-6 h-6" :class="iconColor" />
          </div>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-slate-600">{{ title }}</h3>
          </div>
        </div>

        <!-- Value -->
        <div class="mb-2">
          <p class="text-3xl font-bold text-slate-900">
            {{ formattedValue }}
          </p>
        </div>

        <!-- Trend Indicator -->
        <div v-if="trend" class="flex items-center space-x-1">
          <div
            class="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold"
            :class="trendClasses"
          >
            <component :is="trendIcon" class="w-3 h-3" />
            <span>{{ Math.abs(trend.value) }}%</span>
          </div>
          <span class="text-xs text-slate-500">
            {{ trend.label || 'vs last month' }}
          </span>
        </div>
      </div>

      <!-- Optional Badge -->
      <div v-if="badge" class="flex-shrink-0">
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
          :class="badgeClasses"
        >
          {{ badge }}
        </span>
      </div>
    </div>

    <!-- Optional Footer Section -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'

interface Trend {
  value: number // percentage, positive or negative
  label?: string
}

interface Props {
  title: string
  value: string | number
  icon: any
  iconBackground?: string
  iconColor?: string
  trend?: Trend
  badge?: string
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  prefix?: string
  suffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconBackground: 'bg-gradient-to-br from-cyan-100 to-teal-100',
  iconColor: 'text-cyan-600',
  badgeVariant: 'default',
  prefix: '',
  suffix: '',
})

const formattedValue = computed(() => {
  return `${props.prefix}${props.value}${props.suffix}`
})

const trendIcon = computed(() => {
  if (!props.trend) return Minus
  if (props.trend.value > 0) return TrendingUp
  if (props.trend.value < 0) return TrendingDown
  return Minus
})

const trendClasses = computed(() => {
  if (!props.trend) return ''

  if (props.trend.value > 0) {
    return 'bg-green-100 text-green-700'
  } else if (props.trend.value < 0) {
    return 'bg-red-100 text-red-700'
  }
  return 'bg-slate-100 text-slate-600'
})

const badgeClasses = computed(() => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
  }
  return variants[props.badgeVariant]
})
</script>

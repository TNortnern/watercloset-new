<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg">
    <div class="grid grid-cols-4 h-16">
      <NuxtLink
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.href"
        class="flex flex-col items-center justify-center space-y-1 relative group transition-colors"
        :class="[
          isActive(item.href)
            ? 'text-cyan-600'
            : 'text-slate-500 hover:text-slate-700'
        ]"
      >
        <!-- Active indicator -->
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-b-full transition-all"
          :class="isActive(item.href) ? 'opacity-100' : 'opacity-0'"
        />

        <!-- Icon with badge -->
        <div class="relative">
          <component
            :is="item.icon"
            class="w-6 h-6 transition-transform group-active:scale-90"
            :class="[
              isActive(item.href)
                ? 'text-cyan-600'
                : 'text-slate-500'
            ]"
          />
          <!-- Badge indicator -->
          <span
            v-if="item.badge"
            class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {{ item.badge > 9 ? '9+' : item.badge }}
          </span>
        </div>

        <!-- Label -->
        <span
          class="text-xs font-medium transition-colors"
          :class="[
            isActive(item.href)
              ? 'text-cyan-600'
              : 'text-slate-500'
          ]"
        >
          {{ item.name }}
        </span>

        <!-- Touch feedback ripple -->
        <div
          class="absolute inset-0 bg-slate-100 opacity-0 group-active:opacity-100 transition-opacity"
        />
      </NuxtLink>
    </div>

    <!-- iOS safe area padding -->
    <div class="h-safe-bottom bg-white" />
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
}

interface Props {
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const route = useRoute()

const isActive = (href: string) => {
  return route.path === href || route.path.startsWith(href + '/')
}
</script>

<style scoped>
/* iOS safe area support */
.h-safe-bottom {
  height: env(safe-area-inset-bottom);
}

/* Prevent content from being hidden behind mobile nav */
@supports (padding: env(safe-area-inset-bottom)) {
  nav {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>

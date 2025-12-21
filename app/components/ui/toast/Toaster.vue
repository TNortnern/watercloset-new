<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { X } from 'lucide-vue-next'

const { toasts, toast: toastActions } = useToast()

const typeStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-x-4"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-4"
      >
        <div
          v-for="t in toasts"
          :key="t.id"
          class="pointer-events-auto rounded-lg border p-4 shadow-lg flex items-start gap-3"
          :class="typeStyles[t.type]"
          role="alert"
        >
          <component
            :is="t.icon"
            class="w-5 h-5 flex-shrink-0 mt-0.5"
            :class="iconStyles[t.type]"
          />
          <div class="flex-1 min-w-0">
            <p v-if="t.title" class="font-semibold text-sm">{{ t.title }}</p>
            <p class="text-sm" :class="{ 'mt-1': t.title }">{{ t.message }}</p>
          </div>
          <button
            @click="toastActions.dismiss(t.id)"
            class="flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

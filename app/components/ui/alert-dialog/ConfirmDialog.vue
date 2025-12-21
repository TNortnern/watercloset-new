<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm'
import { AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

const { confirmState, handleConfirm, handleCancel } = useConfirm()

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    handleCancel()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="confirmState.isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
        @click="handleBackdropClick"
        @keydown="handleKeydown"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="confirmState.isOpen"
            class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
            role="alertdialog"
            aria-modal="true"
            :aria-labelledby="confirmState.options.title ? 'confirm-title' : undefined"
            aria-describedby="confirm-message"
          >
            <!-- Header -->
            <div class="p-6">
              <div class="flex items-start gap-4">
                <div
                  v-if="confirmState.options.variant === 'destructive'"
                  class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
                >
                  <AlertTriangle class="w-6 h-6 text-red-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3
                    v-if="confirmState.options.title"
                    id="confirm-title"
                    class="text-lg font-semibold text-slate-900"
                  >
                    {{ confirmState.options.title }}
                  </h3>
                  <p
                    id="confirm-message"
                    class="text-sm text-slate-600"
                    :class="{ 'mt-2': confirmState.options.title }"
                  >
                    {{ confirmState.options.message }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                @click="handleCancel"
              >
                {{ confirmState.options.cancelText }}
              </Button>
              <Button
                :variant="confirmState.options.variant === 'destructive' ? 'destructive' : 'default'"
                :class="confirmState.options.variant !== 'destructive' ? 'bg-cyan-600 hover:bg-cyan-700' : ''"
                @click="handleConfirm"
              >
                {{ confirmState.options.confirmText }}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

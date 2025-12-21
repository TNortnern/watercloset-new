import { ref } from 'vue'

export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
}

const state = ref<ConfirmState>({
  isOpen: false,
  options: {
    title: 'Confirm',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'default',
  },
  resolve: null,
})

export function useConfirm() {
  const confirm = (messageOrOptions: string | ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const options: ConfirmOptions =
        typeof messageOrOptions === 'string'
          ? { message: messageOrOptions }
          : messageOrOptions

      state.value = {
        isOpen: true,
        options: {
          title: options.title ?? 'Confirm',
          message: options.message,
          confirmText: options.confirmText ?? 'Confirm',
          cancelText: options.cancelText ?? 'Cancel',
          variant: options.variant ?? 'default',
        },
        resolve,
      }
    })
  }

  const handleConfirm = () => {
    if (state.value.resolve) {
      state.value.resolve(true)
    }
    state.value.isOpen = false
    state.value.resolve = null
  }

  const handleCancel = () => {
    if (state.value.resolve) {
      state.value.resolve(false)
    }
    state.value.isOpen = false
    state.value.resolve = null
  }

  return {
    confirm,
    confirmState: state,
    handleConfirm,
    handleCancel,
  }
}

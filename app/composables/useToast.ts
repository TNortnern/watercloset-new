import { ref, markRaw, type Component } from 'vue'
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
  icon?: Component
}

const toasts = ref<Toast[]>([])

const iconMap: Record<Toast['type'], Component> = {
  success: markRaw(CheckCircle),
  error: markRaw(XCircle),
  warning: markRaw(AlertTriangle),
  info: markRaw(Info),
}

const defaultDurations: Record<Toast['type'], number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 4000,
}

function generateId() {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

function addToast(toast: Omit<Toast, 'id'>) {
  const id = generateId()
  const duration = toast.duration ?? defaultDurations[toast.type]

  const newToast: Toast = {
    ...toast,
    id,
    icon: toast.icon ?? iconMap[toast.type],
  }

  toasts.value.push(newToast)

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

function removeToast(id: string) {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

function clearToasts() {
  toasts.value = []
}

export function useToast() {
  const toast = {
    success: (message: string, title?: string, duration?: number) =>
      addToast({ type: 'success', message, title, duration }),

    error: (message: string, title?: string, duration?: number) =>
      addToast({ type: 'error', message, title, duration }),

    warning: (message: string, title?: string, duration?: number) =>
      addToast({ type: 'warning', message, title, duration }),

    info: (message: string, title?: string, duration?: number) =>
      addToast({ type: 'info', message, title, duration }),

    dismiss: removeToast,

    clear: clearToasts,
  }

  return {
    toast,
    toasts,
  }
}

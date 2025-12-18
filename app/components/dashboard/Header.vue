<template>
  <header class="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 shadow-sm">
    <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Left Section: Mobile Menu + Title/Search -->
      <div class="flex items-center space-x-4 flex-1">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="w-5 h-5 text-slate-600" />
        </button>

        <!-- Page Title Slot or Search Bar -->
        <div class="flex-1">
          <slot name="title">
            <!-- Default: Search Bar -->
            <div class="hidden sm:block max-w-md">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search..."
                  class="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-300 focus:ring-cyan-200 transition-colors"
                />
              </div>
            </div>
          </slot>
        </div>
      </div>

      <!-- Right Section: Actions -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <!-- Mobile Search Toggle -->
        <button
          class="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          @click="mobileSearchOpen = !mobileSearchOpen"
        >
          <Search class="w-5 h-5 text-slate-600" />
        </button>

        <!-- Notifications Dropdown -->
        <div class="relative">
          <button
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
            @click="notificationsOpen = !notificationsOpen"
          >
            <Bell class="w-5 h-5 text-slate-600" />
            <!-- Notification Badge -->
            <span
              v-if="unreadCount > 0"
              class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
            >
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </button>

          <!-- Notifications Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="notificationsOpen"
              v-click-outside="() => notificationsOpen = false"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <!-- Header -->
              <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 class="text-sm font-semibold text-slate-900">Notifications</h3>
                <button
                  class="text-xs text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                  @click="markAllRead"
                >
                  Mark all read
                </button>
              </div>

              <!-- Notifications List -->
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0"
                  :class="{ 'bg-cyan-50/30': !notification.read }"
                  @click="handleNotificationClick(notification)"
                >
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="notification.iconBg"
                    >
                      <component :is="notification.icon" class="w-4 h-4" :class="notification.iconColor" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-slate-900 leading-snug">{{ notification.message }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ notification.time }}</p>
                    </div>
                    <div
                      v-if="!notification.read"
                      class="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0 mt-2"
                    />
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-if="notifications.length === 0"
                  class="px-4 py-12 text-center"
                >
                  <BellOff class="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p class="text-sm text-slate-500">No notifications yet</p>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button
                  class="text-sm text-cyan-600 hover:text-cyan-700 font-medium w-full text-center transition-colors"
                  @click="viewAllNotifications"
                >
                  View all notifications
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- User Menu Dropdown -->
        <div class="relative">
          <button
            class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            @click="userMenuOpen = !userMenuOpen"
          >
            <div
              v-if="user.avatar"
              class="w-8 h-8 rounded-full overflow-hidden"
            >
              <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm"
            >
              {{ user.initials }}
            </div>
            <ChevronDown class="w-4 h-4 text-slate-600 hidden sm:block" />
          </button>

          <!-- User Dropdown Menu -->
          <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="userMenuOpen"
              v-click-outside="() => userMenuOpen = false"
              class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <p class="text-sm font-semibold text-slate-900 truncate">{{ user.name }}</p>
                <p class="text-xs text-slate-500 mt-0.5 truncate">{{ user.email }}</p>
                <span
                  v-if="user.role"
                  class="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700"
                >
                  {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                </span>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <NuxtLink
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.href"
                  class="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  @click="userMenuOpen = false"
                >
                  <component :is="item.icon" class="w-4 h-4 text-slate-400" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </div>

              <!-- Sign Out -->
              <div class="border-t border-slate-200">
                <button
                  class="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  @click="handleSignOut"
                >
                  <LogOut class="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Mobile Search Bar (expanded) -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileSearchOpen" class="sm:hidden px-4 pb-3 border-t border-slate-200">
        <div class="relative mt-3">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-300 focus:ring-cyan-200"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Menu,
  Search,
  Bell,
  BellOff,
  ChevronDown,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

interface UserInfo {
  name: string
  email: string
  avatar?: string
  initials: string
  role?: string
}

interface Props {
  user: UserInfo
}

defineProps<Props>()

const emit = defineEmits<{
  'toggle-sidebar': []
  logout: []
}>()

const searchQuery = ref('')
const notificationsOpen = ref(false)
const userMenuOpen = ref(false)
const mobileSearchOpen = ref(false)

const unreadCount = ref(3)

const notifications = ref([
  {
    id: 1,
    message: 'New booking request for Premium Suite',
    time: '5 minutes ago',
    read: false,
    icon: Calendar,
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600'
  },
  {
    id: 2,
    message: 'You have a new message from Sarah',
    time: '1 hour ago',
    read: false,
    icon: MessageSquare,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    message: 'Your listing "Executive Washroom" was approved',
    time: '2 hours ago',
    read: false,
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    id: 4,
    message: 'Payment received: $50.00',
    time: '1 day ago',
    read: true,
    icon: CreditCard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
])

const userMenuItems = [
  { name: 'Your Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Help & Support', href: '/help', icon: HelpCircle },
]

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
  unreadCount.value = 0
}

const handleNotificationClick = (notification: any) => {
  notification.read = true
  unreadCount.value = Math.max(0, unreadCount.value - 1)
  notificationsOpen.value = false
  // Add navigation logic based on notification type
}

const viewAllNotifications = () => {
  notificationsOpen.value = false
  navigateTo('/dashboard/notifications')
}

const handleSignOut = () => {
  userMenuOpen.value = false
  emit('logout')
}

// Click outside directive (composable)
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  },
}
</script>

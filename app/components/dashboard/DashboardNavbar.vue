<template>
  <header class="sticky top-0 z-30 bg-white border-b border-slate-200 h-16">
    <div class="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Left Section: Mobile Menu + Search -->
      <div class="flex items-center space-x-4 flex-1">
        <!-- Mobile Menu Toggle -->
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          @click="$emit('toggle-sidebar')"
        >
          <Menu class="w-5 h-5 text-slate-600" />
        </button>

        <!-- Search Bar -->
        <div class="hidden sm:block flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Search bathrooms, bookings..."
              class="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-300 focus:ring-cyan-200 transition-colors"
            />
          </div>
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
            @click.stop="notificationsOpen = !notificationsOpen"
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
              class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
            >
              <!-- Header -->
              <div class="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-slate-900">Notifications</h3>
                <button class="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                  Mark all read
                </button>
              </div>

              <!-- Notifications List -->
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-b-0"
                  :class="{ 'bg-cyan-50/50': !notification.read }"
                >
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      :class="notification.iconBg"
                    >
                      <component :is="notification.icon" class="w-4 h-4" :class="notification.iconColor" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-slate-900">{{ notification.message }}</p>
                      <p class="text-xs text-slate-500 mt-1">{{ notification.time }}</p>
                    </div>
                    <div v-if="!notification.read" class="w-2 h-2 bg-cyan-600 rounded-full flex-shrink-0 mt-2"></div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <button class="text-sm text-cyan-600 hover:text-cyan-700 font-medium w-full text-center">
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
            @click.stop="userMenuOpen = !userMenuOpen"
          >
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
              {{ userInitials }}
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
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-slate-200">
                <p class="text-sm font-semibold text-slate-900">{{ displayName }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ user?.email }}</p>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <NuxtLink
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.href"
                  class="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
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
            placeholder="Search bathrooms, bookings..."
            class="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-300 focus:ring-cyan-200"
          />
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu, Search, Bell, ChevronDown, User, Settings, CreditCard, HelpCircle, LogOut, Calendar, MessageSquare } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'

defineEmits<{
  'toggle-sidebar': []
}>()

const { user, userInitials, displayName, logout } = useAuth()

const searchQuery = ref('')
const notificationsOpen = ref(false)
const userMenuOpen = ref(false)
const mobileSearchOpen = ref(false)

// TODO: Fetch real notifications from API
const unreadCount = ref(0)
const notifications = ref<any[]>([])

const userMenuItems = [
  { name: 'Your Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
  { name: 'Billing', href: '/manage/earnings', icon: CreditCard },
  { name: 'Help & Support', href: '/contact', icon: HelpCircle },
]

const handleSignOut = async () => {
  userMenuOpen.value = false
  await logout()
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

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop Sidebar -->
    <DashboardSidebar
      :is-open="sidebarOpen"
      :is-collapsed="sidebarCollapsed"
      :navigation-items="navigationItems"
      :user="user"
      @close="sidebarOpen = false"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      @logout="handleLogout"
    />

    <!-- Main Content Area -->
    <div
      class="flex flex-col min-h-screen transition-all duration-300"
      :class="[
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64',
        'pb-16 lg:pb-0'
      ]"
    >
      <!-- Top Header -->
      <DashboardHeader
        :user="user"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @logout="handleLogout"
      >
        <template #title>
          <slot name="header-title" />
        </template>
      </DashboardHeader>

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Mobile Bottom Navigation -->
    <DashboardMobileNav
      :navigation-items="mobileNavigationItems"
      class="lg:hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Home,
  Calendar,
  Heart,
  User,
  Settings,
  MapPin
} from 'lucide-vue-next'
import DashboardSidebar from '@/components/dashboard/Sidebar.vue'
import DashboardHeader from '@/components/dashboard/Header.vue'
import DashboardMobileNav from '@/components/dashboard/MobileNav.vue'

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

// Get real user from auth
const { user: authUser, userInitials, displayName, logout } = useAuth()

// Format user for Header/Sidebar components
const user = computed(() => ({
  name: displayName.value,
  email: authUser.value?.email || '',
  initials: userInitials.value,
  role: authUser.value?.role || 'user',
  avatar: authUser.value?.avatar?.url
}))

// Count favorites from user data
const favoritesCount = computed(() => {
  if (!authUser.value?.favorites) return 0
  return Array.isArray(authUser.value.favorites) ? authUser.value.favorites.length : 0
})

// User dashboard navigation - badges computed from real data
const navigationItems = computed(() => [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart, badge: favoritesCount.value || undefined },
  { name: 'Find Bathroom', href: '/search', icon: MapPin },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
])

// Mobile navigation shows only main items
const mobileNavigationItems = computed(() => {
  return navigationItems.value.filter(item =>
    ['Dashboard', 'My Bookings', 'Favorites', 'Find Bathroom'].includes(item.name)
  )
})

const handleLogout = async () => {
  await logout()
}
</script>

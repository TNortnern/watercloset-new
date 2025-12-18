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

// Mock user - replace with real auth
const user = {
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  initials: 'SJ',
  role: 'user' as const
}

// User dashboard navigation
const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: Calendar, badge: 3 },
  { name: 'Favorites', href: '/dashboard/favorites', icon: Heart, badge: 8 },
  { name: 'Find Bathroom', href: '/search', icon: MapPin },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

// Mobile navigation shows only main items
const mobileNavigationItems = computed(() => {
  return navigationItems.filter(item =>
    ['Dashboard', 'My Bookings', 'Favorites', 'Find Bathroom'].includes(item.name)
  )
})

const handleLogout = () => {
  navigateTo('/login')
}
</script>

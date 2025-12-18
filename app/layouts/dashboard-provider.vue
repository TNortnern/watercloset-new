<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop Sidebar -->
    <DashboardSidebar
      :is-open="sidebarOpen"
      :is-collapsed="sidebarCollapsed"
      :navigation-items="navigationItems"
      :user="user"
      brand-name="Provider Portal"
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
  LayoutDashboard,
  Building2,
  Calendar,
  DollarSign,
  Star,
  Settings,
  Plus
} from 'lucide-vue-next'
import DashboardSidebar from '@/components/dashboard/Sidebar.vue'
import DashboardHeader from '@/components/dashboard/Header.vue'
import DashboardMobileNav from '@/components/dashboard/MobileNav.vue'

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

// Mock provider user - replace with real auth
const user = {
  name: 'Michael Chen',
  email: 'michael@provider.com',
  initials: 'MC',
  role: 'provider' as const
}

// Provider dashboard navigation
const navigationItems = [
  { name: 'Dashboard', href: '/manage', icon: LayoutDashboard },
  { name: 'My Properties', href: '/manage/properties', icon: Building2, badge: 8 },
  { name: 'Bookings', href: '/manage/bookings', icon: Calendar, badge: 5 },
  { name: 'Earnings', href: '/manage/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/manage/reviews', icon: Star, badge: 3 },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
]

// Mobile navigation shows only main items
const mobileNavigationItems = computed(() => {
  return navigationItems.filter(item =>
    ['Dashboard', 'My Properties', 'Bookings', 'Earnings'].includes(item.name)
  )
})

const handleLogout = () => {
  navigateTo('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Desktop Sidebar -->
    <DashboardSidebar
      :is-open="sidebarOpen"
      :is-collapsed="sidebarCollapsed"
      :navigation-items="navigationItems"
      :user="user"
      brand-name="Admin Panel"
      brand-color="red"
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
  Users,
  Building2,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  AlertTriangle,
  CreditCard
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
  role: authUser.value?.role || 'admin',
  avatar: authUser.value?.avatar?.url
}))

// Platform admin dashboard navigation
const navigationItems = [
  { name: 'Dashboard', href: '/platform', icon: LayoutDashboard },
  { name: 'Users', href: '/platform/users', icon: Users, badge: 12 },
  { name: 'Properties', href: '/platform/properties', icon: Building2, badge: 5 },
  { name: 'Bookings', href: '/platform/bookings', icon: Calendar },
  { name: 'Provider Requests', href: '/platform/provider-requests', icon: Shield, badge: 8 },
  { name: 'Refund Requests', href: '/platform/refund-requests', icon: CreditCard, badge: 3 },
  { name: 'Analytics', href: '/platform/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/platform/settings', icon: Settings },
]

// Mobile navigation shows only main items
const mobileNavigationItems = computed(() => {
  return navigationItems.filter(item =>
    ['Dashboard', 'Users', 'Properties', 'Bookings'].includes(item.name)
  )
})

const handleLogout = async () => {
  await logout()
}
</script>

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
  MessageSquare,
  User,
  Settings,
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Star,
  ShieldCheck
} from 'lucide-vue-next'
import DashboardSidebar from '@/components/dashboard/Sidebar.vue'
import DashboardHeader from '@/components/dashboard/Header.vue'
import DashboardMobileNav from '@/components/dashboard/MobileNav.vue'

export interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
}

export interface UserInfo {
  name: string
  email: string
  avatar?: string
  initials: string
  role?: 'user' | 'provider' | 'admin'
}

interface Props {
  navigationItems?: NavigationItem[]
  user?: UserInfo
}

const props = withDefaults(defineProps<Props>(), {
  navigationItems: () => [],
})

// Get real user from auth if not provided as prop
const { user: authUser, userInitials, displayName, logout } = useAuth()

const user = computed(() => props.user || {
  name: displayName.value,
  email: authUser.value?.email || '',
  initials: userInitials.value,
  role: authUser.value?.role || 'user',
  avatar: authUser.value?.avatar?.url
})

const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

// Default navigation items for user dashboard
const defaultNavigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar, badge: 3 },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 5 },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

// Use provided navigation items or default ones
const navigationItems = computed(() => {
  return props.navigationItems.length > 0 ? props.navigationItems : defaultNavigationItems
})

// Mobile navigation shows only main items (without settings)
const mobileNavigationItems = computed(() => {
  return navigationItems.value.filter(item =>
    !['Settings'].includes(item.name)
  ).slice(0, 4) // Show max 4 items on mobile bottom nav
})

const handleLogout = async () => {
  await logout()
}
</script>

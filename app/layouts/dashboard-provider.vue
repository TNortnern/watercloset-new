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

// Get real user from auth
const { user: authUser, userInitials, displayName, logout } = useAuth()
const payload = usePayload()

// Fetch real counts for badges
const { data: counts } = await useAsyncData('dashboard-counts', async () => {
  if (!authUser.value?.id) return { properties: 0, bookings: 0, reviews: 0 }

  try {
    // Fetch properties count
    const propertiesRes = await payload.find('properties', {
      where: { owner: { equals: authUser.value.id } },
      limit: 0, // Just get count
    })

    // Fetch pending/upcoming bookings count
    const bookingsRes = await payload.find('bookings', {
      where: {
        'property.owner': { equals: authUser.value.id },
        status: { in: ['pending', 'confirmed'] },
      },
      limit: 0,
    })

    // Fetch unread reviews count (reviews from last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const propertyIds = propertiesRes.docs?.map((p: any) => p.id) || []

    let reviewCount = 0
    if (propertyIds.length > 0) {
      const reviewsRes = await payload.find('reviews', {
        where: {
          property: { in: propertyIds },
          createdAt: { greater_than: weekAgo.toISOString() },
        },
        limit: 0,
      })
      reviewCount = reviewsRes.totalDocs || 0
    }

    return {
      properties: propertiesRes.totalDocs || 0,
      bookings: bookingsRes.totalDocs || 0,
      reviews: reviewCount,
    }
  } catch (error) {
    console.error('Failed to fetch dashboard counts:', error)
    return { properties: 0, bookings: 0, reviews: 0 }
  }
}, { watch: [() => authUser.value?.id] })

// Format user for Header/Sidebar components
const user = computed(() => ({
  name: displayName.value,
  email: authUser.value?.email || '',
  initials: userInitials.value,
  role: authUser.value?.role || 'provider',
  avatar: authUser.value?.avatar?.url
}))

// Provider dashboard navigation with real counts
const navigationItems = computed(() => [
  { name: 'Dashboard', href: '/manage', icon: LayoutDashboard },
  { name: 'My Properties', href: '/manage/properties', icon: Building2, badge: counts.value?.properties || undefined },
  { name: 'Bookings', href: '/manage/bookings', icon: Calendar, badge: counts.value?.bookings || undefined },
  { name: 'Earnings', href: '/manage/earnings', icon: DollarSign },
  { name: 'Reviews', href: '/manage/reviews', icon: Star, badge: counts.value?.reviews || undefined },
  { name: 'Settings', href: '/manage/settings', icon: Settings },
])

// Mobile navigation shows only main items
const mobileNavigationItems = computed(() => {
  return navigationItems.value.filter(item =>
    ['Dashboard', 'My Properties', 'Bookings', 'Earnings'].includes(item.name)
  )
})

const handleLogout = async () => {
  await logout()
}
</script>

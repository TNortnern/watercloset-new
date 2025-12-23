<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard Example</h1>
      <p class="mt-2 text-slate-600">
        This is an example of an admin dashboard with administrative navigation items.
      </p>
    </div>

    <!-- Admin Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Users</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">1,248</p>
              <p class="mt-1 text-xs text-green-600">+12% this month</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <Users class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Providers</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">342</p>
              <p class="mt-1 text-xs text-green-600">+8% this month</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <Building2 class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Bookings</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">8,456</p>
              <p class="mt-1 text-xs text-green-600">+18% this month</p>
            </div>
            <div class="p-3 bg-cyan-100 rounded-lg">
              <Calendar class="w-6 h-6 text-cyan-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Revenue</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">$42.5K</p>
              <p class="mt-1 text-xs text-green-600">+22% this month</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <DollarSign class="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Recent Activity Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Pending Provider Requests -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Pending Provider Requests</CardTitle>
              <CardDescription>New provider applications awaiting review</CardDescription>
            </div>
            <span class="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
              {{ pendingRequests.length }} New
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="request in pendingRequests"
              :key="request.id"
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                  {{ request.initials }}
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900">{{ request.name }}</p>
                  <p class="text-xs text-slate-500">{{ request.location }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Recent Refund Requests -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Refund Requests</CardTitle>
              <CardDescription>Customer refund requests to review</CardDescription>
            </div>
            <span class="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
              {{ refundRequests.length }} Pending
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="refund in refundRequests"
              :key="refund.id"
              class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div class="flex-1">
                <p class="text-sm font-medium text-slate-900">{{ refund.user }}</p>
                <p class="text-xs text-slate-500">Booking #{{ refund.bookingId }}</p>
                <p class="text-xs text-red-600 mt-1">Amount: ${{ refund.amount }}</p>
              </div>
              <div class="flex gap-2">
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- System Stats -->
    <Card>
      <CardHeader>
        <CardTitle>System Statistics</CardTitle>
        <CardDescription>Platform performance and usage metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-3 bg-cyan-100 rounded-lg">
              <ShieldCheck class="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-600">Verified Providers</p>
              <p class="text-2xl font-bold text-slate-900">89%</p>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-3 bg-green-100 rounded-lg">
              <Star class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-600">Avg. Rating</p>
              <p class="text-2xl font-bold text-slate-900">4.6</p>
            </div>
          </div>

          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-3 bg-purple-100 rounded-lg">
              <AlertCircle class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-600">Open Reports</p>
              <p class="text-2xl font-bold text-slate-900">12</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  ShieldCheck,
  Star,
  AlertCircle
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// Define custom navigation for admin
const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/platform/users', icon: Users },
  { name: 'Providers', href: '/platform/providers', icon: Building2, badge: 5 },
  { name: 'Bookings', href: '/platform/bookings', icon: Calendar },
  { name: 'Refunds', href: '/platform/refunds', icon: DollarSign, badge: 3 },
  { name: 'Reports', href: '/platform/reports', icon: FileText, badge: 12 },
  { name: 'Settings', href: '/platform/settings', icon: Settings },
]

definePageMeta({
  layout: 'dashboard',
  middleware: 'admin', // Would check if user is admin
})

const pendingRequests = ref([
  {
    id: 1,
    name: 'Maria Garcia',
    initials: 'MG',
    location: 'Brooklyn, NY',
    date: '2 hours ago'
  },
  {
    id: 2,
    name: 'James Wilson',
    initials: 'JW',
    location: 'Manhattan, NY',
    date: '5 hours ago'
  },
  {
    id: 3,
    name: 'Lisa Chen',
    initials: 'LC',
    location: 'Queens, NY',
    date: '1 day ago'
  },
])

const refundRequests = ref([
  {
    id: 1,
    user: 'John Smith',
    bookingId: '12345',
    amount: 15,
    reason: 'Property not as described'
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    bookingId: '12346',
    amount: 25,
    reason: 'Booking canceled by provider'
  },
  {
    id: 3,
    user: 'Mike Brown',
    bookingId: '12347',
    amount: 10,
    reason: 'Facility was closed'
  },
])
</script>

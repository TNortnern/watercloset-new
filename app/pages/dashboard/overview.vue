<template>
  <NuxtLayout name="dashboard">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
      <p class="text-slate-600">Welcome back! Here's what's happening with your bathrooms today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <DashboardCard
        title="Total Bookings"
        :value="127"
        :icon="Calendar"
        :trend="{ value: 12.5, label: 'vs last month' }"
      />

      <DashboardCard
        title="Active Listings"
        :value="8"
        :icon="Building2"
        :trend="{ value: 0, label: 'no change' }"
        badge="Live"
        badge-variant="success"
      />

      <DashboardCard
        title="Revenue"
        :value="3420"
        prefix="$"
        :icon="DollarSign"
        icon-background="bg-gradient-to-br from-green-100 to-emerald-100"
        icon-color="text-green-600"
        :trend="{ value: 23.1, label: 'vs last month' }"
      />

      <DashboardCard
        title="Avg Rating"
        :value="4.8"
        suffix="/5"
        :icon="Star"
        icon-background="bg-gradient-to-br from-yellow-100 to-amber-100"
        icon-color="text-yellow-600"
        :trend="{ value: 8.2, label: 'vs last month' }"
      />
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Bookings -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Recent Bookings</h2>
            <Button variant="ghost" size="sm" class="text-cyan-600 hover:text-cyan-700">
              View all
            </Button>
          </div>
          <div class="divide-y divide-slate-100">
            <div
              v-for="booking in recentBookings"
              :key="booking.id"
              class="px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold">
                    {{ booking.initials }}
                  </div>
                  <div>
                    <p class="font-medium text-slate-900">{{ booking.bathroom }}</p>
                    <p class="text-sm text-slate-500">{{ booking.guest }} • {{ booking.date }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-slate-900">{{ booking.amount }}</p>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="booking.statusClass"
                  >
                    {{ booking.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-slate-200 p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <Button class="w-full justify-start bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
              <Plus class="w-4 h-4 mr-2" />
              Add New Listing
            </Button>
            <Button variant="outline" class="w-full justify-start border-slate-300">
              <Calendar class="w-4 h-4 mr-2" />
              Manage Calendar
            </Button>
            <Button variant="outline" class="w-full justify-start border-slate-300">
              <MessageSquare class="w-4 h-4 mr-2" />
              View Messages
            </Button>
          </div>
        </div>

        <!-- Performance Card -->
        <div class="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-6 text-white">
          <div class="flex items-center space-x-2 mb-3">
            <TrendingUp class="w-5 h-5" />
            <h3 class="font-semibold">Performance</h3>
          </div>
          <p class="text-2xl font-bold mb-2">Top 10%</p>
          <p class="text-cyan-100 text-sm">
            You're performing better than 90% of hosts in your area!
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Calendar, Building2, DollarSign, Star, Plus, MessageSquare, TrendingUp } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DashboardCard from '@/components/dashboard/DashboardCard.vue'

const recentBookings = [
  {
    id: 1,
    bathroom: 'Premium Suite',
    guest: 'Sarah Johnson',
    initials: 'SJ',
    date: 'Dec 18, 2025',
    amount: '$45.00',
    status: 'Confirmed',
    statusClass: 'bg-green-100 text-green-700',
  },
  {
    id: 2,
    bathroom: 'Executive Washroom',
    guest: 'Mike Chen',
    initials: 'MC',
    date: 'Dec 17, 2025',
    amount: '$35.00',
    status: 'Pending',
    statusClass: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 3,
    bathroom: 'Deluxe Bathroom',
    guest: 'Emma Wilson',
    initials: 'EW',
    date: 'Dec 16, 2025',
    amount: '$50.00',
    status: 'Completed',
    statusClass: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 4,
    bathroom: 'Standard Suite',
    guest: 'James Brown',
    initials: 'JB',
    date: 'Dec 15, 2025',
    amount: '$30.00',
    status: 'Completed',
    statusClass: 'bg-cyan-100 text-cyan-700',
  },
]
</script>

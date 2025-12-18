<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">User Dashboard Example</h1>
      <p class="mt-2 text-slate-600">
        This is an example of a user dashboard using the shared dashboard layout.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Bookings</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">24</p>
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
              <p class="text-sm font-medium text-slate-600">Favorites</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">8</p>
            </div>
            <div class="p-3 bg-pink-100 rounded-lg">
              <Heart class="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Upcoming</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">3</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <Clock class="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Reviews</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">18</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <Star class="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Content Card -->
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest bookings and interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-2 bg-cyan-100 rounded-lg">
              <Calendar class="w-5 h-5 text-cyan-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900">Booking confirmed</p>
              <p class="text-xs text-slate-500">Luxury Downtown Restroom - Dec 18, 2025</p>
            </div>
            <span class="text-xs text-slate-500">2h ago</span>
          </div>

          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-2 bg-purple-100 rounded-lg">
              <MessageSquare class="w-5 h-5 text-purple-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900">New message received</p>
              <p class="text-xs text-slate-500">From property owner</p>
            </div>
            <span class="text-xs text-slate-500">5h ago</span>
          </div>

          <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <Star class="w-5 h-5 text-yellow-600" />
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-slate-900">Review posted</p>
              <p class="text-xs text-slate-500">You gave 5 stars to Cozy Cafe Bathroom</p>
            </div>
            <span class="text-xs text-slate-500">1d ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Home, Calendar, MessageSquare, User, Settings, Heart, Clock, Star } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

definePageMeta({
  layout: 'dashboard',
})
</script>

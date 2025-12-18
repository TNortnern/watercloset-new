<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Platform Analytics</h1>
        <p class="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
      </div>
      <div class="flex items-center space-x-3">
        <select
          v-model="timeRange"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button @click="console.log('Export analytics report for period:', timeRange)" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          <Download class="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-blue-50 rounded-lg">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <span class="text-xs font-medium text-green-600">+12.5%</span>
        </div>
        <h3 class="text-sm font-medium text-gray-600">New Users</h3>
        <p class="text-2xl font-bold text-gray-900 mt-2">1,247</p>
        <p class="text-xs text-gray-500 mt-2">vs. previous period</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-purple-50 rounded-lg">
            <Building2 class="w-6 h-6 text-purple-600" />
          </div>
          <span class="text-xs font-medium text-green-600">+8.3%</span>
        </div>
        <h3 class="text-sm font-medium text-gray-600">New Properties</h3>
        <p class="text-2xl font-bold text-gray-900 mt-2">87</p>
        <p class="text-xs text-gray-500 mt-2">vs. previous period</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-50 rounded-lg">
            <Calendar class="w-6 h-6 text-green-600" />
          </div>
          <span class="text-xs font-medium text-green-600">+24.1%</span>
        </div>
        <h3 class="text-sm font-medium text-gray-600">Total Bookings</h3>
        <p class="text-2xl font-bold text-gray-900 mt-2">3,542</p>
        <p class="text-xs text-gray-500 mt-2">vs. previous period</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-emerald-50 rounded-lg">
            <DollarSign class="w-6 h-6 text-emerald-600" />
          </div>
          <span class="text-xs font-medium text-green-600">+18.7%</span>
        </div>
        <h3 class="text-sm font-medium text-gray-600">Revenue</h3>
        <p class="text-2xl font-bold text-gray-900 mt-2">$87,340</p>
        <p class="text-xs text-gray-500 mt-2">vs. previous period</p>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Revenue Trend</h3>
          <select class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <div class="h-80 bg-gradient-to-br from-emerald-50 to-green-100 rounded-lg flex items-center justify-center border-2 border-dashed border-emerald-300">
          <div class="text-center">
            <TrendingUp class="w-16 h-16 text-emerald-400 mx-auto mb-3" />
            <p class="text-sm text-emerald-600 font-medium">Revenue Line Chart</p>
            <p class="text-xs text-emerald-500 mt-1">Monthly revenue growth visualization</p>
          </div>
        </div>
      </div>

      <!-- User Growth Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">User Growth</h3>
          <select class="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Daily</option>
          </select>
        </div>
        <div class="h-80 bg-gradient-to-br from-blue-50 to-cyan-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
          <div class="text-center">
            <Users class="w-16 h-16 text-blue-400 mx-auto mb-3" />
            <p class="text-sm text-blue-600 font-medium">User Growth Chart</p>
            <p class="text-xs text-blue-500 mt-1">New user registrations over time</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Trends -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Booking Trends</h3>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Hourly</button>
          <button class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">Daily</button>
          <button class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">Weekly</button>
        </div>
      </div>
      <div class="h-96 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-300">
        <div class="text-center">
          <BarChart3 class="w-16 h-16 text-purple-400 mx-auto mb-3" />
          <p class="text-sm text-purple-600 font-medium">Booking Trends Bar Chart</p>
          <p class="text-xs text-purple-500 mt-1">Peak booking times and patterns</p>
        </div>
      </div>
    </div>

    <!-- Top Properties & Geographic Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Properties -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Top Performing Properties</h3>
        <div class="space-y-4">
          <div v-for="property in topProperties" :key="property.id" class="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div class="flex items-center space-x-3 flex-1">
              <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <Building2 class="w-6 h-6 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ property.name }}</p>
                <p class="text-xs text-gray-500">{{ property.location }}</p>
              </div>
            </div>
            <div class="text-right ml-4">
              <p class="text-sm font-bold text-gray-900">${{ property.revenue.toLocaleString() }}</p>
              <div class="flex items-center justify-end mt-1">
                <Star class="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                <span class="text-xs text-gray-600">{{ property.rating }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Geographic Distribution -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div class="h-80 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-indigo-300 mb-4">
          <div class="text-center">
            <MapPin class="w-16 h-16 text-indigo-400 mx-auto mb-3" />
            <p class="text-sm text-indigo-600 font-medium">Geographic Map</p>
            <p class="text-xs text-indigo-500 mt-1">Property and user distribution by location</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="city in topCities" :key="city.name" class="flex items-center justify-between">
            <span class="text-sm text-gray-700">{{ city.name }}</span>
            <div class="flex items-center space-x-2">
              <div class="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-600 rounded-full" :style="{ width: `${city.percentage}%` }"></div>
              </div>
              <span class="text-xs font-medium text-gray-600">{{ city.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Metrics Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">Avg. Booking Value</span>
            <TrendingUp class="w-4 h-4 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900">$24.67</p>
          <p class="text-xs text-green-600 mt-1">+5.2% from last period</p>
        </div>
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">Conversion Rate</span>
            <TrendingUp class="w-4 h-4 text-green-600" />
          </div>
          <p class="text-2xl font-bold text-gray-900">68.4%</p>
          <p class="text-xs text-green-600 mt-1">+2.1% from last period</p>
        </div>
        <div class="border border-gray-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-600">Avg. Rating</span>
            <Star class="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
          <p class="text-2xl font-bold text-gray-900">4.7/5</p>
          <p class="text-xs text-green-600 mt-1">+0.3 from last period</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Users, Building2, Calendar, DollarSign, TrendingUp, BarChart3, Star, MapPin, Download } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const timeRange = ref('30d')

const topProperties = [
  {
    id: 1,
    name: 'Premium Suite',
    location: 'Downtown Plaza, NYC',
    revenue: 15390,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Deluxe Bathroom',
    location: 'Financial District, SF',
    revenue: 14250,
    rating: 4.9
  },
  {
    id: 3,
    name: 'VIP Lounge',
    location: 'Downtown, Seattle',
    revenue: 12840,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Executive Lounge',
    location: 'City Center, LA',
    revenue: 11560,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Modern Restroom',
    location: 'Capitol Hill, Denver',
    revenue: 9870,
    rating: 4.5
  }
]

const topCities = [
  { name: 'New York', percentage: 28 },
  { name: 'Los Angeles', percentage: 22 },
  { name: 'San Francisco', percentage: 18 },
  { name: 'Seattle', percentage: 15 },
  { name: 'Chicago', percentage: 10 },
  { name: 'Denver', percentage: 7 }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Management</h1>
        <p class="text-gray-600 mt-1">Manage all platform users and roles</p>
      </div>
      <button class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Users class="w-5 h-5" />
        <span>Add User</span>
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name or email..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Role Filter -->
        <div class="flex items-center space-x-2">
          <button
            v-for="role in roles"
            :key="role.value"
            @click="selectedRole = role.value"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedRole === role.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ role.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {{ user.initials }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.role === 'admin' && 'bg-red-100 text-red-800',
                  user.role === 'provider' && 'bg-purple-100 text-purple-800',
                  user.role === 'user' && 'bg-blue-100 text-blue-800'
                ]">
                  {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.joinedDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                  user.status === 'active' && 'bg-green-100 text-green-800',
                  user.status === 'suspended' && 'bg-red-100 text-red-800'
                ]">
                  {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex items-center justify-end space-x-2">
                  <button class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                    <Eye class="w-4 h-4" />
                  </button>
                  <button class="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit Role">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      user.status === 'active'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    ]"
                    :title="user.status === 'active' ? 'Suspend' : 'Activate'"
                  >
                    <Ban v-if="user.status === 'active'" class="w-4 h-4" />
                    <Check v-else class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">1</span> to <span class="font-medium">10</span> of <span class="font-medium">{{ users.length }}</span> results
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">1</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
          <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
          <button class="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Users, Search, Eye, Edit, Ban, Check, ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const searchQuery = ref('')
const selectedRole = ref('all')

const roles = [
  { label: 'All', value: 'all' },
  { label: 'Users', value: 'user' },
  { label: 'Providers', value: 'provider' },
  { label: 'Admins', value: 'admin' }
]

const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    initials: 'SJ',
    email: 'sarah.johnson@example.com',
    role: 'user',
    joinedDate: 'Dec 15, 2024',
    status: 'active'
  },
  {
    id: 2,
    name: 'Michael Chen',
    initials: 'MC',
    email: 'michael.chen@example.com',
    role: 'provider',
    joinedDate: 'Dec 10, 2024',
    status: 'active'
  },
  {
    id: 3,
    name: 'Emma Davis',
    initials: 'ED',
    email: 'emma.davis@example.com',
    role: 'user',
    joinedDate: 'Dec 5, 2024',
    status: 'suspended'
  },
  {
    id: 4,
    name: 'David Wilson',
    initials: 'DW',
    email: 'david.wilson@example.com',
    role: 'admin',
    joinedDate: 'Nov 28, 2024',
    status: 'active'
  },
  {
    id: 5,
    name: 'Jessica Martinez',
    initials: 'JM',
    email: 'jessica.martinez@example.com',
    role: 'provider',
    joinedDate: 'Nov 20, 2024',
    status: 'active'
  },
  {
    id: 6,
    name: 'Ryan Thompson',
    initials: 'RT',
    email: 'ryan.thompson@example.com',
    role: 'user',
    joinedDate: 'Nov 15, 2024',
    status: 'active'
  },
  {
    id: 7,
    name: 'Ashley Brown',
    initials: 'AB',
    email: 'ashley.brown@example.com',
    role: 'provider',
    joinedDate: 'Nov 10, 2024',
    status: 'active'
  },
  {
    id: 8,
    name: 'James Anderson',
    initials: 'JA',
    email: 'james.anderson@example.com',
    role: 'user',
    joinedDate: 'Nov 5, 2024',
    status: 'active'
  },
  {
    id: 9,
    name: 'Olivia Garcia',
    initials: 'OG',
    email: 'olivia.garcia@example.com',
    role: 'user',
    joinedDate: 'Oct 30, 2024',
    status: 'suspended'
  },
  {
    id: 10,
    name: 'Daniel Lee',
    initials: 'DL',
    email: 'daniel.lee@example.com',
    role: 'provider',
    joinedDate: 'Oct 25, 2024',
    status: 'active'
  }
]

const filteredUsers = computed(() => {
  return users.filter(user => {
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchesSearch = !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesRole && matchesSearch
  })
})
</script>

<template>
  <div>
    <!-- Mobile Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300 ease-linear"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-linear"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
        @click="$emit('close')"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="isOpen || !isMobile"
        class="fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 lg:z-30"
        :class="[
          isCollapsed && !isMobile ? 'w-20' : 'w-64'
        ]"
      >
        <!-- Logo Section -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2 group overflow-hidden"
            :class="{ 'justify-center': isCollapsed && !isMobile }"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform flex-shrink-0">
              <span class="text-white font-bold text-lg">W</span>
            </div>
            <Transition
              enter-active-class="transition-opacity duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <span
                v-if="!isCollapsed || isMobile"
                class="text-xl font-bold whitespace-nowrap"
              >
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                  MyWater
                </span>
                <span class="text-slate-700">Closet</span>
              </span>
            </Transition>
          </NuxtLink>

          <!-- Close button (mobile) / Collapse button (desktop) -->
          <button
            v-if="isMobile"
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            @click="$emit('close')"
          >
            <X class="w-5 h-5 text-slate-600" />
          </button>
          <button
            v-else
            class="hidden lg:block p-2 rounded-lg hover:bg-slate-100 transition-colors"
            @click="$emit('toggle-collapse')"
          >
            <PanelLeftClose
              v-if="!isCollapsed"
              class="w-4 h-4 text-slate-600"
            />
            <PanelLeftOpen
              v-else
              class="w-4 h-4 text-slate-600"
            />
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <ul class="space-y-1">
            <li v-for="item in navigationItems" :key="item.name">
              <NuxtLink
                :to="item.href"
                class="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative"
                :class="[
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-cyan-50 to-teal-50 text-cyan-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  isCollapsed && !isMobile ? 'justify-center' : ''
                ]"
                @click="isMobile && $emit('close')"
              >
                <div class="flex items-center space-x-3 overflow-hidden">
                  <component
                    :is="item.icon"
                    class="w-5 h-5 transition-transform group-hover:scale-110 flex-shrink-0"
                    :class="[
                      isActive(item.href)
                        ? 'text-cyan-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    ]"
                  />
                  <Transition
                    enter-active-class="transition-opacity duration-200"
                    enter-from-class="opacity-0"
                    enter-to-class="opacity-100"
                    leave-active-class="transition-opacity duration-200"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <span v-if="!isCollapsed || isMobile">{{ item.name }}</span>
                  </Transition>
                </div>

                <!-- Badge -->
                <Transition
                  enter-active-class="transition-opacity duration-200"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-active-class="transition-opacity duration-200"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <span
                    v-if="item.badge && (!isCollapsed || isMobile)"
                    class="px-2 py-0.5 text-xs font-semibold rounded-full"
                    :class="[
                      isActive(item.href)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'
                    ]"
                  >
                    {{ item.badge }}
                  </span>
                </Transition>

                <!-- Collapsed badge indicator -->
                <span
                  v-if="item.badge && isCollapsed && !isMobile"
                  class="absolute top-2 right-2 w-2 h-2 bg-cyan-600 rounded-full"
                />

                <!-- Tooltip for collapsed state -->
                <div
                  v-if="isCollapsed && !isMobile"
                  class="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                >
                  {{ item.name }}
                  <span v-if="item.badge" class="ml-1 px-1.5 py-0.5 bg-cyan-600 rounded-full text-xs">
                    {{ item.badge }}
                  </span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- User Profile Section -->
        <div class="p-3 border-t border-slate-200">
          <div
            class="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group relative"
            :class="{ 'justify-center': isCollapsed && !isMobile }"
            @click="toggleUserMenu"
          >
            <div class="relative flex-shrink-0">
              <div
                v-if="user.avatar"
                class="w-10 h-10 rounded-full overflow-hidden"
              >
                <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-white font-semibold"
              >
                {{ user.initials }}
              </div>
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            <Transition
              enter-active-class="transition-opacity duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <div
                v-if="!isCollapsed || isMobile"
                class="flex-1 min-w-0 ml-3"
              >
                <p class="text-sm font-semibold text-slate-900 truncate">
                  {{ user.name }}
                </p>
                <p class="text-xs text-slate-500 truncate">
                  {{ user.email }}
                </p>
              </div>
            </Transition>

            <Transition
              enter-active-class="transition-opacity duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ChevronDown
                v-if="!isCollapsed || isMobile"
                class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-2"
              />
            </Transition>

            <!-- User menu tooltip for collapsed state -->
            <div
              v-if="isCollapsed && !isMobile"
              class="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
            >
              <div class="font-semibold">{{ user.name }}</div>
              <div class="text-xs text-slate-300">{{ user.email }}</div>
            </div>
          </div>

          <!-- User Dropdown Menu -->
          <Transition
            enter-active-class="transition-all duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="userMenuOpen && (!isCollapsed || isMobile)"
              class="mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
            >
              <button
                class="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                @click="handleLogout"
              >
                <LogOut class="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </Transition>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { X, ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

interface NavigationItem {
  name: string
  href: string
  icon: any
  badge?: number
}

interface UserInfo {
  name: string
  email: string
  avatar?: string
  initials: string
}

interface Props {
  isOpen: boolean
  isCollapsed?: boolean
  navigationItems: NavigationItem[]
  user: UserInfo
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false
})

const emit = defineEmits<{
  close: []
  'toggle-collapse': []
  logout: []
}>()

const route = useRoute()
const isMobile = ref(false)
const userMenuOpen = ref(false)

const isActive = (href: string) => {
  // Exact match for dashboard home, prefix match for subpages
  if (href === '/dashboard') {
    return route.path === '/dashboard'
  }
  return route.path === href || route.path.startsWith(href + '/')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const handleLogout = () => {
  emit('logout')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

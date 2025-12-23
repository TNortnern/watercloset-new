<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { user, isAuthenticated, isProvider, isAdmin, logout, userInitials, displayName } = useAuth()

const links = [
  { label: 'Find Bathrooms', to: '/search' },
  { label: 'Become a Provider', to: '/become-provider' },
  { label: 'About', to: '/about' },
  { label: 'Safety', to: '/safety' },
]

const showUserMenu = ref(false)

const handleLogout = async () => {
  showUserMenu.value = false
  await logout()
}
</script>

<template>
  <header class="border-b bg-background/75 backdrop-blur-md sticky top-0 z-50">
    <div class="container h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <span class="text-xl font-bold text-primary">MyWaterCloset</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Logged Out -->
      <div v-if="!isAuthenticated" class="flex items-center gap-2">
        <Button variant="ghost" as-child>
          <NuxtLink to="/login">Sign In</NuxtLink>
        </Button>
        <Button as-child>
          <NuxtLink to="/register">Get Started</NuxtLink>
        </Button>
      </div>

      <!-- Logged In -->
      <div v-else class="flex items-center gap-4">
        <!-- Quick Actions -->
        <NuxtLink
          to="/search"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block"
        >
          Find Bathrooms
        </NuxtLink>

        <NuxtLink
          v-if="isProvider || isAdmin"
          to="/manage"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden md:block"
        >
          Provider Dashboard
        </NuxtLink>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click.stop="showUserMenu = !showUserMenu"
            class="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div
              v-if="user?.avatar?.url"
              class="w-8 h-8 rounded-full bg-cover bg-center"
              :style="{ backgroundImage: `url(${user.avatar.url})` }"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium"
            >
              {{ userInitials }}
            </div>
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-1 z-50"
            >
              <div class="px-4 py-3 border-b border-slate-100">
                <p class="text-sm font-medium text-slate-900">{{ displayName }}</p>
                <p class="text-xs text-slate-500 truncate">{{ user?.email }}</p>
              </div>

              <NuxtLink
                to="/dashboard"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Dashboard
              </NuxtLink>

              <NuxtLink
                to="/dashboard/favorites"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Favorites
              </NuxtLink>

              <NuxtLink
                to="/dashboard/profile"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Profile
              </NuxtLink>

              <NuxtLink
                to="/dashboard/settings"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Settings
              </NuxtLink>

              <div class="border-t border-slate-100 my-1" />

              <NuxtLink
                v-if="isProvider || isAdmin"
                to="/manage"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Provider Dashboard
              </NuxtLink>

              <NuxtLink
                v-if="isAdmin"
                to="/platform"
                @click="showUserMenu = false"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Platform Admin
              </NuxtLink>

              <div class="border-t border-slate-100 mt-1 pt-1">
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </header>

  <!-- Click outside to close menu -->
  <div
    v-if="showUserMenu"
    class="fixed inset-0 z-40"
    @click="showUserMenu = false"
  />
</template>

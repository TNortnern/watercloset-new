<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Briefcase, Shield } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const { login, isAuthenticated } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Quick login test accounts
const testAccounts = [
  {
    label: 'Enjoyer',
    email: 'enjoyer@enjoyer.enjoyer',
    password: 'enjoyer123',
    icon: User,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    label: 'Provider',
    email: 'provider@provider.provider',
    password: 'provider123',
    icon: Briefcase,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    label: 'Admin',
    email: 'foodeater563@gmail.com',
    password: 'Test1234!',
    icon: Shield,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
]

const fillTestAccount = (account: typeof testAccounts[0]) => {
  email.value = account.email
  password.value = account.password
}

// Get redirect URL from query params
const redirectUrl = computed(() => {
  const redirect = route.query.redirect as string
  return redirect || '/'
})

// Redirect if already logged in
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    navigateTo(redirectUrl.value)
  }
}, { immediate: true })

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(email.value, password.value)
    if (result.success) {
      navigateTo(redirectUrl.value)
    } else {
      error.value = result.error || 'Invalid credentials'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome Back</h1>
    <p class="text-slate-600 text-center mb-6">Sign in to your account to continue</p>

    <!-- Quick Login Buttons -->
    <div class="mb-6">
      <p class="text-xs text-slate-500 text-center mb-3">Quick Login (Dev Only)</p>
      <div class="flex gap-2">
        <button
          v-for="account in testAccounts"
          :key="account.email"
          type="button"
          @click="fillTestAccount(account)"
          :class="[account.color, 'flex-1 flex items-center justify-center gap-2 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors']"
        >
          <component :is="account.icon" class="w-4 h-4" />
          {{ account.label }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div v-if="error" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
        {{ error }}
      </div>

      <div class="space-y-2">
        <Label for="email">Email address</Label>
        <Input id="email" type="email" v-model="email" placeholder="name@example.com" required :disabled="loading" />
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <Label for="password">Password</Label>
          <NuxtLink to="/forgot-password" class="text-sm text-primary hover:underline font-medium">
            Forgot password?
          </NuxtLink>
        </div>
        <Input id="password" type="password" v-model="password" placeholder="••••••••" required :disabled="loading" />
      </div>

      <Button type="submit" class="w-full h-11 text-base" :disabled="loading">
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign In</span>
      </Button>
    </form>

    <div class="mt-8 text-center text-sm text-slate-600">
      Don't have an account?
      <NuxtLink to="/register" class="text-primary hover:underline font-medium">
        Sign up
      </NuxtLink>
    </div>
  </div>
</template>

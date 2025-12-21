<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
    <p class="text-slate-600 text-center mb-8">Sign in to your account to continue</p>

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

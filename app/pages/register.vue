<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({
  layout: 'auth',
})

const { register, isAuthenticated } = useAuth()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

// Redirect if already logged in
watch(isAuthenticated, (authenticated) => {
  if (authenticated) {
    navigateTo('/')
  }
}, { immediate: true })

const handleRegister = async () => {
  error.value = ''

  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  loading.value = true

  try {
    const result = await register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
    })

    if (result.success) {
      navigateTo('/')
    } else {
      error.value = result.error || 'Registration failed'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-slate-900 mb-2 text-center">Create an Account</h1>
    <p class="text-slate-600 text-center mb-8">Join the community today</p>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div v-if="error" class="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
        {{ error }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <Label for="firstName">First name</Label>
          <Input id="firstName" v-model="form.firstName" placeholder="Jane" required :disabled="loading" />
        </div>
        <div class="space-y-2">
          <Label for="lastName">Last name</Label>
          <Input id="lastName" v-model="form.lastName" placeholder="Doe" required :disabled="loading" />
        </div>
      </div>

      <div class="space-y-2">
        <Label for="email">Email address</Label>
        <Input id="email" type="email" v-model="form.email" placeholder="name@example.com" required :disabled="loading" />
      </div>

      <div class="space-y-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" v-model="form.password" placeholder="Create a password" required :disabled="loading" />
        <p class="text-xs text-slate-500">Must be at least 8 characters long</p>
      </div>

      <div class="pt-2">
        <Button type="submit" class="w-full h-11 text-base" :disabled="loading">
          <span v-if="loading">Creating account...</span>
          <span v-else>Create Account</span>
        </Button>
      </div>
    </form>

    <p class="mt-6 text-xs text-center text-slate-500 leading-relaxed">
      By clicking "Create Account", you agree to our
      <NuxtLink to="/terms" class="underline hover:text-slate-800">Terms of Service</NuxtLink>
      and
      <NuxtLink to="/privacy-policy" class="underline hover:text-slate-800">Privacy Policy</NuxtLink>.
    </p>

    <div class="mt-8 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
      Already have an account?
      <NuxtLink to="/login" class="text-primary hover:underline font-medium">
        Sign in
      </NuxtLink>
    </div>
  </div>
</template>

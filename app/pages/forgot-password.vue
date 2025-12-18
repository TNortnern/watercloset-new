<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: 'auth',
})

const email = ref('')
const isSubmitted = ref(false)

const handleSubmit = () => {
  // Placeholder for password reset logic
  console.log('Reset password for:', email.value)
  isSubmitted.value = true
}
</script>

<template>
  <div>
    <div v-if="!isSubmitted">
      <h1 class="text-2xl font-bold text-slate-900 mb-2 text-center">Reset Password</h1>
      <p class="text-slate-600 text-center mb-8">Enter your email and we'll send you a link to reset your password.</p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-2">
          <Label for="email">Email address</Label>
          <Input id="email" type="email" v-model="email" placeholder="name@example.com" required />
        </div>

        <Button type="submit" class="w-full h-11 text-base">Send Reset Link</Button>
      </form>
    </div>

    <div v-else class="text-center py-4">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Check your email</h2>
      <p class="text-slate-600 mb-8">
        We've sent a password reset link to <span class="font-medium text-slate-900">{{ email }}</span>.
      </p>
      <Button variant="outline" class="w-full" @click="isSubmitted = false">Try another email</Button>
    </div>

    <div class="mt-8 text-center text-sm">
      <NuxtLink to="/login" class="inline-flex items-center text-slate-600 hover:text-slate-900 font-medium">
        <ArrowLeft class="w-4 h-4 mr-2" /> Back to Sign In
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

definePageMeta({
  layout: 'auth',
})

const password = ref('')
const confirmPassword = ref('')
const isSuccess = ref(false)

const handleReset = () => {
  // Placeholder for password update logic
  if (password.value === confirmPassword.value) {
    console.log('Password updated successfully')
    isSuccess.value = true
  } else {
    alert('Passwords do not match')
  }
}
</script>

<template>
  <div>
    <div v-if="!isSuccess">
      <h1 class="text-2xl font-bold text-slate-900 mb-2 text-center">Set New Password</h1>
      <p class="text-slate-600 text-center mb-8">Please choose a new password for your account.</p>

      <form @submit.prevent="handleReset" class="space-y-6">
        <div class="space-y-2">
          <Label for="password">New Password</Label>
          <Input id="password" type="password" v-model="password" placeholder="••••••••" required />
          <p class="text-xs text-slate-500">Must be at least 8 characters long</p>
        </div>

        <div class="space-y-2">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="••••••••" required />
        </div>

        <Button type="submit" class="w-full h-11 text-base">Update Password</Button>
      </form>
    </div>

    <div v-else class="text-center py-4">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Password Updated</h2>
      <p class="text-slate-600 mb-8">
        Your password has been successfully reset. You can now sign in with your new password.
      </p>
      <Button as-child class="w-full h-11 text-base">
        <NuxtLink to="/login">Sign In</NuxtLink>
      </Button>
    </div>
  </div>
</template>

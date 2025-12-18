<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-muted/50 border-t">
    <div class="container py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-lg font-bold mb-4">MyWaterCloset</h3>
          <p class="text-sm text-muted-foreground">
            Connecting people with clean, safe, and private bathrooms everywhere.
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Platform</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><NuxtLink to="/about" class="hover:text-primary">About Us</NuxtLink></li>
            <li><NuxtLink to="/how-it-works" class="hover:text-primary">How it Works</NuxtLink></li>
            <li><NuxtLink to="/safety" class="hover:text-primary">Safety</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><NuxtLink to="/terms" class="hover:text-primary">Terms of Service</NuxtLink></li>
            <li><NuxtLink to="/privacy-policy" class="hover:text-primary">Privacy Policy</NuxtLink></li>
          </ul>
        </div>
        <div>
           <h4 class="font-semibold mb-4">Connect</h4>
           <div class="flex gap-4">
             <Button variant="ghost" size="icon">
                <Globe class="w-4 h-4" />
             </Button>
           </div>
        </div>
      </div>
      <div class="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} MyWaterCloset, Inc. All rights reserved.
      </div>
    </div>
  </footer>
</template>

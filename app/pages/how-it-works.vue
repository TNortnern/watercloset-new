<script setup lang="ts">
import { Check, Search, Calendar, CreditCard, Star } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const userSteps = [
  {
    title: "Search Nearby",
    description: "Use our interactive map to find clean, available restrooms in your immediate vicinity.",
    icon: Search
  },
  {
    title: "Check Details",
    description: "View photos, amenities, accessibility features, and reviews from other users.",
    icon: Check
  },
  {
    title: "Book & Pay",
    description: "Reserve your spot instantly. Secure payment through the app ensures a hassle-free experience.",
    icon: CreditCard
  },
  {
    title: "Access & Review",
    description: "Get directions and access codes. After your visit, rate the cleanliness to help the community.",
    icon: Star
  }
]

const providerSteps = [
  {
    title: "List Your Space",
    description: "Create a profile for your bathroom with photos and description. It takes less than 5 minutes.",
    icon: Calendar
  },
  {
    title: "Set Availability",
    description: "You decide when your restroom is available. Block out times when you need privacy.",
    icon: Calendar
  },
  {
    title: "Welcome Guests",
    description: "Users book through the app. You can choose to approve each request or enable instant booking.",
    icon: Check
  },
  {
    title: "Get Paid",
    description: "Earnings are deposited directly to your bank account via Stripe secure payouts.",
    icon: CreditCard
  }
]
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          How It Works
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Whether you're looking for a restroom or hosting one, we've made the process simple, secure, and transparent.
        </p>
      </div>
    </section>

    <section class="py-20 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="mb-20">
          <div class="text-center mb-12">
            <span class="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">For Enjoyers</span>
            <h2 class="text-3xl font-bold text-slate-900 mt-4">Find a Restroom in Minutes</h2>
          </div>
          
          <div class="grid md:grid-cols-4 gap-8 relative">
             <!-- Connector Line (Desktop) -->
             <div class="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-slate-200 -z-10 translate-y-4"></div>
             
             <div v-for="(step, index) in userSteps" :key="index" class="bg-slate-50 md:bg-transparent p-6 md:p-0 rounded-2xl">
               <div class="w-16 h-16 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm z-10 relative">
                 <component :is="step.icon" class="w-8 h-8 text-primary" />
               </div>
               <div class="text-center">
                 <h3 class="text-xl font-bold text-slate-900 mb-3">{{ index + 1 }}. {{ step.title }}</h3>
                 <p class="text-slate-600">{{ step.description }}</p>
               </div>
             </div>
          </div>
          <div class="text-center mt-12">
            <Button size="lg" class="rounded-full px-8">Start Searching</Button>
          </div>
        </div>

        <div class="border-t border-slate-200 my-20"></div>

        <div>
          <div class="text-center mb-12">
            <span class="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">For Providers</span>
            <h2 class="text-3xl font-bold text-slate-900 mt-4">Turn Your Bathroom into Income</h2>
          </div>
          
          <div class="grid md:grid-cols-2 gap-12 items-center">
             <div class="order-2 md:order-1 grid sm:grid-cols-2 gap-6">
               <div v-for="(step, index) in providerSteps" :key="index" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <span class="font-bold text-green-700">{{ index + 1 }}</span>
                  </div>
                  <h3 class="font-bold text-slate-900 mb-2">{{ step.title }}</h3>
                  <p class="text-sm text-slate-600">{{ step.description }}</p>
               </div>
             </div>
             <div class="order-1 md:order-2 text-center md:text-left space-y-6">
                <h3 class="text-3xl font-bold text-slate-900">Why host with us?</h3>
                <ul class="space-y-4 text-lg text-slate-600">
                  <li class="flex items-center gap-3">
                    <Check class="w-6 h-6 text-green-600 shrink-0" />
                    <span>You control the schedule completely</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <Check class="w-6 h-6 text-green-600 shrink-0" />
                    <span>Screened users with verified IDs</span>
                  </li>
                  <li class="flex items-center gap-3">
                    <Check class="w-6 h-6 text-green-600 shrink-0" />
                    <span>Reliable weekly payouts</span>
                  </li>
                   <li class="flex items-center gap-3">
                    <Check class="w-6 h-6 text-green-600 shrink-0" />
                    <span>Support for your local community</span>
                  </li>
                </ul>
                <div class="pt-4">
                  <Button size="lg" variant="outline" class="rounded-full px-8">Learn More About Hosting</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

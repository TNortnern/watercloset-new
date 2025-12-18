<script setup lang="ts">
import { MapPin, Building, ShieldCheck, Zap } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const services = [
  {
    title: "Personal Access",
    description: "Instant access to clean, private restrooms for individuals and families on the go.",
    icon: MapPin,
    features: ["Real-time availability", "Hygiene ratings", "Instant booking", "Navigation assistance"]
  },
  {
    title: "Business Solutions",
    description: "Monetize underutilized facilities and drive foot traffic to your retail location.",
    icon: Building,
    features: ["Revenue generation", "Foot traffic analytics", "Access control integration", "Automated payments"]
  },
  {
    title: "Event Partnerships",
    description: "Temporary restroom network solutions for festivals, parades, and city-wide events.",
    icon: Zap,
    features: ["Pop-up networks", "Crowd management", "VIP restroom access", "Logistics support"]
  }
]
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Our Services
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Connecting the world's restrooms to the people who need them.
        </p>
      </div>
    </section>

    <section class="py-20 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="grid lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.title" class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
             <div class="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
               <component :is="service.icon" class="w-7 h-7 text-primary" />
             </div>
             <h3 class="text-2xl font-bold text-slate-900 mb-4">{{ service.title }}</h3>
             <p class="text-slate-600 mb-8 leading-relaxed">{{ service.description }}</p>
             
             <ul class="space-y-3 mb-8">
               <li v-for="feature in service.features" :key="feature" class="flex items-center gap-3 text-sm text-slate-700">
                 <ShieldCheck class="w-4 h-4 text-green-500" />
                 <span>{{ feature }}</span>
               </li>
             </ul>
             
             <Button variant="outline" class="w-full rounded-xl">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
    
    <section class="py-20 px-6">
       <div class="container mx-auto max-w-4xl text-center bg-slate-900 rounded-[2.5rem] p-12 md:p-20 relative overflow-hidden">
          <div class="absolute inset-0 bg-[url('/images/bathrooms/bathroom-blue.jpg')] opacity-10 bg-cover bg-center"></div>
          <div class="relative z-10 space-y-8">
            <h2 class="text-3xl md:text-5xl font-bold text-white">Custom Enterprise Solutions</h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto">
              Are you a municipality or large venue operator? We offer white-label solutions and API integrations to manage public restroom networks efficiently.
            </p>
            <Button size="lg" class="bg-white text-slate-900 hover:bg-slate-100 border-none rounded-full px-10">Contact Sales</Button>
          </div>
       </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, XCircle, Award, Sparkles } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const requirements = [
  {
    title: "Cleanliness",
    description: "Bathrooms must be cleaned regularly. No visible dirt, grime, or overflowing trash. Surfaces must be sanitized.",
    icon: Sparkles
  },
  {
    title: "Functionality",
    description: "Toilets, sinks, and locks must be in full working order. Running water, soap, and toilet paper must be provided.",
    icon: CheckCircle2
  },
  {
    title: "Privacy",
    description: "The bathroom must be a private, enclosed space with a locking door. No shared open facilities.",
    icon: Award
  }
]

const prohibited = [
  "Outdoor portable toilets (porta-potties)",
  "Bathrooms without a working sink",
  "Spaces that are not fully enclosed",
  "Facilities with broken locks",
  "Unsanitary or hazardous conditions"
]
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Quality Standards
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          We maintain high standards to ensure every MyWaterCloset experience is comfortable, clean, and dignified.
        </p>
      </div>
    </section>

    <section class="py-20 px-6">
      <div class="container mx-auto max-w-5xl">
        <div class="grid md:grid-cols-3 gap-8 mb-20">
          <div v-for="req in requirements" :key="req.title" class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
             <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <component :is="req.icon" class="w-8 h-8 text-primary" />
             </div>
             <h3 class="text-xl font-bold text-slate-900 mb-3">{{ req.title }}</h3>
             <p class="text-slate-600">{{ req.description }}</p>
          </div>
        </div>

        <div class="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <div class="grid md:grid-cols-2">
             <div class="p-10 md:p-14 space-y-8">
               <h2 class="text-3xl font-bold text-slate-900">What We Don't Allow</h2>
               <p class="text-slate-600 text-lg">
                 To maintain trust and quality, certain types of facilities are strictly prohibited on our platform.
               </p>
               <ul class="space-y-4">
                 <li v-for="item in prohibited" :key="item" class="flex items-center gap-3 text-red-700 font-medium">
                   <XCircle class="w-5 h-5 shrink-0" />
                   <span>{{ item }}</span>
                 </li>
               </ul>
             </div>
             <div class="bg-slate-100 relative min-h-[300px]">
                <img src="/images/bathrooms/bathroom1.jpg" class="absolute inset-0 w-full h-full object-cover" alt="Clean Bathroom Standard" />
             </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

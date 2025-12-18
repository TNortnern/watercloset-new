<script setup lang="ts">
import { Shield, UserCheck, Eye, MessageSquare, AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const safetyFeatures = [
  {
    title: "Verified Identities",
    description: "Every provider and user must verify their identity with a government-issued ID before booking or listing.",
    icon: UserCheck
  },
  {
    title: "Secure Payments",
    description: "All transactions are processed securely. Money is held in escrow until the booking is successfully completed.",
    icon: Shield
  },
  {
    title: "Community Reviews",
    description: "Honest, transparent reviews from real users help keep our standards high and bad actors out.",
    icon: Star
  },
  {
    title: "Privacy Protection",
    description: "Your exact location is only shared after a booking is confirmed. We never sell your personal data.",
    icon: Eye
  }
]
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Safety & Trust
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Your safety is our absolute priority. We've built robust systems to ensure every interaction on MyWaterCloset is secure and dignified.
        </p>
      </div>
    </section>

    <section class="py-20 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-12 mb-20">
           <div class="space-y-8">
             <h2 class="text-3xl font-bold text-slate-900">Building a Safe Community</h2>
             <p class="text-lg text-slate-600 leading-relaxed">
               Inviting someone into your space or entering someone else's requires trust. That's why we don't just facilitate transactions; we build relationships based on accountability.
             </p>
             <ul class="space-y-4">
               <li v-for="feature in safetyFeatures" :key="feature.title" class="flex items-start gap-4">
                 <div class="bg-primary/10 p-2 rounded-lg shrink-0">
                   <component :is="feature.icon" class="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h3 class="font-bold text-slate-900 text-lg">{{ feature.title }}</h3>
                   <p class="text-slate-600 mt-1">{{ feature.description }}</p>
                 </div>
               </li>
             </ul>
           </div>
           <div class="relative rounded-3xl overflow-hidden shadow-xl aspect-square md:aspect-auto bg-slate-200">
              <img src="/images/blocks/avatars/circle/avatar-f-10.png" class="absolute inset-0 w-full h-full object-cover" alt="Safety" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-8">
                 <blockquote class="text-white text-lg font-medium">
                   "I feel safer using MyWaterCloset than public restrooms. Knowing the host is verified gives me total peace of mind."
                   <footer class="mt-4 text-sm text-slate-300 font-normal">— Jennifer L., Verified User</footer>
                 </blockquote>
              </div>
           </div>
        </div>

        <div class="bg-red-50 rounded-3xl p-8 md:p-12 border border-red-100">
           <div class="flex flex-col md:flex-row items-center gap-8">
              <div class="bg-red-100 p-4 rounded-full shrink-0">
                <AlertTriangle class="w-10 h-10 text-red-600" />
              </div>
              <div class="flex-1 text-center md:text-left">
                <h3 class="text-2xl font-bold text-red-900 mb-2">24/7 Safety Support</h3>
                <p class="text-red-700">
                  If you ever feel unsafe or encounter an emergency during a booking, our dedicated safety team is available around the clock. In immediate danger, always call local emergency services first.
                </p>
              </div>
              <Button variant="destructive" size="lg" class="rounded-full px-8 shrink-0">Contact Safety Team</Button>
           </div>
        </div>
      </div>
    </section>
  </div>
</template>

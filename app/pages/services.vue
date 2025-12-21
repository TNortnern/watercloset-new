<script setup lang="ts">
import { MapPin, Building, ShieldCheck, Zap, Home, DollarSign, Accessibility, Calendar, Users } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const services = [
  {
    title: "For Users",
    description: "Find clean, accessible restrooms anywhere. Filter by amenities like wheelchair access, baby changing, and more.",
    icon: MapPin,
    features: ["Real-time availability", "Accessibility filters", "Instant booking", "Verified locations"]
  },
  {
    title: "For Providers",
    description: "Turn your restroom into a revenue stream. Help your community while earning extra income.",
    icon: Home,
    features: ["Flexible scheduling", "Set your own rates", "Verified guests only", "Instant payouts"]
  },
  {
    title: "For Businesses",
    description: "Monetize underutilized facilities and drive foot traffic to your location.",
    icon: Building,
    features: ["Increased visibility", "Customer analytics", "Access control", "Brand exposure"]
  }
]

const providerBenefits = [
  { icon: DollarSign, title: "Earn Extra Income", description: "Set your own rates and availability. Earn $50-200+ per month." },
  { icon: Calendar, title: "Flexible Schedule", description: "Control when your facility is available. Block dates anytime." },
  { icon: ShieldCheck, title: "Protected & Insured", description: "All bookings include liability coverage and verified users." },
  { icon: Users, title: "Help Your Community", description: "Serve parents, elderly, and those with medical needs." },
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
    
    <!-- Provider Benefits Section -->
    <section class="py-24 px-6 bg-gradient-to-b from-cyan-50 to-white">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Why Become a Provider?</h2>
          <p class="text-slate-600 text-lg">
            Join thousands of homeowners and businesses earning extra income while helping their community.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="benefit in providerBenefits" :key="benefit.title" class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <div class="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <component :is="benefit.icon" class="w-6 h-6 text-cyan-600" />
            </div>
            <h3 class="font-bold text-slate-900 mb-2">{{ benefit.title }}</h3>
            <p class="text-sm text-slate-600">{{ benefit.description }}</p>
          </div>
        </div>

        <div class="mt-12 text-center">
          <Button size="lg" class="rounded-full px-8" @click="navigateTo('/register')">
            Start Hosting Today
          </Button>
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

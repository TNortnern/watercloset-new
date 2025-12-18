<script setup lang="ts">
import { Users, Target, Heart, Shield } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

definePageMeta({
  layout: 'home',
})

const team = [
  {
    name: "Sarah Jenkins",
    role: "Co-Founder & CEO",
    bio: "Former urban planner passionate about accessible city infrastructure.",
    image: "/images/blocks/avatars/circle/avatar-f-1.png"
  },
  {
    name: "David Chen",
    role: "CTO",
    bio: "Tech veteran ensuring our platform is secure, fast, and reliable.",
    image: "/images/blocks/avatars/circle/avatar-m-1.png"
  },
  {
    name: "Maria Rodriguez",
    role: "Head of Community",
    bio: "Building trust and safety across our network of providers.",
    image: "/images/blocks/avatars/circle/avatar-f-2.png"
  }
]

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "We believe in the power of sharing resources to build stronger, more connected communities."
  },
  {
    icon: Target,
    title: "Accessibility",
    description: "Everyone deserves safe, dignified access to restroom facilities, regardless of ability or background."
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "We rigorously vet providers and maintain high standards to ensure every visit is safe."
  },
  {
    icon: Heart,
    title: "Dignity",
    description: "We treat the need for a restroom as a basic human right, not an awkward inconvenience."
  }
]
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <!-- Hero Section -->
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Reimagining Urban <span class="text-primary">Restroom Access</span>
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed">
          MyWaterCloset was born from a simple observation: finding a clean, safe restroom in the city is harder than it should be. We're changing that by connecting people who need facilities with local businesses and homeowners who have them.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-20 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div class="relative rounded-3xl overflow-hidden shadow-xl aspect-video md:aspect-square">
             <img src="/images/bathrooms/bathroom4.jpg" alt="Our Mission" class="w-full h-full object-cover" />
             <div class="absolute inset-0 bg-primary/10"></div>
          </div>
          <div class="space-y-8">
            <h2 class="text-3xl font-bold text-slate-900">Our Mission</h2>
            <p class="text-lg text-slate-600 leading-relaxed">
              We are on a mission to solve the "restroom gap" in modern cities. Public infrastructure hasn't kept pace with population growth, leaving millions of people—including parents, elderly citizens, and those with medical conditions—without reliable access.
            </p>
            <p class="text-lg text-slate-600 leading-relaxed">
              By unlocking the potential of existing private facilities, we're creating a distributed network of restrooms that is cleaner, safer, and more accessible than traditional public options.
            </p>
            <div class="pt-4">
               <Button size="lg" class="rounded-full px-8">Join Our Mission</Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="bg-white py-24 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Core Values</h2>
          <p class="text-slate-600">The principles that guide every decision we make.</p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="value in values" :key="value.title" class="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow">
            <component :is="value.icon" class="w-12 h-12 text-primary mb-6" />
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ value.title }}</h3>
            <p class="text-slate-600 leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-24 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Meet the Team</h2>
          <p class="text-slate-600 max-w-2xl mx-auto">The people working behind the scenes to make your experience seamless.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <div v-for="member in team" :key="member.name" class="text-center group">
            <div class="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
              <img :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-bold text-slate-900">{{ member.name }}</h3>
            <div class="text-primary font-medium mb-3">{{ member.role }}</div>
            <p class="text-slate-600 px-4">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

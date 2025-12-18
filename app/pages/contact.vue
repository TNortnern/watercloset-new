<script setup lang="ts">
import { Mail, Phone, MapPin, Send } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

definePageMeta({
  layout: 'home',
})
</script>

<template>
  <div class="bg-slate-50 min-h-screen pb-20">
    <section class="bg-white pt-32 pb-20 border-b border-slate-100">
      <div class="container mx-auto px-6 text-center max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
          Contact Us
        </h1>
        <p class="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Have a question, feedback, or need assistance? We're here to help.
        </p>
      </div>
    </section>

    <section class="py-20 px-6">
      <div class="container mx-auto max-w-6xl">
        <div class="grid lg:grid-cols-2 gap-16">
           <!-- Contact Info -->
           <div class="space-y-10">
             <div>
               <h2 class="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
               <p class="text-slate-600 mb-8 leading-relaxed">
                 Whether you're a provider needing help with a listing or a user with a booking question, our support team is ready to assist you.
               </p>
             </div>
             
             <div class="space-y-6">
               <div class="flex items-start gap-4">
                 <div class="bg-primary/10 p-3 rounded-xl shrink-0">
                   <Mail class="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h3 class="font-bold text-slate-900 mb-1">Email Us</h3>
                   <p class="text-slate-600">support@mywatercloset.com</p>
                   <p class="text-slate-600">partners@mywatercloset.com</p>
                 </div>
               </div>
               
               <div class="flex items-start gap-4">
                 <div class="bg-primary/10 p-3 rounded-xl shrink-0">
                   <Phone class="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h3 class="font-bold text-slate-900 mb-1">Call Us</h3>
                   <p class="text-slate-600">+1 (555) 123-4567</p>
                   <p class="text-sm text-slate-400 mt-1">Mon-Fri, 9am-6pm EST</p>
                 </div>
               </div>
               
               <div class="flex items-start gap-4">
                 <div class="bg-primary/10 p-3 rounded-xl shrink-0">
                   <MapPin class="w-6 h-6 text-primary" />
                 </div>
                 <div>
                   <h3 class="font-bold text-slate-900 mb-1">Headquarters</h3>
                   <p class="text-slate-600">123 Innovation Way</p>
                   <p class="text-slate-600">San Francisco, CA 94103</p>
                 </div>
               </div>
             </div>
           </div>

           <!-- Contact Form -->
           <div class="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
             <h3 class="text-xl font-bold text-slate-900 mb-6">Send us a Message</h3>
             <form class="space-y-6">
               <div class="grid sm:grid-cols-2 gap-6">
                 <div class="space-y-2">
                   <Label for="firstName">First name</Label>
                   <Input id="firstName" placeholder="Jane" />
                 </div>
                 <div class="space-y-2">
                   <Label for="lastName">Last name</Label>
                   <Input id="lastName" placeholder="Doe" />
                 </div>
               </div>
               
               <div class="space-y-2">
                 <Label for="email">Email</Label>
                 <Input id="email" type="email" placeholder="jane@example.com" />
               </div>
               
               <div class="space-y-2">
                 <Label for="subject">Subject</Label>
                 <Input id="subject" placeholder="How can we help?" />
               </div>
               
               <div class="space-y-2">
                 <Label for="message">Message</Label>
                 <Textarea id="message" placeholder="Tell us more about your inquiry..." class="min-h-[150px]" />
               </div>
               
               <Button type="submit" class="w-full h-12 text-lg rounded-xl">
                 <Send class="w-4 h-4 mr-2" /> Send Message
               </Button>
             </form>
           </div>
        </div>
      </div>
    </section>
  </div>
</template>

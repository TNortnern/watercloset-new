<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, MapPin, Calendar as CalendarIcon, Map as MapIcon, ShieldCheck, HeartHandshake, Accessibility, CheckCircle2, Star, User, Clock, Wallet, Shield, Heart } from 'lucide-vue-next'

definePageMeta({
  layout: 'home',
})

const faqs = [
  {
    question: 'Is this safe?',
    answer: 'Safety is foundational to MyWaterCloset. All providers complete identity verification. Every listing includes clear photos, house rules, and reviews from previous visitors. Both parties can rate their experience, and our support team is available around the clock.'
  },
  {
    question: 'Can businesses list bathrooms?',
    answer: 'Yes. Caf�s, retail shops, offices, gyms, hotels, and other businesses are welcome to list their facilities. Business listings can set operating hours, pricing, and any requirements for access.'
  },
  {
    question: 'Are accessible bathrooms guaranteed?',
    answer: 'Providers self-report accessibility features using our detailed checklist. We display this information clearly on every listing. While we cannot physically verify every detail, we take misrepresentation seriously.'
  },
  {
    question: 'Do I need to interact with the provider?',
    answer: 'That depends on the listing. Some providers offer self-service access with keypad codes or smart locks. Others prefer to greet visitors at the door. Each listing clearly indicates the access method.'
  },
  {
    question: 'What if something goes wrong?',
    answer: 'Our support team is available 24/7. If you experience an issue with a listing, contact us immediately. We handle dispute resolutions and issue refunds if appropriate.'
  }
]

const testimonials = [
  {
    quote: "As a rideshare driver, finding a clean restroom used to be my biggest daily challenge. MyWaterCloset changed that. I know exactly where I can stop.",
    author: "Marcus R.",
    role: "Rideshare Driver",
    image: "/images/blocks/avatars/circle/avatar-m-10.png"
  },
  {
    quote: "I have Crohn's disease, and the anxiety of not knowing where the nearest restroom is can be overwhelming. This app gives me peace of mind everywhere I go.",
    author: "Jennifer L.",
    role: "Software Engineer",
    image: "/images/blocks/avatars/circle/avatar-f-10.png"
  },
  {
    quote: "We run a small caf� and started listing our restroom six months ago. It brings in a little extra income, but honestly, it just feels good to help people.",
    author: "David K.",
    role: "Caf� Owner",
    image: "/images/blocks/avatars/circle/avatar-m-4.png"
  }
]

const accessibilityFeatures = [
  'Wheelchair accessible',
  'Step-free access from street',
  'Grab bars installed',
  'Wide doorway (32"+ clearance)',
  'Adequate turning radius',
  'Lowered sink available',
  'Emergency pull cord',
  'Well-lit pathway'
]
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50 font-sans">
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 px-6 overflow-hidden">
      <div class="container relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="space-y-8" v-motion-slide-visible-once-bottom>
            <h1 class="text-5xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
              Find a restroom when you need one. <br />
              <span class="text-primary">Offer one when you can.</span>
            </h1>
            <p class="text-xl text-muted-foreground leading-relaxed max-w-lg">
              MyWaterCloset connects people who need a restroom with those who have one to share. A simple, dignified solution for a universal need.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 pt-2">
              <Button size="xl" class="h-14 px-8 text-lg rounded-full shadow-lg shadow-primary/20">
                <MapPin class="mr-2 h-5 w-5" />
                Find a Restroom
              </Button>
              <Button size="xl" variant="outline" class="h-14 px-8 text-lg rounded-full bg-white/50 border-slate-200">
                <MapIcon class="mr-2 h-5 w-5" />
                Become a Provider
              </Button>
            </div>
            
            <div class="flex items-center gap-6 pt-4">
              <div class="flex -space-x-3">
                <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-50 flex items-center justify-center overflow-hidden">
                   <img :src="'/images/blocks/avatars/circle/avatar-m-' + i + '.png'" class="w-full h-full object-cover" alt="User" />
                </div>
              </div>
              <div class="text-sm text-slate-600">
                <span class="font-bold text-foreground">12,400+</span> restrooms available
              </div>
            </div>
          </div>

          <div class="relative" v-motion-fade-visible-once>
             <!-- Decorative Map Background -->
             <div class="aspect-square max-w-lg mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative border border-slate-100">
                <img src="/images/blocks/maps/map-1.png" class="w-full h-full object-cover opacity-40" alt="Map" />
                
                <!-- Mock Pins -->
                <div class="absolute top-[20%] left-[25%]" v-motion-pop-visible-once :delay="200">
                   <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-pointer text-white font-bold">
                     Free
                   </div>
                </div>
                <div class="absolute top-[45%] left-[60%]" v-motion-pop-visible-once :delay="400">
                   <div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-pointer text-white font-bold">
                     
                   </div>
                </div>
                <div class="absolute top-[65%] left-[30%]" v-motion-pop-visible-once :delay="600">
                   <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-pointer text-white font-bold">
                     <Accessibility class="h-5 w-5" />
                   </div>
                </div>

                <!-- Search Card Overlay -->
                <div class="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/50" v-motion-slide-visible-once-bottom :delay="800">
                  <div class="space-y-4">
                    <div class="relative">
                      <Search class="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by location..." class="pl-10 bg-transparent border-slate-200" />
                    </div>
                    <Button class="w-full rounded-xl">Search Nearby</Button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Experience the Difference (Feature Blocks) -->
    <section class="py-24 bg-white overflow-hidden">
      <div class="container">
        <!-- Block 1: Find Your Perfect Spot -->
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mb-24 lg:mb-32" v-motion-slide-visible-once-left>
          <div class="flex-1 space-y-6">
            <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <Search class="h-4 w-4" />
              <span>Discover</span>
            </div>
            <h2 class="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Find Your Perfect <br/><span class="text-primary">Bathroom Spot</span>
            </h2>
            <p class="text-xl text-slate-600 leading-relaxed">
              Our platform allows users to book a bathroom at their convenience. Whether you�re traveling or need a quick refresh, we have a bathroom ready for you. Browse our trusted providers, all vetted and reviewed by users.
            </p>
            <ul class="space-y-3 pt-2">
              <li class="flex items-center gap-3 text-slate-700">
                <CheckCircle2 class="h-5 w-5 text-primary" />
                <span>Instant booking available</span>
              </li>
              <li class="flex items-center gap-3 text-slate-700">
                <CheckCircle2 class="h-5 w-5 text-primary" />
                <span>Filter by amenities & accessibility</span>
              </li>
              <li class="flex items-center gap-3 text-slate-700">
                <CheckCircle2 class="h-5 w-5 text-primary" />
                <span>Real-time availability</span>
              </li>
            </ul>
            <div class="pt-4">
              <Button size="lg" class="rounded-full px-8">
                Explore Bathrooms
              </Button>
            </div>
          </div>
          <div class="flex-1 w-full relative">
             <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500">
               <img src="/images/bathrooms/luxurybathroom2.jpg" alt="Luxury Bathroom" class="w-full h-full object-cover aspect-[4/3]" />
               <!-- Floating Badge -->
               <div class="absolute bottom-8 left-8 bg-white/95 backdrop-blur px-6 py-3 rounded-xl shadow-lg flex items-center gap-4">
                 <div class="flex -space-x-2">
                   <img src="/images/blocks/avatars/circle/avatar-f-1.png" class="w-8 h-8 rounded-full border-2 border-white" />
                   <img src="/images/blocks/avatars/circle/avatar-m-2.png" class="w-8 h-8 rounded-full border-2 border-white" />
                   <img src="/images/blocks/avatars/circle/avatar-f-3.png" class="w-8 h-8 rounded-full border-2 border-white" />
                 </div>
                 <div class="text-sm font-semibold text-slate-900">
                   10k+ Happy Users
                 </div>
               </div>
             </div>
             <!-- Decorative elements -->
             <div class="absolute -z-10 top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        <!-- Block 2: Become a Provider -->
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24 mb-24 lg:mb-32" v-motion-slide-visible-once-right>
          <div class="flex-1 space-y-6">
            <div class="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-1.5 rounded-full text-sm font-medium">
              <Wallet class="h-4 w-4" />
              <span>Earn</span>
            </div>
            <h2 class="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Become a <br/><span class="text-primary">Bathroom Provider</span>
            </h2>
            <p class="text-xl text-slate-600 leading-relaxed">
              Got a clean and safe bathroom space? Join our community of bathroom providers and start earning today! We help you connect with users who need a convenient stop.
            </p>
            <div class="grid grid-cols-2 gap-6 pt-4">
               <div class="bg-slate-50 p-4 rounded-xl">
                 <h4 class="font-bold text-slate-900 text-lg mb-1">+</h4>
                 <p class="text-sm text-slate-600">Potential monthly earnings</p>
               </div>
               <div class="bg-slate-50 p-4 rounded-xl">
                 <h4 class="font-bold text-slate-900 text-lg mb-1">100%</h4>
                 <p class="text-sm text-slate-600">Control over schedule</p>
               </div>
            </div>
            <div class="pt-4">
              <Button size="lg" variant="outline" class="rounded-full px-8 border-slate-300">
                List Your Space
              </Button>
            </div>
          </div>
          <div class="flex-1 w-full relative">
             <div class="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white -rotate-2 hover:rotate-0 transition-transform duration-500">
               <img src="/provider-2.jpg" alt="Happy Provider" class="w-full h-full object-cover aspect-[4/3]" />
             </div>
             <div class="absolute -z-10 bottom-10 -left-10 w-40 h-40 bg-green-100 rounded-full blur-2xl"></div>
          </div>
        </div>

        <!-- Block 3: Safe & Trusted -->
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24" v-motion-slide-visible-once-left>
          <div class="flex-1 space-y-6">
            <div class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
              <Shield class="h-4 w-4" />
              <span>Safety</span>
            </div>
            <h2 class="text-3xl lg:text-5xl font-bold tracking-tight text-slate-900">
              Safe, Clean, and <br/><span class="text-primary">Trusted</span>
            </h2>
            <p class="text-xl text-slate-600 leading-relaxed">
              All our bathrooms are verified for cleanliness and safety. Read reviews from past users, and book with confidence knowing you�re getting a top-quality space every time.
            </p>
            <div class="flex gap-6 pt-4">
               <div class="flex items-center gap-3">
                 <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                   <User class="h-6 w-6 text-slate-700" />
                 </div>
                 <div>
                   <div class="font-bold text-slate-900">Verified IDs</div>
                   <div class="text-sm text-slate-500">For all users</div>
                 </div>
               </div>
               <div class="flex items-center gap-3">
                 <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                   <Star class="h-6 w-6 text-slate-700" />
                 </div>
                 <div>
                   <div class="font-bold text-slate-900">Rated Spaces</div>
                   <div class="text-sm text-slate-500">Community reviewed</div>
                 </div>
               </div>
            </div>
          </div>
          <div class="flex-1 w-full relative">
             <div class="grid grid-cols-2 gap-4">
                <img src="/images/bathrooms/luxurybathroom1.jpg" class="rounded-3xl shadow-lg w-full h-64 object-cover translate-y-8" alt="Clean Bathroom" />
                <img src="/enjoyer-2.jpg" class="rounded-3xl shadow-lg w-full h-64 object-cover -translate-y-8" alt="Safe Experience" />
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works (Tabs) -->
    <section class="py-24 bg-slate-50" v-motion-fade-visible-once>
      <div class="container">
        <div class="text-center mb-16 space-y-4">
           <h2 class="text-4xl font-semibold tracking-tight">How MyWaterCloset Works</h2>
           <p class="text-xl text-muted-foreground max-w-2xl mx-auto">Whether you need a restroom or have one to share, the process is straightforward.</p>
        </div>

        <Tabs default-value="enjoyers" class="w-full max-w-5xl mx-auto">
          <div class="flex justify-center mb-12">
            <TabsList class="inline-flex h-auto p-1.5 bg-white rounded-full shadow-sm">
              <TabsTrigger value="enjoyers" class="px-8 py-3 rounded-full text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">For Enjoyers</TabsTrigger>
              <TabsTrigger value="providers" class="px-8 py-3 rounded-full text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">For Providers</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="enjoyers">
             <div class="grid md:grid-cols-4 gap-8">
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-2xl">1</div>
                   <h3 class="text-xl font-semibold">Open the App</h3>
                   <p class="text-muted-foreground">Launch the app to see restrooms near your current location.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-2xl">2</div>
                   <h3 class="text-xl font-semibold">Browse Options</h3>
                   <p class="text-muted-foreground">Filter by accessibility, price, and rating. View photos.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-2xl">3</div>
                   <h3 class="text-xl font-semibold">Reserve Access</h3>
                   <p class="text-muted-foreground">Book instantly or request access. Receive entry code.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary font-bold text-2xl">4</div>
                   <h3 class="text-xl font-semibold">Use with Confidence</h3>
                   <p class="text-muted-foreground">Visit the restroom. Leave a review for the community.</p>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="providers">
             <div class="grid md:grid-cols-4 gap-8">
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-700 font-bold text-2xl shadow-sm">1</div>
                   <h3 class="text-xl font-semibold">List Your Restroom</h3>
                   <p class="text-muted-foreground">Add photos, describe features, and set location.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-700 font-bold text-2xl shadow-sm">2</div>
                   <h3 class="text-xl font-semibold">Set Your Terms</h3>
                   <p class="text-muted-foreground">Define availability, pricing, and house rules.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-700 font-bold text-2xl shadow-sm">3</div>
                   <h3 class="text-xl font-semibold">Approve Visits</h3>
                   <p class="text-muted-foreground">Manually approve or enable instant booking.</p>
                </div>
                <div class="text-center space-y-4">
                   <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-slate-700 font-bold text-2xl shadow-sm">4</div>
                   <h3 class="text-xl font-semibold">Earn Income</h3>
                   <p class="text-muted-foreground">Receive payments directly to your bank account.</p>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>

    <!-- Properties Near Me (Rich Grid) -->
    <!-- ... (Keep this section) -->

    <!-- Accessibility -->
    <section class="py-24 bg-slate-900 text-white overflow-hidden relative" v-motion-fade-visible-once>
      <!-- ... (Keep this section) -->
      <div class="absolute inset-0 bg-[url('/images/bathrooms/luxurybathroom2.jpg')] opacity-10 bg-cover bg-center"></div>
      <div class="container relative z-10">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div>
             <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 mb-8">
               <Accessibility class="h-5 w-5 text-primary" />
               <span class="font-medium">Accessibility First</span>
             </div>
             <h2 class="text-4xl lg:text-5xl font-semibold mb-6 tracking-tight">Inclusive by design.</h2>
             <p class="text-xl text-slate-300 mb-8 leading-relaxed">
               Finding an accessible restroom shouldn't be a challenge. We make it easy to filter for specific needs. Providers complete a detailed checklist.
             </p>
             <Button size="lg" class="bg-white text-slate-900 hover:bg-slate-100 border-none">
               Explore Accessible Spaces
             </Button>
          </div>
          <div class="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
             <h3 class="text-2xl font-semibold mb-6">Filter by feature</h3>
             <div class="grid sm:grid-cols-2 gap-4">
               <div v-for="feature in accessibilityFeatures" :key="feature" class="flex items-center gap-3">
                 <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                   <CheckCircle2 class="h-3.5 w-3.5 text-primary" />
                 </div>
                 <span class="text-slate-200 text-sm">{{ feature }}</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <!-- ... (Keep this section) -->

    <!-- Pricing (Simplified) -->
    <!-- ... (Keep this section) -->

    <!-- FAQ -->
    <!-- ... (Keep this section) -->

    <!-- CTA -->
    <section class="py-32 bg-primary text-primary-foreground relative overflow-hidden" v-motion-slide-visible-once-bottom>
      <div class="absolute inset-0 bg-gradient-to-br from-primary to-blue-600"></div>
      <div class="container relative z-10 text-center space-y-8">
        <h2 class="text-4xl lg:text-6xl font-bold tracking-tight text-white">Access when you need it. <br/> Income when you want it.</h2>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">Join thousands of people using MyWaterCloset to solve a simple, universal problem.</p>
        <div class="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Button size="xl" variant="secondary" class="h-16 px-10 text-lg rounded-full bg-white text-primary hover:bg-blue-50 border-none shadow-xl">
            Find a Restroom Nearby
          </Button>
          <Button size="xl" variant="outline" class="h-16 px-10 text-lg rounded-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white hover:text-white bg-transparent">
            List Your Restroom
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

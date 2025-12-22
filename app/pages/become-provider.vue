<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <!-- Hero Section -->
    <section class="container py-16 md:py-24">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
          Turn Your Bathroom Into Income
        </h1>
        <p class="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Join thousands of providers earning extra money by sharing their private bathrooms with people who need them.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button v-if="!isAuthenticated" size="lg" as-child>
            <NuxtLink to="/register?role=provider">Get Started</NuxtLink>
          </Button>
          <Button v-else-if="isProvider" size="lg" as-child>
            <NuxtLink to="/manage">Go to Provider Dashboard</NuxtLink>
          </Button>
          <Button v-else size="lg" @click="showApplicationForm = true">
            Apply to Become a Provider
          </Button>
          <Button variant="outline" size="lg" as-child>
            <NuxtLink to="#how-it-works">Learn More</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="container py-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl md:text-4xl font-bold text-primary mb-2">$500+</div>
          <p class="text-sm text-slate-600">Avg. monthly earnings</p>
        </div>
        <div class="text-center">
          <div class="text-3xl md:text-4xl font-bold text-primary mb-2">1000+</div>
          <p class="text-sm text-slate-600">Active providers</p>
        </div>
        <div class="text-center">
          <div class="text-3xl md:text-4xl font-bold text-primary mb-2">4.8</div>
          <p class="text-sm text-slate-600">Average rating</p>
        </div>
        <div class="text-center">
          <div class="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
          <p class="text-sm text-slate-600">Provider support</p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how-it-works" class="container py-16 scroll-mt-20">
      <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">How It Works</h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">1. Apply</h3>
          <p class="text-slate-600">Fill out our simple application form. Tell us about yourself and your space.</p>
        </div>
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">2. List Your Space</h3>
          <p class="text-slate-600">Once approved, add photos and details about your bathroom. Set your price and availability.</p>
        </div>
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign class="w-8 h-8 text-primary" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 mb-2">3. Start Earning</h3>
          <p class="text-slate-600">Accept bookings and get paid directly to your bank account via Stripe.</p>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="bg-slate-50 py-16">
      <div class="container">
        <h2 class="text-3xl font-bold text-slate-900 text-center mb-12">Why Become a Provider?</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardContent class="p-6">
              <Wallet class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Extra Income</h3>
              <p class="text-slate-600">Earn money from a space you already have. Set your own rates and schedule.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <Calendar class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Flexible Schedule</h3>
              <p class="text-slate-600">You control when your bathroom is available. Block off times that don't work for you.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <Shield class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Secure Payments</h3>
              <p class="text-slate-600">Get paid securely through Stripe with automatic direct deposits.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <Users class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Verified Users</h3>
              <p class="text-slate-600">All users are verified. You can review profiles before accepting bookings.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <MessageSquare class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">Easy Communication</h3>
              <p class="text-slate-600">Message guests directly through our platform. Clear instructions and expectations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent class="p-6">
              <Headphones class="w-10 h-10 text-primary mb-4" />
              <h3 class="text-lg font-semibold text-slate-900 mb-2">24/7 Support</h3>
              <p class="text-slate-600">Our support team is here to help you succeed as a provider.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="container py-16">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">Ready to Get Started?</h2>
        <p class="text-xl text-slate-600 mb-8">Join our community of providers and start earning today.</p>
        <Button v-if="!isAuthenticated" size="lg" as-child>
          <NuxtLink to="/register?role=provider">Create Provider Account</NuxtLink>
        </Button>
        <Button v-else-if="isProvider" size="lg" as-child>
          <NuxtLink to="/manage/properties/new">Add Your First Property</NuxtLink>
        </Button>
        <Button v-else size="lg" @click="showApplicationForm = true">
          Apply Now
        </Button>
      </div>
    </section>

    <!-- Application Modal -->
    <Teleport to="body">
      <div
        v-if="showApplicationForm"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="showApplicationForm = false"
      >
        <Card class="w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Provider Application</CardTitle>
            <CardDescription>Tell us about yourself and your space</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="business-name">Business Name (Optional)</Label>
              <Input
                id="business-name"
                v-model="applicationForm.businessName"
                placeholder="Your business or personal name"
              />
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="applicationForm.phone"
                type="tel"
                placeholder="(555) 555-5555"
              />
            </div>

            <div class="space-y-2">
              <Label for="property-count">How many bathrooms do you plan to list?</Label>
              <select
                id="property-count"
                v-model="applicationForm.propertyCount"
                class="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
              >
                <option value="1">1 bathroom</option>
                <option value="2-3">2-3 bathrooms</option>
                <option value="4-10">4-10 bathrooms</option>
                <option value="10+">More than 10</option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="description">Tell us about your space</Label>
              <Textarea
                id="description"
                v-model="applicationForm.description"
                rows="4"
                placeholder="Describe your bathroom(s), location, and why you want to become a provider..."
              />
            </div>

            <div class="flex items-start gap-2">
              <input
                id="agree-terms"
                v-model="applicationForm.agreeToTerms"
                type="checkbox"
                class="mt-1"
              />
              <Label for="agree-terms" class="text-sm font-normal">
                I agree to the <NuxtLink to="/terms" class="text-primary hover:underline">Terms of Service</NuxtLink>
                and <NuxtLink to="/privacy" class="text-primary hover:underline">Privacy Policy</NuxtLink>
              </Label>
            </div>
          </CardContent>
          <CardFooter class="flex gap-3">
            <Button variant="outline" class="flex-1" @click="showApplicationForm = false">
              Cancel
            </Button>
            <Button
              class="flex-1"
              :disabled="!canSubmit || isSubmitting"
              @click="submitApplication"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ClipboardList,
  Home,
  DollarSign,
  Wallet,
  Calendar,
  Shield,
  Users,
  MessageSquare,
  Headphones,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const { user, isAuthenticated, isProvider } = useAuth()
const payload = usePayload()
const { toast } = useToast()

const showApplicationForm = ref(false)
const isSubmitting = ref(false)

const applicationForm = ref({
  businessName: '',
  phone: '',
  propertyCount: '1',
  description: '',
  agreeToTerms: false,
})

const canSubmit = computed(() => {
  return applicationForm.value.phone.trim() &&
         applicationForm.value.description.trim() &&
         applicationForm.value.agreeToTerms
})

const submitApplication = async () => {
  if (!canSubmit.value || !user.value?.id) return

  isSubmitting.value = true
  try {
    // Update user to provider role with pending status
    await payload.update('users', user.value.id, {
      role: 'provider',
      phone: applicationForm.value.phone,
      providerInfo: {
        businessName: applicationForm.value.businessName || `${user.value.firstName}'s Bathroom`,
        businessType: 'individual',
        verified: false, // Will be set to true when admin approves
      },
    })

    toast.success('Application submitted! You can now add your first property.')
    showApplicationForm.value = false

    // Redirect to add first property
    navigateTo('/manage/properties/new')
  } catch (error) {
    console.error('Failed to submit application:', error)
    toast.error('Failed to submit application. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Building2,
  Clock,
  DollarSign,
  Save,
  Upload,
  Trash2,
  Plus,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
})

const route = useRoute()
const { user } = useAuth()
const stripe = useStripe()
const payload = usePayload()
const { toast } = useToast()

const activeTab = ref('profile')
const isSaving = ref(false)

// Stripe Connect state
const stripeLoading = ref(false)
const stripeStatus = ref<{
  hasAccount: boolean
  accountId?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  detailsSubmitted?: boolean
} | null>(null)
const showStripeMessage = ref(false)
const stripeMessageType = ref<'success' | 'error'>('success')

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
  { id: 'availability', label: 'Default Availability', icon: Clock },
  { id: 'security', label: 'Security', icon: Shield },
]

// Profile data - initialized from user
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  bio: '',
})

// Business data - from providerInfo
const business = ref({
  businessName: '',
  businessType: 'individual',
  taxId: '',
  address: '',
  city: '',
  state: '',
  zip: '',
})

// Notification settings
const notifications = ref({
  newBooking: { email: true, sms: true },
  bookingCancelled: { email: true, sms: false },
  newReview: { email: true, sms: false },
  payoutSent: { email: true, sms: true },
  lowRating: { email: true, sms: true },
  promotional: { email: false, sms: false },
})

// Availability settings
const availability = ref({
  defaultStartTime: '08:00',
  defaultEndTime: '22:00',
  minBookingDuration: 15,
  maxBookingDuration: 60,
  bufferBetweenBookings: 10,
  instantBooking: true,
  advanceNotice: 30,
})

// User initials for avatar
const userInitials = computed(() => {
  const first = user.value?.firstName?.[0] || ''
  const last = user.value?.lastName?.[0] || ''
  return `${first}${last}`.toUpperCase() || 'U'
})

// Initialize form data from user
const initFormData = () => {
  if (user.value) {
    profile.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      bio: user.value.bio || '',
    }

    if (user.value.providerInfo) {
      business.value = {
        businessName: user.value.providerInfo.businessName || '',
        businessType: user.value.providerInfo.businessType || 'individual',
        taxId: '',
        address: '',
        city: '',
        state: '',
        zip: '',
      }
    }
  }
}

// Watch for user changes
watch(() => user.value, initFormData, { immediate: true })

// Load Stripe Connect status on mount
onMounted(async () => {
  const router = useRouter()

  // Check for tab query param
  const tabParam = route.query.tab
  if (tabParam && typeof tabParam === 'string') {
    activeTab.value = tabParam
  }

  // Handle OAuth return
  const stripeParam = route.query.stripe
  if (stripeParam === 'complete') {
    showStripeMessage.value = true
    stripeMessageType.value = 'success'
    activeTab.value = 'payouts'

    // Remove query param but keep tab param if present
    router.replace({ query: { tab: 'payouts' } })
  } else if (stripeParam === 'refresh') {
    showStripeMessage.value = true
    stripeMessageType.value = 'error'
    activeTab.value = 'payouts'

    // Remove query param but keep tab param if present
    router.replace({ query: { tab: 'payouts' } })
  }

  // Load Stripe status
  await loadStripeStatus()
})

const loadStripeStatus = async () => {
  try {
    stripeLoading.value = true
    stripeStatus.value = await stripe.getConnectAccountStatus()
  } catch (error) {
    console.error('Error loading Stripe status:', error)
  } finally {
    stripeLoading.value = false
  }
}

const handleConnectStripe = async () => {
  try {
    stripeLoading.value = true
    const { url } = await stripe.createConnectOnboardingLink()
    window.location.href = url
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    stripeLoading.value = false
  }
}

const handleOpenStripeDashboard = async () => {
  try {
    stripeLoading.value = true
    const { url } = await stripe.createConnectLoginLink()
    window.open(url, '_blank')
  } catch (error) {
    console.error('Error creating login link:', error)
  } finally {
    stripeLoading.value = false
  }
}

const handleSave = async () => {
  if (!user.value?.id) return

  isSaving.value = true
  try {
    await payload.update('users', user.value.id, {
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      email: profile.value.email,
      phone: profile.value.phone,
      bio: profile.value.bio,
      providerInfo: {
        ...user.value.providerInfo,
        businessName: business.value.businessName,
        businessType: business.value.businessType,
      },
    })

    // Update local user state
    user.value = {
      ...user.value,
      firstName: profile.value.firstName,
      lastName: profile.value.lastName,
      email: profile.value.email,
      phone: profile.value.phone,
      bio: profile.value.bio,
      providerInfo: {
        ...user.value.providerInfo,
        businessName: business.value.businessName,
        businessType: business.value.businessType,
      },
    }

    toast.success('Settings saved successfully!')
  } catch (error) {
    console.error('Failed to save settings:', error)
    toast.error('Failed to save settings. Please try again.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Provider Settings</h1>
      <p class="text-slate-600 mt-1">Manage your account, business info, and preferences</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-slate-200">
      <nav class="flex gap-4 overflow-x-auto pb-px">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
          :class="activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Profile Tab -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Avatar -->
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
              {{ userInitials }}
            </div>
            <div class="space-y-2">
              <Button variant="outline" size="sm">
                <Upload class="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p class="text-xs text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <!-- Form -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input id="firstName" v-model="profile.firstName" />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input id="lastName" v-model="profile.lastName" />
            </div>
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" v-model="profile.email" />
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input id="phone" v-model="profile.phone" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <Label for="bio">Bio</Label>
              <Textarea id="bio" v-model="profile.bio" rows="3" />
              <p class="text-xs text-slate-500">{{ profile.bio.length }}/500 characters</p>
            </div>
          </div>

          <div class="flex justify-end">
            <Button @click="handleSave">
              <Save class="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Business Info Tab -->
    <div v-if="activeTab === 'business'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Your business details for tax and legal purposes</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="businessName">Business Name</Label>
              <Input id="businessName" v-model="business.businessName" />
            </div>
            <div class="space-y-2">
              <Label for="businessType">Business Type</Label>
              <select
                id="businessType"
                v-model="business.businessType"
                class="w-full h-10 px-3 rounded-md border border-slate-200 text-sm"
              >
                <option value="individual">Individual/Sole Proprietor</option>
                <option value="LLC">LLC</option>
                <option value="Corporation">Corporation</option>
                <option value="Partnership">Partnership</option>
              </select>
            </div>
            <div class="space-y-2">
              <Label for="taxId">Tax ID (EIN/SSN)</Label>
              <Input id="taxId" v-model="business.taxId" disabled />
              <p class="text-xs text-slate-500">Contact support to update</p>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-slate-900 mb-4">Business Address</h4>
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2 md:col-span-2">
                <Label for="address">Street Address</Label>
                <Input id="address" v-model="business.address" />
              </div>
              <div class="space-y-2">
                <Label for="city">City</Label>
                <Input id="city" v-model="business.city" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="state">State</Label>
                  <Input id="state" v-model="business.state" />
                </div>
                <div class="space-y-2">
                  <Label for="zip">ZIP Code</Label>
                  <Input id="zip" v-model="business.zip" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button @click="handleSave">
              <Save class="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Notifications Tab -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="grid grid-cols-3 gap-4 pb-2 border-b text-sm font-medium text-slate-600">
              <div>Notification Type</div>
              <div class="text-center">Email</div>
              <div class="text-center">SMS</div>
            </div>

            <div v-for="(setting, key) in notifications" :key="key" class="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
              <div class="text-sm text-slate-900">
                {{ key === 'newBooking' ? 'New Booking' :
                   key === 'bookingCancelled' ? 'Booking Cancelled' :
                   key === 'newReview' ? 'New Review' :
                   key === 'payoutSent' ? 'Payout Sent' :
                   key === 'lowRating' ? 'Low Rating Alert' :
                   'Promotional Updates' }}
              </div>
              <div class="flex justify-center">
                <button
                  @click="setting.email = !setting.email"
                  class="w-10 h-6 rounded-full transition-colors"
                  :class="setting.email ? 'bg-primary' : 'bg-slate-200'"
                >
                  <div
                    class="w-4 h-4 rounded-full bg-white shadow transform transition-transform mx-1"
                    :class="setting.email ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </div>
              <div class="flex justify-center">
                <button
                  @click="setting.sms = !setting.sms"
                  class="w-10 h-6 rounded-full transition-colors"
                  :class="setting.sms ? 'bg-primary' : 'bg-slate-200'"
                >
                  <div
                    class="w-4 h-4 rounded-full bg-white shadow transform transition-transform mx-1"
                    :class="setting.sms ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <Button @click="handleSave">
              <Save class="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Payout Settings Tab -->
    <div v-if="activeTab === 'payouts'" class="space-y-6">
      <!-- Success/Error Messages -->
      <div v-if="showStripeMessage" class="p-4 rounded-lg border" :class="stripeMessageType === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
        <div class="flex items-start gap-3">
          <CheckCircle2 v-if="stripeMessageType === 'success'" class="w-5 h-5 text-green-600 mt-0.5" />
          <XCircle v-else class="w-5 h-5 text-red-600 mt-0.5" />
          <div class="flex-1">
            <h3 class="font-medium" :class="stripeMessageType === 'success' ? 'text-green-900' : 'text-red-900'">
              {{ stripeMessageType === 'success' ? 'Stripe Connected Successfully!' : 'Stripe Connection Failed' }}
            </h3>
            <p class="text-sm mt-1" :class="stripeMessageType === 'success' ? 'text-green-700' : 'text-red-700'">
              {{ stripeMessageType === 'success'
                ? 'Your Stripe account has been connected. You can now receive payments.'
                : 'There was an issue connecting your Stripe account. Please try again.' }}
            </p>
          </div>
          <button @click="showStripeMessage = false" class="text-slate-400 hover:text-slate-600">
            <XCircle class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <Card v-if="stripeLoading && !stripeStatus">
        <CardContent class="py-12">
          <div class="flex flex-col items-center justify-center gap-3">
            <Loader2 class="w-8 h-8 text-primary animate-spin" />
            <p class="text-sm text-slate-600">Loading Stripe status...</p>
          </div>
        </CardContent>
      </Card>

      <!-- Not Connected State -->
      <Card v-else-if="!stripeStatus?.hasAccount">
        <CardHeader>
          <CardTitle>Connect with Stripe</CardTitle>
          <CardDescription>Start receiving payments from your bookings</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard class="w-6 h-6 text-blue-600" />
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-slate-900 mb-2">Why connect Stripe?</h4>
                <ul class="space-y-2 text-sm text-slate-600">
                  <li class="flex items-start gap-2">
                    <Check class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Receive payments directly to your bank account</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Check class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automatic payouts on your schedule</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Check class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Secure and PCI-compliant processing</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <Check class="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Track your earnings in real-time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div class="flex items-start gap-3">
              <AlertCircle class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div class="text-sm text-blue-900">
                <p class="font-medium mb-1">Quick setup in just a few minutes</p>
                <p class="text-blue-700">You'll be redirected to Stripe to securely connect your bank account and verify your identity.</p>
              </div>
            </div>
          </div>

          <Button @click="handleConnectStripe" :disabled="stripeLoading" class="w-full" size="lg">
            <Loader2 v-if="stripeLoading" class="w-5 h-5 mr-2 animate-spin" />
            <CreditCard v-else class="w-5 h-5 mr-2" />
            Connect with Stripe
          </Button>
        </CardContent>
      </Card>

      <!-- Connected State -->
      <template v-else>
        <!-- Account Status Card -->
        <Card>
          <CardHeader>
            <CardTitle>Stripe Account Status</CardTitle>
            <CardDescription>Your payout account information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <!-- Status Overview -->
            <div class="grid md:grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 rounded-lg border" :class="stripeStatus.detailsSubmitted ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-slate-700">Onboarding Status</span>
                  <CheckCircle2 v-if="stripeStatus.detailsSubmitted" class="w-5 h-5 text-green-600" />
                  <AlertCircle v-else class="w-5 h-5 text-yellow-600" />
                </div>
                <p class="text-lg font-semibold" :class="stripeStatus.detailsSubmitted ? 'text-green-900' : 'text-yellow-900'">
                  {{ stripeStatus.detailsSubmitted ? 'Complete' : 'Incomplete' }}
                </p>
                <p v-if="!stripeStatus.detailsSubmitted" class="text-xs text-yellow-700 mt-1">
                  Complete your setup to start receiving payments
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-lg border" :class="stripeStatus.chargesEnabled ? 'border-green-200 bg-green-50' : 'border-slate-200'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-slate-700">Charges Enabled</span>
                  <CheckCircle2 v-if="stripeStatus.chargesEnabled" class="w-5 h-5 text-green-600" />
                  <XCircle v-else class="w-5 h-5 text-slate-400" />
                </div>
                <p class="text-lg font-semibold" :class="stripeStatus.chargesEnabled ? 'text-green-900' : 'text-slate-900'">
                  {{ stripeStatus.chargesEnabled ? 'Active' : 'Inactive' }}
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-lg border" :class="stripeStatus.payoutsEnabled ? 'border-green-200 bg-green-50' : 'border-slate-200'">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-slate-700">Payouts Enabled</span>
                  <CheckCircle2 v-if="stripeStatus.payoutsEnabled" class="w-5 h-5 text-green-600" />
                  <XCircle v-else class="w-5 h-5 text-slate-400" />
                </div>
                <p class="text-lg font-semibold" :class="stripeStatus.payoutsEnabled ? 'text-green-900' : 'text-slate-900'">
                  {{ stripeStatus.payoutsEnabled ? 'Active' : 'Inactive' }}
                </p>
              </div>

              <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-slate-700">Account ID</span>
                </div>
                <p class="text-sm font-mono text-slate-600 truncate">
                  {{ stripeStatus.accountId }}
                </p>
              </div>
            </div>

            <!-- Warning if incomplete -->
            <div v-if="!stripeStatus.detailsSubmitted" class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div class="flex items-start gap-3">
                <AlertCircle class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                  <h4 class="font-medium text-yellow-900 mb-1">Complete your Stripe setup</h4>
                  <p class="text-sm text-yellow-700 mb-3">
                    Your Stripe account is not fully set up yet. Complete the onboarding process to start receiving payments.
                  </p>
                  <Button @click="handleConnectStripe" :disabled="stripeLoading" size="sm" variant="outline" class="border-yellow-300">
                    <Loader2 v-if="stripeLoading" class="w-4 h-4 mr-2 animate-spin" />
                    Complete Setup
                  </Button>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3">
              <Button @click="handleOpenStripeDashboard" :disabled="stripeLoading" variant="outline" class="flex-1">
                <Loader2 v-if="stripeLoading" class="w-4 h-4 mr-2 animate-spin" />
                <ExternalLink v-else class="w-4 h-4 mr-2" />
                Open Stripe Dashboard
              </Button>
              <Button @click="loadStripeStatus" :disabled="stripeLoading" variant="outline">
                <Loader2 v-if="stripeLoading" class="w-4 h-4 mr-2 animate-spin" />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Payout Information -->
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
            <CardDescription>Manage your payout settings in Stripe Dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign class="w-5 h-5 text-blue-600" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-slate-900 mb-1">Bank Account & Payout Schedule</p>
                  <p class="text-sm text-slate-600 mb-3">
                    Your bank account details and payout schedule are managed through your Stripe Dashboard for security.
                  </p>
                  <Button @click="handleOpenStripeDashboard" :disabled="stripeLoading" size="sm" variant="link" class="p-0 h-auto">
                    Manage in Stripe Dashboard
                    <ExternalLink class="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Earnings Link -->
        <Card>
          <CardHeader>
            <CardTitle>View Your Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p class="font-medium text-slate-900">Track your earnings and payouts</p>
                <p class="text-sm text-slate-500">View detailed breakdown of your booking revenue</p>
              </div>
              <Button @click="navigateTo('/manage/earnings')" variant="outline">
                View Earnings
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </template>
    </div>

    <!-- Default Availability Tab -->
    <div v-if="activeTab === 'availability'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Default Availability Settings</CardTitle>
          <CardDescription>Set default hours and booking rules for new properties</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="startTime">Default Start Time</Label>
              <Input id="startTime" type="time" v-model="availability.defaultStartTime" />
            </div>
            <div class="space-y-2">
              <Label for="endTime">Default End Time</Label>
              <Input id="endTime" type="time" v-model="availability.defaultEndTime" />
            </div>
            <div class="space-y-2">
              <Label for="minDuration">Minimum Booking Duration (minutes)</Label>
              <Input id="minDuration" type="number" v-model="availability.minBookingDuration" min="5" step="5" />
            </div>
            <div class="space-y-2">
              <Label for="maxDuration">Maximum Booking Duration (minutes)</Label>
              <Input id="maxDuration" type="number" v-model="availability.maxBookingDuration" min="15" step="15" />
            </div>
            <div class="space-y-2">
              <Label for="buffer">Buffer Between Bookings (minutes)</Label>
              <Input id="buffer" type="number" v-model="availability.bufferBetweenBookings" min="0" step="5" />
            </div>
            <div class="space-y-2">
              <Label for="notice">Advance Notice Required (minutes)</Label>
              <Input id="notice" type="number" v-model="availability.advanceNotice" min="0" step="15" />
            </div>
          </div>

          <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p class="font-medium text-slate-900">Instant Booking</p>
              <p class="text-sm text-slate-500">Allow guests to book without approval</p>
            </div>
            <button
              @click="availability.instantBooking = !availability.instantBooking"
              class="w-12 h-7 rounded-full transition-colors"
              :class="availability.instantBooking ? 'bg-primary' : 'bg-slate-200'"
            >
              <div
                class="w-5 h-5 rounded-full bg-white shadow transform transition-transform mx-1"
                :class="availability.instantBooking ? 'translate-x-5' : 'translate-x-0'"
              />
            </button>
          </div>

          <div class="flex justify-end">
            <Button @click="handleSave">
              <Save class="w-4 h-4 mr-2" />
              Save Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Security Tab -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password regularly for security</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <Label for="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" />
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-900">SMS Authentication</p>
              <p class="text-sm text-slate-500">Receive a code via SMS when signing in</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
        </CardContent>
      </Card>

      <Card class="border-red-200">
        <CardHeader>
          <CardTitle class="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p class="font-medium text-red-900">Deactivate Provider Account</p>
              <p class="text-sm text-red-600">Pause all listings and stop accepting bookings</p>
            </div>
            <Button variant="outline" class="border-red-300 text-red-600 hover:bg-red-50">
              Deactivate
            </Button>
          </div>
          <div class="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p class="font-medium text-red-900">Delete Account</p>
              <p class="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive">
              <Trash2 class="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  Check
} from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-provider',
})

const activeTab = ref('profile')

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business Info', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payouts', label: 'Payout Settings', icon: CreditCard },
  { id: 'availability', label: 'Default Availability', icon: Clock },
  { id: 'security', label: 'Security', icon: Shield },
]

// Mock profile data
const profile = ref({
  firstName: 'Michael',
  lastName: 'Chen',
  email: 'michael@provider.com',
  phone: '+1 (555) 123-4567',
  bio: 'Property owner with multiple clean and accessible bathroom facilities in the downtown area.',
})

// Mock business data
const business = ref({
  businessName: 'Chen Properties LLC',
  businessType: 'LLC',
  taxId: '**-***1234',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zip: '10001',
})

// Mock payout data
const payout = ref({
  bankName: 'Chase Bank',
  accountType: 'Checking',
  accountLast4: '4567',
  routingLast4: '9012',
  payoutSchedule: 'weekly',
})

// Mock notification settings
const notifications = ref({
  newBooking: { email: true, sms: true },
  bookingCancelled: { email: true, sms: false },
  newReview: { email: true, sms: false },
  payoutSent: { email: true, sms: true },
  lowRating: { email: true, sms: true },
  promotional: { email: false, sms: false },
})

// Mock availability settings
const availability = ref({
  defaultStartTime: '08:00',
  defaultEndTime: '22:00',
  minBookingDuration: 15,
  maxBookingDuration: 60,
  bufferBetweenBookings: 10,
  instantBooking: true,
  advanceNotice: 30,
})

const handleSave = () => {
  console.log('Saving settings...')
  // Add save logic here
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
              MC
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
      <Card>
        <CardHeader>
          <CardTitle>Payout Method</CardTitle>
          <CardDescription>Manage how you receive your earnings</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Current Bank Account -->
          <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p class="font-medium text-slate-900">{{ payout.bankName }}</p>
                  <p class="text-sm text-slate-600">{{ payout.accountType }} •••• {{ payout.accountLast4 }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                  <Check class="w-3 h-3" />
                  Verified
                </span>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </div>

          <!-- Payout Schedule -->
          <div class="space-y-3">
            <Label>Payout Schedule</Label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="schedule in ['daily', 'weekly', 'monthly']"
                :key="schedule"
                @click="payout.payoutSchedule = schedule"
                class="p-4 rounded-lg border-2 transition-colors text-center"
                :class="payout.payoutSchedule === schedule
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 hover:border-slate-300'"
              >
                <p class="font-medium capitalize">{{ schedule }}</p>
                <p class="text-xs text-slate-500 mt-1">
                  {{ schedule === 'daily' ? 'Every business day' :
                     schedule === 'weekly' ? 'Every Monday' :
                     'First of month' }}
                </p>
              </button>
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

      <!-- Payout History -->
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p class="font-medium text-slate-900">${{ (Math.random() * 500 + 100).toFixed(2) }}</p>
                <p class="text-sm text-slate-500">{{ new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString() }}</p>
              </div>
              <span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Completed</span>
            </div>
          </div>
          <Button variant="link" class="mt-4 p-0" @click="navigateTo('/manage/earnings')">
            View all payouts →
          </Button>
        </CardContent>
      </Card>
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

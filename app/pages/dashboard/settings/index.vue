<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Account Settings</h1>
      <p class="mt-1 text-slate-600">Manage your account preferences and settings</p>
    </div>

    <!-- Settings Tabs -->
    <Tabs v-model="activeTab" class="space-y-6">
      <TabsList class="grid w-full grid-cols-2 lg:grid-cols-4">
        <TabsTrigger value="profile">
          <User class="w-4 h-4 mr-2" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell class="w-4 h-4 mr-2" />
          Notifications
        </TabsTrigger>
        <TabsTrigger value="payment">
          <CreditCard class="w-4 h-4 mr-2" />
          Payment
        </TabsTrigger>
        <TabsTrigger value="security">
          <Shield class="w-4 h-4 mr-2" />
          Security
        </TabsTrigger>
      </TabsList>

      <!-- Profile Tab -->
      <TabsContent value="profile">
        <div class="space-y-6">
          <!-- Personal Information -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div class="flex items-start gap-6 mb-6">
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                    <User class="w-12 h-12 text-slate-400" />
                  </div>
                  <Button variant="outline" size="sm" class="mt-3 w-24">
                    Change
                  </Button>
                </div>
                <div class="flex-1 space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label for="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        v-model="profile.firstName"
                        placeholder="Enter first name"
                        class="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label for="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        v-model="profile.lastName"
                        placeholder="Enter last name"
                        class="mt-1.5"
                      />
                    </div>
                  </div>
                  <div>
                    <Label for="email">Email Address</Label>
                    <Input
                      id="email"
                      v-model="profile.email"
                      type="email"
                      placeholder="Enter email"
                      class="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label for="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      v-model="profile.phone"
                      type="tel"
                      placeholder="Enter phone number"
                      class="mt-1.5"
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button variant="outline" @click="cancelProfileChanges">Cancel</Button>
                <Button @click="saveProfile">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <!-- About -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div>
                <Label for="bio">Bio</Label>
                <Textarea
                  id="bio"
                  v-model="profile.bio"
                  placeholder="Tell us a bit about yourself"
                  rows="4"
                  class="mt-1.5"
                />
                <p class="text-xs text-slate-500 mt-1.5">{{ profile.bio.length }}/500 characters</p>
              </div>
              <div class="flex justify-end gap-3 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Notifications Tab -->
      <TabsContent value="notifications">
        <Card>
          <CardHeader class="border-b border-slate-200">
            <CardTitle>Notification Preferences</CardTitle>
            <p class="text-sm text-slate-600 mt-1">Choose how you want to be notified</p>
          </CardHeader>
          <CardContent class="p-6">
            <div class="space-y-6">
              <!-- Booking Notifications -->
              <div>
                <h3 class="text-sm font-semibold text-slate-900 mb-4">Booking Updates</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Booking Confirmations</p>
                      <p class="text-xs text-slate-600 mt-0.5">Get notified when your booking is confirmed</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.bookingConfirmEmail" class="rounded" />
                        Email
                      </label>
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.bookingConfirmSms" class="rounded" />
                        SMS
                      </label>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Booking Reminders</p>
                      <p class="text-xs text-slate-600 mt-0.5">Reminders before your scheduled booking</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.bookingReminderEmail" class="rounded" />
                        Email
                      </label>
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.bookingReminderSms" class="rounded" />
                        SMS
                      </label>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Cancellation Alerts</p>
                      <p class="text-xs text-slate-600 mt-0.5">Updates when a booking is cancelled</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.cancellationEmail" class="rounded" />
                        Email
                      </label>
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.cancellationSms" class="rounded" />
                        SMS
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-slate-200 pt-6">
                <h3 class="text-sm font-semibold text-slate-900 mb-4">Messages & Reviews</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">New Messages</p>
                      <p class="text-xs text-slate-600 mt-0.5">Notifications when you receive messages</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.messagesEmail" class="rounded" />
                        Email
                      </label>
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.messagesSms" class="rounded" />
                        SMS
                      </label>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Review Reminders</p>
                      <p class="text-xs text-slate-600 mt-0.5">Reminders to leave reviews after bookings</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.reviewsEmail" class="rounded" />
                        Email
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="border-t border-slate-200 pt-6">
                <h3 class="text-sm font-semibold text-slate-900 mb-4">Marketing</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Promotions & Offers</p>
                      <p class="text-xs text-slate-600 mt-0.5">Special deals and discounts</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.promotionsEmail" class="rounded" />
                        Email
                      </label>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <p class="text-sm font-medium text-slate-900">Newsletter</p>
                      <p class="text-xs text-slate-600 mt-0.5">Updates and tips from MyWaterCloset</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <label class="flex items-center gap-2 text-xs text-slate-600">
                        <input type="checkbox" v-model="notifications.newsletterEmail" class="rounded" />
                        Email
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-6 border-t border-slate-200">
                <Button variant="outline">Cancel</Button>
                <Button @click="saveNotifications">Save Preferences</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Payment Tab -->
      <TabsContent value="payment">
        <div class="space-y-6">
          <!-- Payment Methods -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <div class="flex items-center justify-between">
                <CardTitle>Payment Methods</CardTitle>
                <Button size="sm" @click="addPaymentMethod">
                  <Plus class="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </CardHeader>
            <CardContent class="p-6">
              <div class="space-y-4">
                <div
                  v-for="card in paymentMethods"
                  :key="card.id"
                  class="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                >
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      <CreditCard class="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p class="font-medium text-slate-900">{{ card.brand }} •••• {{ card.last4 }}</p>
                      <p class="text-sm text-slate-600">Expires {{ card.expiry }}</p>
                    </div>
                    <span
                      v-if="card.default"
                      class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded"
                    >
                      Default
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Button
                      v-if="!card.default"
                      variant="outline"
                      size="sm"
                      @click="setDefaultCard(card.id)"
                    >
                      Set Default
                    </Button>
                    <Button variant="ghost" size="sm" @click="removeCard(card.id)">
                      <Trash2 class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Billing History -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div class="space-y-3">
                <div
                  v-for="transaction in billingHistory"
                  :key="transaction.id"
                  class="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-900">{{ transaction.description }}</p>
                    <p class="text-xs text-slate-600">{{ transaction.date }}</p>
                  </div>
                  <div class="flex items-center gap-4">
                    <span class="text-sm font-semibold text-slate-900">${{ transaction.amount }}</span>
                    <Button variant="ghost" size="sm">
                      <Download class="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Security Tab -->
      <TabsContent value="security">
        <div class="space-y-6">
          <!-- Change Password -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent class="p-6">
              <div class="space-y-4 max-w-md">
                <div>
                  <Label for="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    v-model="security.currentPassword"
                    type="password"
                    placeholder="Enter current password"
                    class="mt-1.5"
                  />
                </div>
                <div>
                  <Label for="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    v-model="security.newPassword"
                    type="password"
                    placeholder="Enter new password"
                    class="mt-1.5"
                  />
                </div>
                <div>
                  <Label for="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    v-model="security.confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    class="mt-1.5"
                  />
                </div>
                <Button @click="changePassword">Update Password</Button>
              </div>
            </CardContent>
          </Card>

          <!-- Two-Factor Authentication -->
          <Card>
            <CardHeader class="border-b border-slate-200">
              <CardTitle>Two-Factor Authentication</CardTitle>
              <p class="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
            </CardHeader>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-900">Two-factor authentication is currently disabled</p>
                  <p class="text-xs text-slate-600 mt-1">Protect your account with 2FA via SMS or authenticator app</p>
                </div>
                <Button variant="outline" @click="enable2FA">Enable 2FA</Button>
              </div>
            </CardContent>
          </Card>

          <!-- Delete Account -->
          <Card class="border-red-200">
            <CardHeader class="border-b border-red-200 bg-red-50">
              <CardTitle class="text-red-700">Delete Account</CardTitle>
              <p class="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
            </CardHeader>
            <CardContent class="p-6">
              <p class="text-sm text-slate-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="outline" class="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300" @click="deleteAccount">
                <Trash2 class="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Plus,
  Trash2,
  Download,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

definePageMeta({
  layout: 'dashboard-user',
})

const activeTab = ref('profile')

// Profile data
const profile = ref({
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.j@example.com',
  phone: '+1 (555) 123-4567',
  bio: 'Frequent traveler and bathroom enthusiast. Always on the lookout for clean and comfortable facilities!',
})

// Notification preferences
const notifications = ref({
  bookingConfirmEmail: true,
  bookingConfirmSms: true,
  bookingReminderEmail: true,
  bookingReminderSms: false,
  cancellationEmail: true,
  cancellationSms: true,
  messagesEmail: true,
  messagesSms: false,
  reviewsEmail: true,
  promotionsEmail: false,
  newsletterEmail: true,
})

// Payment methods
const paymentMethods = ref([
  {
    id: 1,
    brand: 'Visa',
    last4: '4242',
    expiry: '12/2026',
    default: true,
  },
  {
    id: 2,
    brand: 'Mastercard',
    last4: '5555',
    expiry: '08/2025',
    default: false,
  },
])

// Billing history
const billingHistory = ref([
  {
    id: 1,
    description: 'Booking at Luxury Downtown Restroom',
    date: 'Dec 18, 2025',
    amount: 15,
  },
  {
    id: 2,
    description: 'Booking at Cozy Cafe Bathroom',
    date: 'Dec 15, 2025',
    amount: 8,
  },
  {
    id: 3,
    description: 'Booking at Modern Office Restroom',
    date: 'Dec 10, 2025',
    amount: 12,
  },
  {
    id: 4,
    description: 'Booking at Premium Hotel Facilities',
    date: 'Dec 5, 2025',
    amount: 20,
  },
])

// Security
const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Actions
const saveProfile = () => {
  alert('Profile saved successfully!')
}

const cancelProfileChanges = () => {
  alert('Changes cancelled')
}

const saveNotifications = () => {
  alert('Notification preferences saved!')
}

const addPaymentMethod = () => {
  alert('Add payment method modal')
}

const setDefaultCard = (id: number) => {
  paymentMethods.value.forEach(card => {
    card.default = card.id === id
  })
}

const removeCard = (id: number) => {
  if (confirm('Are you sure you want to remove this card?')) {
    const index = paymentMethods.value.findIndex(c => c.id === id)
    if (index !== -1) {
      paymentMethods.value.splice(index, 1)
    }
  }
}

const changePassword = () => {
  if (security.value.newPassword !== security.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  alert('Password changed successfully!')
  security.value.currentPassword = ''
  security.value.newPassword = ''
  security.value.confirmPassword = ''
}

const enable2FA = () => {
  alert('Enable 2FA modal')
}

const deleteAccount = () => {
  if (confirm('Are you absolutely sure? This action cannot be undone.')) {
    alert('Account deletion process initiated')
  }
}
</script>

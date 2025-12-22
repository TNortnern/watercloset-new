<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Profile Settings</h1>
      <p class="mt-1 text-slate-600">Manage your account information and preferences</p>
    </div>

    <!-- Avatar Upload Modal -->
    <Teleport to="body">
      <div
        v-if="showAvatarUpload"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        @click.self="showAvatarUpload = false"
      >
        <Card class="w-full max-w-md">
          <CardHeader>
            <CardTitle>Update Profile Photo</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <ImageUpload
              v-model="avatarFile"
              :multiple="false"
              placeholder="Upload a new profile photo"
              :max-size-mb="5"
              @update:model-value="handleAvatarChange"
            />
            <div class="flex justify-end">
              <Button variant="outline" @click="showAvatarUpload = false">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Teleport>

    <!-- Profile Header Card -->
    <Card v-if="profile">
      <CardContent class="p-6">
        <div class="flex flex-col sm:flex-row items-start gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button
              class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              @click="uploadAvatar"
            >
              <Camera class="w-6 h-6 text-white" />
            </button>
          </div>

          <!-- Basic Info -->
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-slate-900">{{ profile.name }}</h2>
            <p class="text-slate-600">{{ profile.email }}</p>
            <div class="flex flex-wrap gap-4 mt-3">
              <div class="flex items-center text-sm text-slate-600">
                <Calendar class="w-4 h-4 mr-1.5" />
                Joined {{ profile.joinedDate }}
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <MapPin class="w-4 h-4 mr-1.5" />
                {{ profile.location }}
              </div>
              <div class="flex items-center text-sm text-slate-600">
                <Shield class="w-4 h-4 mr-1.5" />
                Verified User
              </div>
            </div>
            <div class="flex gap-4 mt-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-slate-900">{{ profile.stats.bookings }}</div>
                <div class="text-xs text-slate-600">Bookings</div>
              </div>
              <div class="text-center border-l border-slate-200 pl-4">
                <div class="text-2xl font-bold text-slate-900">{{ profile.stats.reviews }}</div>
                <div class="text-xs text-slate-600">Reviews</div>
              </div>
              <div class="text-center border-l border-slate-200 pl-4">
                <div class="flex items-center gap-1">
                  <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span class="text-2xl font-bold text-slate-900">{{ profile.stats.rating }}</span>
                </div>
                <div class="text-xs text-slate-600">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Personal Information -->
    <Card>
      <CardHeader class="border-b border-slate-200">
        <div class="flex items-center justify-between">
          <CardTitle class="text-xl">Personal Information</CardTitle>
          <Button
            v-if="!isEditingPersonal"
            variant="ghost"
            size="sm"
            @click="isEditingPersonal = true"
          >
            <Edit2 class="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent class="p-6">
        <form @submit.prevent="savePersonalInfo" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="firstName">First Name</Label>
              <Input
                id="firstName"
                v-model="formData.firstName"
                :disabled="!isEditingPersonal"
              />
            </div>
            <div class="space-y-2">
              <Label for="lastName">Last Name</Label>
              <Input
                id="lastName"
                v-model="formData.lastName"
                :disabled="!isEditingPersonal"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              :disabled="!isEditingPersonal"
            />
          </div>

          <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <Input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :disabled="!isEditingPersonal"
            />
          </div>

          <div class="space-y-2">
            <Label for="location">Location</Label>
            <Input
              id="location"
              v-model="formData.location"
              :disabled="!isEditingPersonal"
            />
          </div>

          <div class="space-y-2">
            <Label for="bio">Bio</Label>
            <Textarea
              id="bio"
              v-model="formData.bio"
              :disabled="!isEditingPersonal"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div v-if="isEditingPersonal" class="flex gap-3">
            <Button type="submit">
              <Save class="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" @click="cancelEditPersonal">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <!-- Notification Preferences -->
    <Card>
      <CardHeader class="border-b border-slate-200">
        <CardTitle class="text-xl">Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to be notified</CardDescription>
      </CardHeader>
      <CardContent class="p-6">
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <input
              id="emailBookings"
              v-model="notifications.emailBookings"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="emailBookings" class="font-medium cursor-pointer">Booking Confirmations</Label>
              <p class="text-sm text-slate-600">Receive email notifications for booking confirmations and updates</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              id="emailMessages"
              v-model="notifications.emailMessages"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="emailMessages" class="font-medium cursor-pointer">Messages</Label>
              <p class="text-sm text-slate-600">Get notified when you receive new messages</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              id="emailPromotions"
              v-model="notifications.emailPromotions"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="emailPromotions" class="font-medium cursor-pointer">Promotions & Tips</Label>
              <p class="text-sm text-slate-600">Receive special offers and helpful bathroom-finding tips</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              id="smsNotifications"
              v-model="notifications.smsNotifications"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="smsNotifications" class="font-medium cursor-pointer">SMS Notifications</Label>
              <p class="text-sm text-slate-600">Get text messages for urgent booking updates</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              id="pushNotifications"
              v-model="notifications.pushNotifications"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="pushNotifications" class="font-medium cursor-pointer">Push Notifications</Label>
              <p class="text-sm text-slate-600">Receive push notifications on your devices</p>
            </div>
          </div>

          <div class="pt-4">
            <Button @click="saveNotifications">
              <Save class="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Payment Methods -->
    <Card>
      <CardHeader class="border-b border-slate-200">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-xl">Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods for bookings</CardDescription>
          </div>
          <Button size="sm" @click="addPaymentMethod">
            <Plus class="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>
      </CardHeader>
      <CardContent class="p-6">
        <div class="space-y-3">
          <div
            v-for="card in paymentMethods"
            :key="card.id"
            class="flex items-center gap-4 p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
          >
            <div class="p-3 bg-slate-100 rounded-lg">
              <CreditCard class="w-6 h-6 text-slate-600" />
            </div>
            <div class="flex-1">
              <div class="font-medium text-slate-900">{{ card.type }} •••• {{ card.last4 }}</div>
              <div class="text-sm text-slate-600">Expires {{ card.expiry }}</div>
            </div>
            <div v-if="card.default" class="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              Default
            </div>
            <Button variant="ghost" size="sm" @click="removePaymentMethod(card.id)">
              <Trash2 class="w-4 h-4 text-red-600" />
            </Button>
          </div>

          <div v-if="paymentMethods.length === 0" class="text-center py-8">
            <CreditCard class="w-12 h-12 mx-auto text-slate-300" />
            <p class="mt-2 text-slate-600">No payment methods added</p>
            <Button class="mt-4" variant="outline" @click="addPaymentMethod">
              <Plus class="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Security -->
    <Card>
      <CardHeader class="border-b border-slate-200">
        <CardTitle class="text-xl">Security</CardTitle>
        <CardDescription>Manage your password and security settings</CardDescription>
      </CardHeader>
      <CardContent class="p-6">
        <div class="space-y-4">
          <Button variant="outline" @click="changePassword">
            <Lock class="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <div class="flex items-start gap-3 pt-4 border-t border-slate-200">
            <input
              id="twoFactor"
              v-model="security.twoFactor"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <Label for="twoFactor" class="font-medium cursor-pointer">Two-Factor Authentication</Label>
              <p class="text-sm text-slate-600">Add an extra layer of security to your account</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Danger Zone -->
    <Card class="border-red-200">
      <CardHeader class="border-b border-red-200 bg-red-50">
        <CardTitle class="text-xl text-red-900">Danger Zone</CardTitle>
        <CardDescription class="text-red-700">Irreversible actions</CardDescription>
      </CardHeader>
      <CardContent class="p-6">
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-slate-900">Delete Account</h4>
            <p class="text-sm text-slate-600 mt-1">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="outline" class="mt-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300" @click="deleteAccount">
              <Trash2 class="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar,
  MapPin,
  Star,
  Shield,
  Camera,
  Edit2,
  Save,
  CreditCard,
  Plus,
  Trash2,
  Lock,
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/upload'

definePageMeta({
  layout: 'dashboard-user',
})

const { user, displayName } = useAuth()
const payload = usePayload()
const { toast } = useToast()
const { confirm } = useConfirm()

// Fetch user's bookings for stats
const { data: bookingsData } = await useAsyncData(
  'profile-bookings-stats',
  async () => {
    if (!user.value?.id) return null
    return await payload.find('bookings', {
      where: { user: { equals: user.value.id } },
      limit: 1000,
    })
  },
  { watch: [() => user.value?.id] }
)

// Calculate profile stats
const stats = computed(() => {
  const bookings = bookingsData.value?.docs || []
  return {
    bookings: bookings.length,
    reviews: 0, // TODO: Implement when reviews are available
    rating: 0, // TODO: Calculate average rating from reviews
  }
})

// Profile display data
const profile = computed(() => {
  if (!user.value) return null

  const joinDate = user.value.createdAt
    ? new Date(user.value.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently'

  return {
    name: displayName.value,
    email: user.value.email,
    avatar: user.value.avatar?.url || 'https://i.pravatar.cc/150?img=5',
    joinedDate: joinDate,
    location: 'New York, NY', // TODO: Add location field to user schema if needed
    stats: stats.value,
  }
})

// Form states
const isEditingPersonal = ref(false)
const isSaving = ref(false)

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
})

// Initialize form data when user is available
const initFormData = () => {
  if (user.value) {
    formData.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      location: '',
      bio: user.value.bio || '',
    }
  }
}

// Watch for user changes and initialize form
watch(() => user.value, initFormData, { immediate: true })

const originalFormData = computed(() => ({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  location: '',
  bio: user.value?.bio || '',
}))

// Notifications - these would be stored in user preferences
const notifications = ref({
  emailBookings: true,
  emailMessages: true,
  emailPromotions: false,
  smsNotifications: true,
  pushNotifications: true,
})

// Payment methods - TODO: Implement when Stripe is integrated
const paymentMethods = ref([])

// Security
const security = ref({
  twoFactor: false,
})

// Avatar upload state
const showAvatarUpload = ref(false)
const avatarFile = ref<{ url: string; id?: string | number } | null>(null)

// Actions
const uploadAvatar = () => {
  showAvatarUpload.value = true
}

const handleAvatarChange = async (file: { url: string; id?: string | number } | null) => {
  if (!file || !user.value?.id) return

  if (!file.id) {
    toast.error('Failed to upload image. Please try again.')
    return
  }

  try {
    await payload.update('users', user.value.id, {
      avatar: file.id,
    })

    user.value = {
      ...user.value,
      avatar: { url: file.url, id: file.id },
    }

    showAvatarUpload.value = false
    avatarFile.value = null
    toast.success('Avatar updated successfully!')
  } catch (error) {
    console.error('Failed to update avatar:', error)
    toast.error('Failed to update avatar. Please try again.')
  }
}

const savePersonalInfo = async () => {
  if (!user.value?.id) return

  isSaving.value = true
  try {
    await payload.update('users', user.value.id, {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phone: formData.value.phone,
      bio: formData.value.bio,
    })

    // Update local user state
    user.value = {
      ...user.value,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      email: formData.value.email,
      phone: formData.value.phone,
      bio: formData.value.bio,
    }

    isEditingPersonal.value = false
    toast.success('Profile updated successfully!')
  } catch (error) {
    console.error('Failed to update profile:', error)
    toast.error('Failed to update profile. Please try again.')
  } finally {
    isSaving.value = false
  }
}

const cancelEditPersonal = () => {
  formData.value = { ...originalFormData }
  isEditingPersonal.value = false
}

const saveNotifications = async () => {
  // TODO: Implement notification preferences update
  toast.success('Notification preferences saved!')
}

const addPaymentMethod = () => {
  // TODO: Implement Stripe payment method addition
  toast.info('Payment method feature coming soon')
}

const removePaymentMethod = async (id: number) => {
  const confirmed = await confirm({
    title: 'Remove Payment Method',
    message: 'Are you sure you want to remove this payment method?',
    confirmText: 'Remove',
    variant: 'destructive',
  })

  if (confirmed) {
    const index = paymentMethods.value.findIndex(m => m.id === id)
    if (index > -1) {
      paymentMethods.value.splice(index, 1)
      toast.success('Payment method removed')
    }
  }
}

const changePassword = () => {
  // TODO: Implement password change
  toast.info('Password change feature coming soon')
}

const deleteAccount = async () => {
  const firstConfirm = await confirm({
    title: 'Delete Account',
    message: 'Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone.',
    confirmText: 'Yes, Delete',
    variant: 'destructive',
  })

  if (!firstConfirm) return

  const secondConfirm = await confirm({
    title: 'Final Confirmation',
    message: 'This will permanently delete all your bookings, messages, and reviews. Continue?',
    confirmText: 'Delete Everything',
    variant: 'destructive',
  })

  if (secondConfirm) {
    // TODO: Implement account deletion
    toast.info('Account deletion feature coming soon')
  }
}
</script>

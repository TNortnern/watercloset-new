<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Platform Settings</h1>
      <p class="text-gray-600 mt-1">Configure platform-wide settings and preferences</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Commission Rates -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-blue-50 rounded-lg">
            <DollarSign class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Commission Rates</h2>
            <p class="text-sm text-gray-600">Configure platform commission structure</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission (%)
            </label>
            <div class="relative">
              <input
                v-model="settings.platformCommission"
                type="number"
                min="0"
                max="100"
                step="0.5"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Commission charged on each booking
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Provider Payout (%)
            </label>
            <div class="relative">
              <input
                :value="100 - settings.platformCommission"
                type="number"
                disabled
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
              />
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                %
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Automatically calculated based on commission
            </p>
          </div>

          <div class="bg-blue-50 rounded-lg p-4">
            <div class="flex items-start space-x-2">
              <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-blue-900">Example Calculation</p>
                <p class="text-sm text-blue-700 mt-1">
                  For a $100 booking with {{ settings.platformCommission }}% commission:
                  <br />Platform earns: ${{ (100 * settings.platformCommission / 100).toFixed(2) }}
                  <br />Provider receives: ${{ (100 - (100 * settings.platformCommission / 100)).toFixed(2) }}
                </p>
              </div>
            </div>
          </div>

          <button @click="console.log('Save commission settings:', settings.platformCommission)" class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Save class="w-4 h-4" />
            <span>Save Commission Settings</span>
          </button>
        </div>
      </div>

      <!-- Featured Property Management -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-yellow-50 rounded-lg">
            <Star class="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Featured Properties</h2>
            <p class="text-sm text-gray-600">Manage featured listings</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Max Featured Properties
            </label>
            <input
              v-model="settings.maxFeaturedProperties"
              type="number"
              min="0"
              max="50"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p class="text-xs text-gray-500 mt-2">
              Maximum number of properties that can be featured simultaneously
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Featured Property Fee (per month)
            </label>
            <div class="relative">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </div>
              <input
                v-model="settings.featuredPropertyFee"
                type="number"
                min="0"
                step="10"
                class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p class="text-xs text-gray-500 mt-2">
              Monthly fee for featured listing placement
            </p>
          </div>

          <div class="bg-yellow-50 rounded-lg p-4">
            <div class="flex items-start space-x-2">
              <Star class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-yellow-900">Currently Featured</p>
                <p class="text-sm text-yellow-700 mt-1">
                  {{ featuredProperties.length }} of {{ settings.maxFeaturedProperties }} slots used
                </p>
              </div>
            </div>
          </div>

          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div v-for="property in featuredProperties" :key="property.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div class="flex items-center space-x-3">
                <Building2 class="w-4 h-4 text-gray-600" />
                <span class="text-sm font-medium text-gray-900">{{ property.name }}</span>
              </div>
              <button @click="removeFeatured(property.id)" class="text-red-600 hover:text-red-700">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button @click="console.log('Save featured settings:', { max: settings.maxFeaturedProperties, fee: settings.featuredPropertyFee })" class="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Save class="w-4 h-4" />
            <span>Save Featured Settings</span>
          </button>
        </div>
      </div>

      <!-- Email Templates -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-purple-50 rounded-lg">
            <Mail class="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Email Templates</h2>
            <p class="text-sm text-gray-600">Customize automated emails</p>
          </div>
        </div>

        <div class="space-y-3">
          <button
            v-for="template in emailTemplates"
            :key="template.key"
            @click="selectedTemplate = template"
            class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            <div>
              <p class="text-sm font-medium text-gray-900">{{ template.name }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ template.description }}</p>
            </div>
            <ChevronRight class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div class="mt-4 bg-purple-50 rounded-lg p-4">
          <div class="flex items-start space-x-2">
            <Info class="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-medium text-purple-900">Template Variables</p>
              <p class="text-sm text-purple-700 mt-1">
                Use {{'{'}}{'{name}'}{'}}'}, {{'{'}}{'{email}'}{'}}'}, {{'{'}}{'{date}'}{'}}'}, etc. in your templates
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- System Notifications -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-cyan-50 rounded-lg">
            <Bell class="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">System Notifications</h2>
            <p class="text-sm text-gray-600">Configure admin notifications</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="notification in notifications"
            :key="notification.key"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ notification.name }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ notification.description }}</p>
            </div>
            <button
              @click="toggleNotification(notification.key)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                notification.enabled ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  notification.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <button @click="console.log('Save notification settings:', notifications)" class="w-full mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
          <Save class="w-4 h-4" />
          <span>Save Notification Settings</span>
        </button>
      </div>

      <!-- Feature Flags -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-green-50 rounded-lg">
            <Zap class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Feature Flags</h2>
            <p class="text-sm text-gray-600">Enable or disable features</p>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="feature in features"
            :key="feature.key"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ feature.name }}</p>
              <p class="text-xs text-gray-600 mt-1">{{ feature.description }}</p>
            </div>
            <button
              @click="toggleFeature(feature.key)"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                feature.enabled ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  feature.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
        </div>

        <button @click="console.log('Save feature flags:', features)" class="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
          <Save class="w-4 h-4" />
          <span>Save Feature Flags</span>
        </button>
      </div>

      <!-- Maintenance Mode -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div class="p-2 bg-orange-50 rounded-lg">
            <AlertTriangle class="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">Maintenance Mode</h2>
            <p class="text-sm text-gray-600">Platform availability control</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">Enable Maintenance Mode</p>
              <p class="text-xs text-gray-600 mt-1">Platform will be unavailable to users</p>
            </div>
            <button
              @click="settings.maintenanceMode = !settings.maintenanceMode"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                settings.maintenanceMode ? 'bg-orange-600' : 'bg-gray-300'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>

          <div v-if="settings.maintenanceMode" class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Message
              </label>
              <textarea
                v-model="settings.maintenanceMessage"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a message to display during maintenance..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Expected Return Time
              </label>
              <input
                v-model="settings.maintenanceReturnTime"
                type="datetime-local"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="bg-red-50 rounded-lg p-4">
            <div class="flex items-start space-x-2">
              <AlertTriangle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-red-900">Warning</p>
                <p class="text-sm text-red-700 mt-1">
                  Enabling maintenance mode will make the platform inaccessible to all users except admins.
                </p>
              </div>
            </div>
          </div>

          <button @click="console.log('Save maintenance settings:', { mode: settings.maintenanceMode, message: settings.maintenanceMessage, returnTime: settings.maintenanceReturnTime })" class="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
            <Save class="w-4 h-4" />
            <span>Save Maintenance Settings</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Save All Button -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Save All Changes</h3>
          <p class="text-sm text-gray-600 mt-1">Apply all configuration changes at once</p>
        </div>
        <button @click="console.log('Save all settings:', settings, notifications, features)" class="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2">
          <Save class="w-5 h-5" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>

    <!-- Email Template Modal -->
    <div
      v-if="selectedTemplate"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="selectedTemplate = null"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full" @click.stop>
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 class="text-xl font-bold text-white">{{ selectedTemplate.name }}</h2>
          <button @click="selectedTemplate = null" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X class="w-5 h-5 text-white" />
          </button>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Subject Line</label>
              <input
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
              <textarea
                rows="10"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Email content..."
              ></textarea>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-lg">
          <button @click="selectedTemplate = null" class="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors">
            Cancel
          </button>
          <button @click="console.log('Save email template:', selectedTemplate.key); selectedTemplate = null" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
            Save Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DollarSign, Mail, Zap, AlertTriangle, Save, Info, Star, Building2, X, ChevronRight, Bell } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard-admin',
})

const selectedTemplate = ref(null)

const settings = ref({
  platformCommission: 15,
  maxFeaturedProperties: 10,
  featuredPropertyFee: 99,
  maintenanceMode: false,
  maintenanceMessage: 'We are performing scheduled maintenance. We\'ll be back soon!',
  maintenanceReturnTime: ''
})

const featuredProperties = [
  { id: 1, name: 'Premium Suite' },
  { id: 2, name: 'Deluxe Bathroom' },
  { id: 3, name: 'VIP Lounge' }
]

const emailTemplates = [
  { key: 'booking_confirmation', name: 'Booking Confirmation', description: 'Sent when a booking is confirmed' },
  { key: 'booking_reminder', name: 'Booking Reminder', description: 'Sent 24 hours before booking' },
  { key: 'booking_completed', name: 'Booking Completed', description: 'Sent after booking is completed' },
  { key: 'welcome_email', name: 'Welcome Email', description: 'Sent to new users' },
  { key: 'password_reset', name: 'Password Reset', description: 'Sent for password reset requests' },
  { key: 'provider_approved', name: 'Provider Approved', description: 'Sent when provider application is approved' }
]

const notifications = ref([
  {
    key: 'new_bookings',
    name: 'New Bookings',
    description: 'Notify when new bookings are created',
    enabled: true
  },
  {
    key: 'new_users',
    name: 'New User Registrations',
    description: 'Notify when new users sign up',
    enabled: true
  },
  {
    key: 'refund_requests',
    name: 'Refund Requests',
    description: 'Notify when refunds are requested',
    enabled: true
  },
  {
    key: 'property_submissions',
    name: 'Property Submissions',
    description: 'Notify when new properties are submitted',
    enabled: true
  },
  {
    key: 'reported_issues',
    name: 'Reported Issues',
    description: 'Notify when users report problems',
    enabled: true
  }
])

const features = ref([
  {
    key: 'realtime_booking',
    name: 'Real-time Booking Updates',
    description: 'Enable WebSocket connections for instant booking notifications',
    enabled: true
  },
  {
    key: 'instant_refunds',
    name: 'Instant Refunds',
    description: 'Process refunds immediately without admin approval',
    enabled: false
  },
  {
    key: 'provider_analytics',
    name: 'Provider Analytics Dashboard',
    description: 'Advanced analytics for provider accounts',
    enabled: true
  },
  {
    key: 'mobile_app',
    name: 'Mobile App Support',
    description: 'Enable API endpoints for mobile applications',
    enabled: true
  },
  {
    key: 'loyalty_program',
    name: 'Loyalty Rewards Program',
    description: 'Points and rewards for frequent users',
    enabled: false
  },
  {
    key: 'group_bookings',
    name: 'Group Bookings',
    description: 'Allow booking multiple facilities at once',
    enabled: false
  }
])

const toggleFeature = (key: string) => {
  const feature = features.value.find(f => f.key === key)
  if (feature) {
    feature.enabled = !feature.enabled
  }
}

const toggleNotification = (key: string) => {
  const notification = notifications.value.find(n => n.key === key)
  if (notification) {
    notification.enabled = !notification.enabled
  }
}

const removeFeatured = (id: number) => {
  const index = featuredProperties.findIndex(p => p.id === id)
  if (index > -1) {
    featuredProperties.splice(index, 1)
  }
}
</script>

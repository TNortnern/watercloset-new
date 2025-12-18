<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Messages</h1>
        <p class="mt-1 text-slate-600">Chat with property owners and guests</p>
      </div>
    </div>

    <!-- Messages Container -->
    <Card class="overflow-hidden">
      <div class="flex h-[calc(100vh-240px)] min-h-[600px]">
        <!-- Conversations List - Left Panel -->
        <div
          :class="[
            'w-full lg:w-96 border-r border-slate-200 flex flex-col bg-white',
            selectedConversation && 'hidden lg:flex'
          ]"
        >
          <!-- Search -->
          <div class="p-4 border-b border-slate-200">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                v-model="searchQuery"
                placeholder="Search conversations..."
                class="pl-10"
              />
            </div>
          </div>

          <!-- Conversations List -->
          <div class="flex-1 overflow-y-auto">
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              :class="[
                'flex gap-3 p-4 cursor-pointer transition-colors border-b border-slate-100',
                selectedConversation?.id === conversation.id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-slate-50'
              ]"
              @click="selectConversation(conversation)"
            >
              <div class="relative flex-shrink-0">
                <img
                  :src="conversation.avatar"
                  :alt="conversation.name"
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div
                  v-if="conversation.online"
                  class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-slate-900 truncate">{{ conversation.name }}</h3>
                  <span class="text-xs text-slate-500 flex-shrink-0">{{ conversation.time }}</span>
                </div>
                <p class="text-sm text-slate-600 truncate mt-1">{{ conversation.lastMessage }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-slate-500">{{ conversation.property }}</span>
                  <span
                    v-if="conversation.unread > 0"
                    class="ml-auto px-2 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full"
                  >
                    {{ conversation.unread }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredConversations.length === 0" class="p-8 text-center">
              <MessageSquare class="w-12 h-12 mx-auto text-slate-300" />
              <p class="mt-2 text-slate-600">No conversations found</p>
            </div>
          </div>
        </div>

        <!-- Chat Area - Right Panel -->
        <div
          v-if="selectedConversation"
          :class="[
            'flex-1 flex flex-col bg-white',
            selectedConversation && 'flex lg:flex'
          ]"
        >
          <!-- Chat Header -->
          <div class="p-4 border-b border-slate-200 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              class="lg:hidden"
              @click="selectedConversation = null"
            >
              <ArrowLeft class="w-4 h-4" />
            </Button>
            <img
              :src="selectedConversation.avatar"
              :alt="selectedConversation.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div class="flex-1">
              <h3 class="font-semibold text-slate-900">{{ selectedConversation.name }}</h3>
              <p class="text-sm text-slate-600">{{ selectedConversation.property }}</p>
            </div>
            <div class="flex gap-2">
              <Button variant="ghost" size="sm">
                <Phone class="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical class="w-4 h-4" />
              </Button>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            <div
              v-for="message in selectedConversation.messages"
              :key="message.id"
              :class="[
                'flex',
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              ]"
            >
              <div
                :class="[
                  'max-w-[70%] rounded-lg p-3',
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border border-slate-200 text-slate-900'
                ]"
              >
                <p class="text-sm">{{ message.text }}</p>
                <div
                  :class="[
                    'flex items-center gap-1 mt-1 text-xs',
                    message.sender === 'me' ? 'text-blue-100' : 'text-slate-500'
                  ]"
                >
                  <span>{{ message.time }}</span>
                  <Check
                    v-if="message.sender === 'me' && message.read"
                    class="w-3 h-3"
                  />
                </div>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="bg-white border border-slate-200 rounded-lg p-3">
                <div class="flex gap-1">
                  <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0ms" />
                  <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 150ms" />
                  <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 300ms" />
                </div>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <div class="p-4 border-t border-slate-200 bg-white">
            <div class="flex gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip class="w-4 h-4" />
              </Button>
              <Input
                v-model="newMessage"
                placeholder="Type a message..."
                class="flex-1"
                @keypress.enter="sendMessage"
              />
              <Button @click="sendMessage" :disabled="!newMessage.trim()">
                <Send class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- No Conversation Selected - Desktop Only -->
        <div
          v-else
          class="hidden lg:flex flex-1 items-center justify-center bg-slate-50"
        >
          <div class="text-center">
            <MessageSquare class="w-16 h-16 mx-auto text-slate-300" />
            <h3 class="mt-4 text-lg font-semibold text-slate-900">Select a conversation</h3>
            <p class="mt-2 text-slate-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import {
  Search,
  MessageSquare,
  Send,
  Phone,
  MoreVertical,
  Paperclip,
  ArrowLeft,
  Check,
} from 'lucide-vue-next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({
  layout: 'dashboard',
})

interface Message {
  id: number
  sender: 'me' | 'them'
  text: string
  time: string
  read?: boolean
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  property: string
  online: boolean
  messages: Message[]
}

const searchQuery = ref('')
const selectedConversation = ref<Conversation | null>(null)
const newMessage = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// Mock conversations data
const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?img=12',
    lastMessage: 'The bathroom will be ready at 2 PM',
    time: '10m ago',
    unread: 2,
    property: 'Luxury Downtown Restroom',
    online: true,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! Thanks for booking my bathroom.', time: '2:30 PM', read: true },
      { id: 2, sender: 'me', text: 'Thank you! What time can I arrive?', time: '2:32 PM', read: true },
      { id: 3, sender: 'them', text: 'The bathroom will be ready at 2 PM', time: '2:35 PM', read: false },
      { id: 4, sender: 'them', text: 'I\'ll send you the access code shortly.', time: '2:35 PM', read: false },
    ],
  },
  {
    id: 2,
    name: 'Emma Wilson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Great! See you then.',
    time: '1h ago',
    unread: 0,
    property: 'Cozy Cafe Bathroom',
    online: true,
    messages: [
      { id: 1, sender: 'me', text: 'Hi Emma, I have a booking for tomorrow at 10 AM.', time: '1:00 PM', read: true },
      { id: 2, sender: 'them', text: 'Yes! Looking forward to hosting you.', time: '1:05 PM', read: true },
      { id: 3, sender: 'me', text: 'Is there parking nearby?', time: '1:10 PM', read: true },
      { id: 4, sender: 'them', text: 'Yes, there\'s street parking right in front. It\'s usually easy to find a spot in the morning.', time: '1:12 PM', read: true },
      { id: 5, sender: 'me', text: 'Perfect! Thanks.', time: '1:15 PM', read: true },
      { id: 6, sender: 'them', text: 'Great! See you then.', time: '1:16 PM', read: true },
    ],
  },
  {
    id: 3,
    name: 'Michael Brown',
    avatar: 'https://i.pravatar.cc/150?img=33',
    lastMessage: 'You\'re welcome! Have a great day.',
    time: '3h ago',
    unread: 0,
    property: 'Modern Office Restroom',
    online: false,
    messages: [
      { id: 1, sender: 'me', text: 'Thanks for the great experience!', time: '11:00 AM', read: true },
      { id: 2, sender: 'them', text: 'You\'re welcome! Have a great day.', time: '11:15 AM', read: true },
    ],
  },
  {
    id: 4,
    name: 'Sarah Davis',
    avatar: 'https://i.pravatar.cc/150?img=9',
    lastMessage: 'The Wi-Fi password is on the door.',
    time: '2d ago',
    unread: 0,
    property: 'Premium Hotel Facilities',
    online: false,
    messages: [
      { id: 1, sender: 'me', text: 'Hi Sarah, is there Wi-Fi available?', time: 'Dec 10, 1:00 PM', read: true },
      { id: 2, sender: 'them', text: 'Yes! The Wi-Fi password is on the door.', time: 'Dec 10, 1:05 PM', read: true },
      { id: 3, sender: 'me', text: 'Perfect, thank you!', time: 'Dec 10, 1:06 PM', read: true },
    ],
  },
  {
    id: 5,
    name: 'James Taylor',
    avatar: 'https://i.pravatar.cc/150?img=52',
    lastMessage: 'Booking confirmed! Looking forward to it.',
    time: '1d ago',
    unread: 1,
    property: 'Trendy Restaurant Restroom',
    online: true,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! I saw your booking request.', time: 'Dec 16, 3:00 PM', read: true },
      { id: 2, sender: 'me', text: 'Yes, I\'m interested in the 7 PM slot.', time: 'Dec 16, 3:05 PM', read: true },
      { id: 3, sender: 'them', text: 'Booking confirmed! Looking forward to it.', time: 'Dec 16, 3:10 PM', read: false },
    ],
  },
])

// Filtered conversations based on search
const filteredConversations = computed(() => {
  if (!searchQuery.value) return conversations.value

  const query = searchQuery.value.toLowerCase()
  return conversations.value.filter(
    c =>
      c.name.toLowerCase().includes(query) ||
      c.property.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query)
  )
})

// Select conversation
const selectConversation = (conversation: Conversation) => {
  selectedConversation.value = conversation
  // Mark messages as read
  conversation.unread = 0
  conversation.messages.forEach(m => {
    if (m.sender === 'them') m.read = true
  })
  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Send message
const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  const message: Message = {
    id: selectedConversation.value.messages.length + 1,
    sender: 'me',
    text: newMessage.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
  }

  selectedConversation.value.messages.push(message)
  selectedConversation.value.lastMessage = newMessage.value
  selectedConversation.value.time = 'Just now'

  newMessage.value = ''

  // Scroll to bottom
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })

  // Simulate typing indicator
  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    // Simulate response
    if (selectedConversation.value) {
      const response: Message = {
        id: selectedConversation.value.messages.length + 1,
        sender: 'them',
        text: 'Thanks for your message! I\'ll get back to you shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      selectedConversation.value.messages.push(response)
      selectedConversation.value.lastMessage = response.text
      selectedConversation.value.time = 'Just now'

      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }
  }, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-2xl font-bold text-slate-900">Leave a Review</h3>
      <p class="mt-1 text-slate-600">Share your experience to help other users</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Overall Rating -->
      <div>
        <Label class="text-base font-semibold">Overall Rating</Label>
        <p class="text-sm text-slate-600 mb-3">How was your overall experience?</p>
        <div class="flex items-center gap-2">
          <button
            v-for="star in 5"
            :key="`overall-${star}`"
            type="button"
            @click="formData.rating = star"
            class="transition-transform hover:scale-110"
          >
            <Star
              :class="[
                'w-10 h-10',
                star <= formData.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-slate-300'
              ]"
            />
          </button>
          <span class="ml-2 text-lg font-semibold text-slate-900">
            {{ formData.rating || 0 }}/5
          </span>
        </div>
        <p v-if="errors.rating" class="text-sm text-red-600 mt-1">{{ errors.rating }}</p>
      </div>

      <!-- Detailed Ratings -->
      <div class="space-y-4 pt-4 border-t">
        <h4 class="font-semibold text-slate-900">Detailed Ratings (Optional)</h4>

        <!-- Cleanliness -->
        <div>
          <Label class="text-sm font-medium">Cleanliness</Label>
          <div class="flex items-center gap-2 mt-2">
            <button
              v-for="star in 5"
              :key="`cleanliness-${star}`"
              type="button"
              @click="formData.cleanliness = star"
              class="transition-transform hover:scale-110"
            >
              <Star
                :class="[
                  'w-7 h-7',
                  star <= (formData.cleanliness || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                ]"
              />
            </button>
            <span class="ml-2 text-sm font-medium text-slate-700">
              {{ formData.cleanliness || 'Not rated' }}
            </span>
          </div>
        </div>

        <!-- Accuracy -->
        <div>
          <Label class="text-sm font-medium">Accuracy</Label>
          <p class="text-xs text-slate-500">Did the listing match the description?</p>
          <div class="flex items-center gap-2 mt-2">
            <button
              v-for="star in 5"
              :key="`accuracy-${star}`"
              type="button"
              @click="formData.accuracy = star"
              class="transition-transform hover:scale-110"
            >
              <Star
                :class="[
                  'w-7 h-7',
                  star <= (formData.accuracy || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                ]"
              />
            </button>
            <span class="ml-2 text-sm font-medium text-slate-700">
              {{ formData.accuracy || 'Not rated' }}
            </span>
          </div>
        </div>

        <!-- Communication -->
        <div>
          <Label class="text-sm font-medium">Communication</Label>
          <p class="text-xs text-slate-500">How responsive was the host?</p>
          <div class="flex items-center gap-2 mt-2">
            <button
              v-for="star in 5"
              :key="`communication-${star}`"
              type="button"
              @click="formData.communication = star"
              class="transition-transform hover:scale-110"
            >
              <Star
                :class="[
                  'w-7 h-7',
                  star <= (formData.communication || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                ]"
              />
            </button>
            <span class="ml-2 text-sm font-medium text-slate-700">
              {{ formData.communication || 'Not rated' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Written Comment -->
      <div class="pt-4 border-t">
        <Label for="comment" class="text-base font-semibold">Your Review</Label>
        <p class="text-sm text-slate-600 mb-3">Tell others about your experience</p>
        <Textarea
          id="comment"
          v-model="formData.comment"
          placeholder="Share details about your visit, the cleanliness, amenities, and anything else that would help future visitors..."
          rows="6"
          :maxlength="1000"
          class="resize-none"
        />
        <div class="flex justify-between items-center mt-2">
          <p v-if="errors.comment" class="text-sm text-red-600">{{ errors.comment }}</p>
          <p class="text-xs text-slate-500 ml-auto">
            {{ formData.comment.length }}/1000 characters
          </p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          @click="$emit('cancel')"
          :disabled="isSubmitting"
          class="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :disabled="isSubmitting || !isValid"
          class="flex-1"
        >
          <Loader2 v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" />
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Props {
  bookingId: string
  propertyId?: string
  propertyName?: string
}

interface ReviewFormData {
  rating: number
  cleanliness: number | null
  accuracy: number | null
  communication: number | null
  comment: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  success: []
  cancel: []
}>()

const { create } = usePayload()

const formData = ref<ReviewFormData>({
  rating: 0,
  cleanliness: null,
  accuracy: null,
  communication: null,
  comment: '',
})

const errors = ref<Partial<Record<keyof ReviewFormData, string>>>({})
const isSubmitting = ref(false)

const isValid = computed(() => {
  return formData.value.rating > 0 && formData.value.comment.trim().length > 0
})

const validateForm = () => {
  errors.value = {}

  if (!formData.value.rating || formData.value.rating < 1) {
    errors.value.rating = 'Please select an overall rating'
  }

  if (!formData.value.comment.trim()) {
    errors.value.comment = 'Please write a review'
  } else if (formData.value.comment.trim().length < 10) {
    errors.value.comment = 'Review must be at least 10 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const reviewData: any = {
      booking: props.bookingId,
      rating: formData.value.rating,
      comment: formData.value.comment.trim(),
    }

    // Add optional ratings if provided
    if (formData.value.cleanliness) {
      reviewData.cleanliness = formData.value.cleanliness
    }
    if (formData.value.accuracy) {
      reviewData.accuracy = formData.value.accuracy
    }
    if (formData.value.communication) {
      reviewData.communication = formData.value.communication
    }

    await create('reviews', reviewData)

    emit('success')
  } catch (error: any) {
    console.error('Failed to submit review:', error)

    // Show error message
    if (error.data?.message) {
      errors.value.rating = error.data.message
    } else {
      errors.value.rating = 'Failed to submit review. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

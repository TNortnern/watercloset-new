<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Upload, X, Link, Image, Loader2 } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UploadedFile {
  id?: string | number
  url: string
  alt?: string
  filename?: string
}

interface Props {
  modelValue?: UploadedFile | UploadedFile[] | null
  multiple?: boolean
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
  allowUrl?: boolean
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  maxFiles: 10,
  maxSizeMB: 5,
  accept: 'image/*',
  allowUrl: true,
  placeholder: 'Drag and drop or click to upload',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: UploadedFile | UploadedFile[] | null]
  'error': [message: string]
}>()

const { toast } = useToast()

const isDragging = ref(false)
const isUploading = ref(false)
const showUrlInput = ref(false)
const urlInput = ref('')
const fileInputRef = ref<HTMLInputElement | null>(null)

// Normalize value to always be an array internally
const files = computed<UploadedFile[]>(() => {
  if (!props.modelValue) return []
  if (Array.isArray(props.modelValue)) return props.modelValue
  return [props.modelValue]
})

// Emit updated value in the correct format
const updateValue = (newFiles: UploadedFile[]) => {
  if (props.multiple) {
    emit('update:modelValue', newFiles.length > 0 ? newFiles : null)
  } else {
    emit('update:modelValue', newFiles[0] || null)
  }
}

// Handle drag events
const onDragEnter = (e: DragEvent) => {
  e.preventDefault()
  if (!props.disabled) isDragging.value = true
}

const onDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
}

const onDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const onDrop = async (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  if (props.disabled) return

  const droppedFiles = e.dataTransfer?.files
  if (droppedFiles) {
    await handleFiles(Array.from(droppedFiles))
  }
}

// Handle file input change
const onFileInputChange = async (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    await handleFiles(Array.from(input.files))
    input.value = '' // Reset input
  }
}

// Process files for upload
const handleFiles = async (fileList: File[]) => {
  const validFiles: File[] = []

  for (const file of fileList) {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error(`${file.name} is not an image`)
      continue
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > props.maxSizeMB) {
      toast.error(`${file.name} exceeds ${props.maxSizeMB}MB limit`)
      continue
    }

    validFiles.push(file)
  }

  // Check max files limit
  const currentCount = files.value.length
  const remaining = props.maxFiles - currentCount
  if (validFiles.length > remaining) {
    toast.warning(`Can only add ${remaining} more file(s)`)
    validFiles.splice(remaining)
  }

  if (validFiles.length === 0) return

  // Upload files
  isUploading.value = true
  try {
    const uploadedFiles: UploadedFile[] = []

    for (const file of validFiles) {
      const uploaded = await uploadFile(file)
      if (uploaded) {
        uploadedFiles.push(uploaded)
      }
    }

    if (uploadedFiles.length > 0) {
      const newFiles = props.multiple
        ? [...files.value, ...uploadedFiles]
        : uploadedFiles.slice(0, 1)
      updateValue(newFiles)
      toast.success(`${uploadedFiles.length} file(s) uploaded`)
    }
  } catch (error) {
    console.error('Upload error:', error)
    toast.error('Failed to upload file(s)')
    emit('error', 'Upload failed')
  } finally {
    isUploading.value = false
  }
}

// Upload a single file to Payload media collection
const uploadFile = async (file: File): Promise<UploadedFile | null> => {
  const formData = new FormData()
  formData.append('file', file)
  // Payload 3 requires additional fields to be sent as JSON in _payload field
  formData.append('_payload', JSON.stringify({ alt: file.name }))

  try {
    const response = await $fetch<any>('/api/media', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    if (response?.doc) {
      return {
        id: response.doc.id,
        url: response.doc.url,
        alt: response.doc.alt || file.name,
        filename: response.doc.filename || file.name,
      }
    }
    return null
  } catch (error) {
    console.error('Upload error:', error)
    return null
  }
}

// Handle URL submission
const handleUrlSubmit = async () => {
  const url = urlInput.value.trim()
  if (!url) return

  // Validate URL
  try {
    new URL(url)
  } catch {
    toast.error('Please enter a valid URL')
    return
  }

  // For now, just add the URL directly (could be enhanced to download and re-upload)
  const newFile: UploadedFile = {
    url,
    alt: 'External image',
  }

  const newFiles = props.multiple
    ? [...files.value, newFile]
    : [newFile]

  updateValue(newFiles)
  urlInput.value = ''
  showUrlInput.value = false
  toast.success('Image URL added')
}

// Remove a file
const removeFile = (index: number) => {
  const newFiles = [...files.value]
  newFiles.splice(index, 1)
  updateValue(newFiles)
}

// Trigger file input click
const openFilePicker = () => {
  if (!props.disabled) {
    fileInputRef.value?.click()
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Existing files preview -->
    <div v-if="files.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="(file, index) in files"
        :key="file.id || file.url"
        class="relative group aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
      >
        <img
          :src="file.url"
          :alt="file.alt || 'Uploaded image'"
          class="w-full h-full object-cover"
        />
        <button
          v-if="!disabled"
          @click="removeFile(index)"
          class="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <X class="w-4 h-4" />
        </button>
        <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
          {{ file.filename || 'Image' }}
        </div>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      v-if="multiple || files.length === 0"
      class="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      :class="[
        isDragging ? 'border-primary bg-primary/5' : 'border-slate-300 hover:border-slate-400',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="openFilePicker"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="hidden"
        @change="onFileInputChange"
      />

      <div v-if="isUploading" class="flex flex-col items-center gap-3">
        <Loader2 class="w-10 h-10 text-primary animate-spin" />
        <p class="text-sm text-slate-600">Uploading...</p>
      </div>

      <div v-else class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Upload class="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <p class="text-sm font-medium text-slate-700">{{ placeholder }}</p>
          <p class="text-xs text-slate-500 mt-1">
            Max {{ maxSizeMB }}MB per file
            <span v-if="multiple"> · Up to {{ maxFiles }} files</span>
          </p>
        </div>
      </div>
    </div>

    <!-- URL input option -->
    <div v-if="allowUrl && (multiple || files.length === 0)" class="flex items-center gap-2">
      <template v-if="showUrlInput">
        <Input
          v-model="urlInput"
          type="url"
          placeholder="https://example.com/image.jpg"
          class="flex-1"
          @keyup.enter="handleUrlSubmit"
        />
        <Button size="sm" @click="handleUrlSubmit" :disabled="!urlInput.trim()">
          Add
        </Button>
        <Button size="sm" variant="ghost" @click="showUrlInput = false">
          Cancel
        </Button>
      </template>
      <template v-else>
        <Button
          size="sm"
          variant="ghost"
          class="text-slate-600"
          @click="showUrlInput = true"
          :disabled="disabled"
        >
          <Link class="w-4 h-4 mr-2" />
          Add from URL
        </Button>
      </template>
    </div>
  </div>
</template>

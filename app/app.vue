<script setup lang="ts">
import { appName } from '~/constants'
import Toaster from '@/components/ui/toast/Toaster.vue'
import ConfirmDialog from '@/components/ui/alert-dialog/ConfirmDialog.vue'

useHead({
  title: appName,
  bodyAttrs: {
    class: 'bg-background text-foreground antialiased'
  }
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
  <ConfirmDialog />
</template>

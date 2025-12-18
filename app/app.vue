<script setup lang="ts">
import { appName } from '~/constants'

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
</template>

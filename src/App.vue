<script setup>
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <component :is="$route.meta.layout || 'main'">
    <router-view />
    <Toaster position="top-center" />
  </component>
</template>

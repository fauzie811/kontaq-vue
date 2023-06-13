<template>
  <div class="md:flex md:items-center md:justify-between">
    <div class="flex-1 min-w-0">
      <h2 v-if="pageTitle" class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{
        pageTitle
      }}</h2>
      <div v-else class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
        <TextPlaceholder class="block w-96" />
      </div>
    </div>
    <div class="flex mt-4 md:ml-4 md:mt-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
import TextPlaceholder from './placeholders/TextPlaceholder.vue';

defineProps({
  pageTitle: String,
})
</script>
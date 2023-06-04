<template>
  <div class="flex items-center justify-center">
    <XMarkIcon class="w-6 h-6 text-red-600" v-if="score === undefined" />
    <span v-else-if="score === null"></span>
    <span v-else>{{ score }}</span>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/20/solid';

const props = defineProps({ score: undefined });
</script>
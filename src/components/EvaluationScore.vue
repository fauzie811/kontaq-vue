<template>
  <div class="flex items-center justify-center">
    <XMarkIcon v-if="score === undefined || score === undefined" class="w-6 h-6 text-danger-600" />
    <AcademicCapIcon class="w-6 h-6 text-success-600" v-else />
  </div>
</template>

<script setup>
import { AcademicCapIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ score: undefined });
</script>
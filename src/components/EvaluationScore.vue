<template>
  <div class="flex items-center justify-center">
    <span v-if="score === undefined"></span>
    <span v-else-if="score === null"></span>
    <AcademicCapIcon class="w-6 h-6 text-green-600" v-else />
  </div>
</template>

<script setup>
import { AcademicCapIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ score: undefined });
</script>
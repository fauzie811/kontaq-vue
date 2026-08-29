<template>
  <div class="flex items-center justify-center">
    <span v-if="score === undefined || score === null" role="img" aria-label="Tidak ada evaluasi" title="Tidak ada kabar">
      <XMarkIcon class="w-6 h-6 text-danger-600" />
    </span>
    <span v-else role="img" aria-label="Evaluasi selesai" title="Evaluasi selesai">
      <AcademicCapIcon class="w-6 h-6 text-success-600" />
    </span>
  </div>
</template>

<script setup>
import { AcademicCapIcon, XMarkIcon } from '@heroicons/vue/24/outline';

defineProps({ score: undefined });
</script>

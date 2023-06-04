<template>
  <div class="flex items-center justify-center">
    <span v-if="score === undefined"></span>
    <span v-else-if="score === null"></span>
    <TrophyIcon class="w-5 h-5 text-green-600" v-else />
  </div>
</template>

<script setup>
import { TrophyIcon } from '@heroicons/vue/20/solid';

const props = defineProps({ score: undefined });
</script>
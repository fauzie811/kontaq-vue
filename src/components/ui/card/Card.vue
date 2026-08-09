<script setup>
import { cn } from '@/lib/utils';

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div
    :class="
      cn('bg-card text-card-foreground border border-border rounded-2xl shadow-xs transition-all duration-200', props.class)
    "
  >
    <slot />
  </div>
</template>

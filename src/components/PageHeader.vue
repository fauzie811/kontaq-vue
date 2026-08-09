<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div class="flex items-center gap-3 min-w-0">
      <component
        :is="backUrl ? 'router-link' : 'button'"
        v-if="backUrl || showBack"
        :to="backUrl"
        class="inline-flex items-center justify-center h-10 w-10 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full transition-colors flex-shrink-0"
        @click="!backUrl && $emit('back')"
      >
        <ArrowLeft class="w-5 h-5" />
      </component>

      <div class="min-w-0">
        <h2 v-if="pageTitle" class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl truncate">
          {{ pageTitle }}
        </h2>
        <div v-else class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          <TextPlaceholder class="block w-96 max-w-full" />
        </div>
        <p v-if="description" class="text-sm text-muted-foreground mt-1">
          {{ description }}
        </p>
      </div>
    </div>

    <div v-if="$slots.default" class="flex items-center gap-3 shrink-0">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next';
import TextPlaceholder from './placeholders/TextPlaceholder.vue';

defineProps({
  pageTitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  backUrl: {
    type: [String, Object],
    default: null,
  },
  showBack: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['back']);
</script>
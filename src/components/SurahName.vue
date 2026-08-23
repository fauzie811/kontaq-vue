<template>
  <span
    v-if="ligature"
    class="font-surah select-none inline-block leading-none"
    :class="customClass"
    :title="title"
    :aria-label="title"
    >{{ ligature }}</span
  >
</template>

<script setup>
import { computed } from 'vue';
import { getSurahLigature, CHAPTER_DETAILS } from '@/constants/quran';

const props = defineProps({
  chapter: {
    type: [Number, String],
    default: null,
  },
  customClass: {
    type: String,
    default: '',
  },
});

const ligature = computed(() => getSurahLigature(props.chapter));

const title = computed(() => {
  if (!props.chapter && props.chapter !== 0) return '';
  const num = Number(props.chapter);
  const detail = CHAPTER_DETAILS[num];
  if (detail?.latin) {
    return `Surah ${detail.latin}`;
  }
  return `Surah ${props.chapter}`;
});
</script>

<template>
  <span
    class="text-[#a06e50] dark:text-[#c48d68]"
    :class="customClass"
    :title="`Ayat ${number}`"
    >{{ unicodeVerse }}</span
  >
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  number: {
    type: [Number, String],
    required: true,
  },
  customClass: {
    type: String,
    default: '',
  },
});

// Arabic-Indic digits (٠-٩)
const ARABIC_DIGITS = [
  '\u0660',
  '\u0661',
  '\u0662',
  '\u0663',
  '\u0664',
  '\u0665',
  '\u0666',
  '\u0667',
  '\u0668',
  '\u0669',
];

const toArabicDigits = (num) => {
  if (num === null || num === undefined) return '';
  return String(num).replace(/[0-9]/g, (d) => ARABIC_DIGITS[Number(d)]);
};

// Unicode standard: U+06DD (ARABIC END OF AYAH ۝) followed by Arabic-Indic numeral digits
const unicodeVerse = computed(() => {
  if (
    props.number === null ||
    props.number === undefined ||
    props.number === ''
  )
    return '';
  return `\u06DD${toArabicDigits(props.number)}`;
});
</script>

<template>
  <div
    class="bg-white rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-lime-600">
    <label class="block text-xs font-medium text-gray-500">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
});
</script>
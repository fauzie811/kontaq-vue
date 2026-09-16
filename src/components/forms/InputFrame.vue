<template>
  <div
    class="rounded-full bg-card px-5 pb-1.5 pt-2.5 shadow-xs ring-1 ring-inset ring-input focus-within:ring-2 focus-within:ring-ring">
    <label class="block text-xs font-medium text-muted-foreground">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
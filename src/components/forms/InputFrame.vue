<template>
  <div
    class="rounded-xl bg-card px-3 pb-1.5 pt-2.5 shadow-xs ring-1 ring-inset ring-border focus-within:ring-2 focus-within:ring-ring">
    <label class="block text-xs font-medium text-muted-foreground">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: String,
});
</script>
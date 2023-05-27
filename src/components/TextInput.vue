<template>
  <!-- TODO -->
  <div>
    <label v-if="!hideLabel" :for="id" class="block text-sm font-medium leading-6 text-gray-900">{{ label }}</label>
    <div class="mt-2">
      <input type="email" name="email" id="email" value="you@example.com" disabled=""
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
        placeholder="you@example.com" />
    </div>
  </div>
</template>

<script setup>
import uniqueId from 'lodash.uniqueid';

const id = uniqueId();

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  hideLabel: Boolean,
});
</script>
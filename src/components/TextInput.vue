<template>
  <div>
    <label v-if="!hideLabel && label" :for="id" class="block text-sm font-medium text-foreground mb-1.5">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="
        cn(
          'flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          $attrs.class
        )
      "
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import uniqueId from 'lodash.uniqueid';
import { cn } from '@/lib/utils';

defineOptions({ inheritAttrs: false });

const id = uniqueId('text-input-');

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  value: {
    type: [String, Number],
    default: '',
  },
  hideLabel: Boolean,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: Boolean,
});

const emit = defineEmits(['update:modelValue', 'input']);

const model = computed({
  get() {
    return props.modelValue !== undefined && props.modelValue !== '' ? props.modelValue : props.value;
  },
  set(val) {
    emit('update:modelValue', val);
    emit('input', val);
  },
});
</script>
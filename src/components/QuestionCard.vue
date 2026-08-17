<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden mb-6">
    <!-- Question Header Bar -->
    <div class="bg-[#f0f2f1] flex items-stretch min-h-[52px] border-b border-gray-200/60">
      <!-- Question Number Badge -->
      <div class="bg-[#dcfce7] text-[#144227] w-12 sm:w-14 flex items-center justify-center font-bold text-lg sm:text-xl shrink-0">
        {{ index + 1 }}
      </div>

      <!-- Question Content -->
      <div class="px-4 py-3 flex items-center text-gray-900 font-semibold text-base sm:text-lg flex-1 leading-snug">
        <div class="prose max-w-none text-gray-900 font-semibold text-base sm:text-lg" v-html="question.content"></div>
      </div>
    </div>

    <!-- True / False Options (Side-by-side) -->
    <div v-if="question.type === 'true_false'" class="p-4 sm:p-5">
      <RadioGroup :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <div class="grid grid-cols-2 gap-3 sm:gap-4">
          <RadioGroupOption
            v-for="opt in [{ key: 'true', label: 'Benar' }, { key: 'false', label: 'Salah' }]"
            :key="opt.key"
            :value="opt.key"
            v-slot="{ checked }"
          >
            <div
              :class="[
                checked
                  ? 'bg-[#bbf7d0] text-emerald-950 font-semibold border-emerald-500 shadow-sm'
                  : 'bg-white hover:bg-gray-50 text-gray-800 border-gray-200',
                'flex items-center justify-center px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none text-base sm:text-lg'
              ]"
            >
              <!-- Custom Radio Button Circle -->
              <span
                :class="[
                  checked ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 bg-white',
                  'w-5 h-5 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors'
                ]"
              >
                <span v-if="checked" class="w-2 h-2 rounded-full bg-white"></span>
              </span>

              <span>{{ opt.label }}</span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>

    <!-- Multiple Choice Options List -->
    <div v-else class="py-1">
      <RadioGroup :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
        <div class="space-y-0">
          <RadioGroupOption
            v-for="optKey in multipleOptions"
            :key="optKey"
            :value="optKey"
            v-slot="{ checked }"
          >
            <div
              :class="[
                checked ? 'bg-[#bbf7d0] text-emerald-950 font-medium' : 'hover:bg-gray-50 text-gray-800',
                'flex items-center px-4 sm:px-6 py-3 cursor-pointer transition-colors duration-150 select-none text-base'
              ]"
            >
              <!-- Custom Radio Button Circle -->
              <span
                :class="[
                  checked ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300 bg-white',
                  'w-5 h-5 rounded-full border flex items-center justify-center mr-3.5 shrink-0 transition-colors'
                ]"
              >
                <span v-if="checked" class="w-2 h-2 rounded-full bg-white"></span>
              </span>

              <!-- Option Label & Text -->
              <span class="mr-2 font-normal text-base">{{ optKey }}.</span>
              <span class="text-base leading-relaxed">{{ getOptionText(optKey) }}</span>
            </div>
          </RadioGroupOption>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';

const props = defineProps({
  question: { type: Object, required: true },
  index: { type: Number, required: true },
  modelValue: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

function getOptionText(key) {
  if (!props.question || !props.question.details) return '';
  return props.question.details[`option_${key}`] || props.question.details[`option_${key} `] || '';
}

const multipleOptions = computed(() => {
  const base = ['a', 'b', 'c', 'd'];
  const optionE = getOptionText('e');
  if (optionE && optionE.trim() !== '') {
    base.push('e');
  }
  return base;
});
</script>


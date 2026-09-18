<template>
  <div
    :id="'question-' + (index + 1)"
    class="scroll-mt-24 sm:scroll-mt-28 bg-card rounded-2xl border border-border overflow-hidden mb-5 sm:mb-6 transition-all duration-200"
  >
    <!-- Question Header Bar -->
    <div class="bg-muted/50 flex items-stretch min-h-[52px] border-b border-border">
      <!-- Question Number Badge -->
      <div class="bg-primary/10 text-primary w-12 sm:w-14 flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 border-r border-border/80">
        {{ index + 1 }}
      </div>

      <!-- Question Content -->
      <div class="px-4 py-3.5 sm:py-4 flex items-center text-foreground font-semibold text-base sm:text-lg flex-1 leading-snug">
        <div class="prose dark:prose-invert max-w-none text-foreground font-semibold text-base sm:text-lg" v-html="question.content"></div>
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
                  ? 'bg-primary/10 text-primary font-bold border-primary ring-1 ring-primary/30'
                  : 'bg-card hover:bg-muted/40 text-foreground border-border',
                'flex items-center justify-center px-4 py-3.5 sm:py-4 rounded-xl border-2 cursor-pointer transition-all duration-150 select-none text-base sm:text-lg min-h-[52px] active:scale-[0.98]'
              ]"
            >
              <!-- Custom Radio Button Circle -->
              <span
                :class="[
                  checked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 bg-card',
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2.5 shrink-0 transition-colors'
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
        <div class="divide-y divide-border/60">
          <RadioGroupOption
            v-for="optKey in multipleOptions"
            :key="optKey"
            :value="optKey"
            v-slot="{ checked }"
          >
            <div
              :class="[
                checked
                  ? 'bg-primary/10 text-foreground font-medium'
                  : 'hover:bg-muted/40 text-foreground',
                'flex items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 cursor-pointer transition-colors duration-150 select-none text-sm sm:text-base active:bg-primary/15'
              ]"
            >
              <!-- Custom Radio Button Circle -->
              <span
                :class="[
                  checked ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40 bg-card',
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3.5 mt-0.5 sm:mt-0 shrink-0 transition-colors'
                ]"
              >
                <span v-if="checked" class="w-2 h-2 rounded-full bg-white"></span>
              </span>

              <!-- Option Label & Text -->
              <span class="mr-2 font-bold text-sm sm:text-base shrink-0">{{ optKey }}.</span>
              <span class="text-sm sm:text-base leading-relaxed text-foreground flex-1">{{ getOptionText(optKey) }}</span>
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


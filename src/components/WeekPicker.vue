<template>
  <Listbox as="div" :modelValue="modelValue" @update:modelValue="value => emit('update:modelValue', value)">
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-full bg-card py-2 pl-4 pr-10 text-left text-card-foreground border border-input transition-colors hover:border-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm">
        <span v-if="modelValue || showAllOption" class="block truncate">{{ modelValue ? 'Pekan ' + modelValue : 'Semua Pekan' }}</span>
        <span v-else class="block text-muted-foreground truncate">Pilih Pekan</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon class="w-5 h-5 text-muted-foreground" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <ListboxOptions
          class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-popover border border-border rounded-xl max-h-60 focus:outline-none sm:text-sm">
          <ListboxOption v-if="showAllOption" as="template" :value="null" v-slot="{ active, selected }">
            <li
              :class="[selected || active ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-secondary hover:text-secondary-foreground', 'relative cursor-default select-none py-2 pl-3 pr-9 mx-1 my-0.5 rounded-lg transition-colors']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">Semua Pekan</span>

              <span v-if="selected"
                :class="[selected || active ? 'text-primary-foreground' : 'text-primary', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
          <ListboxOption as="template" v-for="week in weekOptions" :key="week" :value="week" v-slot="{ active, selected }">
            <li
              :class="[selected || active ? 'bg-primary text-primary-foreground' : 'text-popover-foreground hover:bg-secondary hover:text-secondary-foreground', 'relative cursor-default select-none py-2 pl-3 pr-9 mx-1 my-0.5 rounded-lg transition-colors']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">Pekan {{ week }}</span>

              <span v-if="selected"
                :class="[selected || active ? 'text-primary-foreground' : 'text-primary', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { computed } from 'vue'
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  showAllOption: {
    type: Boolean,
    default: false,
  },
  weeks: {
    type: Array,
    default: null,
  },
  maxWeeks: {
    type: Number,
    default: 30,
  },
});
const emit = defineEmits(['update:modelValue']);

const weekOptions = computed(() => {
  if (Array.isArray(props.weeks) && props.weeks.length > 0) {
    return [...props.weeks]
      .map(Number)
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
  }
  return Array.from({ length: props.maxWeeks }, (_, i) => i + 1);
});
</script>

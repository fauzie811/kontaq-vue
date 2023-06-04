<template>
  <Listbox as="div" :modelValue="modelValue" @update:modelValue="value => emit('update:modelValue', value)" by="id">
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6">
        <span v-if="modelValue || showAllOption" class="block truncate">{{ modelValue ? modelValue.name : 'Semua Kategori'
        }}</span>
        <span v-else class="block text-gray-500 truncate">Pilih Kategori</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <ListboxOptions
          class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <ListboxOption v-if="showAllOption" as="template" :value="null" v-slot="{ active, selected }">
            <li
              :class="[active ? 'bg-green-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">Semua Kategori</span>

              <span v-if="selected"
                :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
          <ListboxOption as="template" v-for="category in categories" :key="category.id" :value="category"
            v-slot="{ active, selected }">
            <li
              :class="[active ? 'bg-green-600 text-white' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
                :style="'padding-left: ' + (0.75 * category.depth) + 'rem;'">{{ category.name }}</span>

              <span v-if="selected"
                :class="[active ? 'text-white' : 'text-green-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
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
import { ref } from 'vue'
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
import { listCategories } from '@/api';

const props = defineProps({
  modelValue: Object,
  rootOnly: Boolean,
  showAllOption: Boolean,
});
const emit = defineEmits(['update:modelValue']);

const categories = ref([]);

const loadData = async () => {
  const data = await listCategories(props.rootOnly);
  categories.value = data.data;
}
loadData();
</script>
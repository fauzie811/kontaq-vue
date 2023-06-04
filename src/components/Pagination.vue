<template>
  <div v-if="meta && meta.from" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
    <div class="flex justify-between flex-1 sm:hidden">
      <button :disabled="meta.current_page == 1" v-on:click="changePage(meta.current_page - 1)"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
      <button :disabled="meta.current_page == last_page" v-on:click="changePage(meta.current_page + 1)"
        class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Next</button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Menampilkan
          {{ ' ' }}
          <span class="font-medium">{{ meta.from }}</span>
          {{ ' ' }}
          sampai
          {{ ' ' }}
          <span class="font-medium">{{ meta.to }}</span>
          {{ ' ' }}
          dari
          {{ ' ' }}
          <span class="font-medium">{{ meta.total }}</span>
          {{ ' ' }}
          hasil
        </p>
      </div>
      <div>
        <nav class="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
          <button :disabled="meta.current_page == 1" v-on:click="changePage(meta.current_page - 1)"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="w-5 h-5" aria-hidden="true" />
          </button>
          <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
          <!-- <a href="#" aria-current="page"
            class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">1</a>
          <a href="#"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
          <a href="#"
            class="relative items-center hidden px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a>
          <span
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
          <a href="#"
            class="relative items-center hidden px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">8</a>
          <a href="#"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">9</a>
          <a href="#"
            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">10</a> -->
          <button :disabled="meta.current_page == meta.last_page" v-on:click="changePage(meta.current_page + 1)"
            class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="w-5 h-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  meta: Object,
});
const emit = defineEmits(['change']);

const changePage = (page) => {
  emit('change', page);
};
</script>
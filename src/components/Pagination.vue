<template>
  <div v-if="meta && meta.from" class="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
    <div class="flex justify-between flex-1 sm:hidden">
      <button :disabled="meta.current_page == 1" v-on:click="changePage(meta.current_page - 1)"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Previous</button>
      <button :disabled="meta.current_page == meta.last_page" v-on:click="changePage(meta.current_page + 1)"
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
          <!-- Current: "z-10 bg-lime-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" -->
          <button v-for="page in pages" v-on:click="changePage(page)"
            :class="[page == meta.current_page ? 'relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-lime-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600' : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0']">{{
              page }}</button>
          <!-- <a href="#" aria-current="page"
            class="relative z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-lime-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">1</a>
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
import { ref, watch } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  meta: Object,
});
const emit = defineEmits(['change']);

const pages = ref([]);

watch(() => props.meta, async (newMeta, oldMeta) => {
  if (newMeta.last_page) {
    pages.value = getPages(newMeta.current_page, newMeta.last_page);
  } else {
    pages.value = [];
  }
})

const changePage = (page) => {
  if (props.meta.current_page != page && page != '...') {
    emit('change', page);
  }
};

const getRange = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((v, i) => i + start)
}

const getPages = (currentPage, pageCount) => {
  let delta
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2)
  }

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1
    range.end += 1
  }

  let pages =
    currentPage > delta
      ? getRange(Math.min(range.start, pageCount - delta), Math.min(range.end, pageCount))
      : getRange(1, Math.min(pageCount, delta + 1))

  const withDots = (value, pair) => (pages.length + 1 !== pageCount ? pair : [value])

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages)
  }

  if (pages[pages.length - 1] < pageCount) {
    pages = pages.concat(withDots(pageCount, ['...', pageCount]))
  }

  return pages
}
</script>
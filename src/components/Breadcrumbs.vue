<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol role="list" class="flex items-center space-x-4">
      <li>
        <div>
          <router-link :to="{ name: 'home' }" class="text-gray-400 hover:text-gray-500">
            <HomeIcon class="flex-shrink-0 w-5 h-5" aria-hidden="true" />
            <span class="sr-only">Home</span>
          </router-link>
        </div>
      </li>
      <li v-for="page in props.pages" :key="page.name">
        <div class="flex items-center">
          <ChevronRightIcon class="flex-shrink-0 w-5 h-5 text-gray-400" aria-hidden="true" />
          <router-link :to="page.route" class="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            :aria-current="page.current ? 'page' : undefined">{{ page.name }}</router-link>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { ChevronRightIcon, HomeIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  pages: Array,
});
</script>
<template>
  <div class="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
    <div class="px-4 py-4 sm:px-6">
      Pengumuman
    </div>
    <div class="px-4 sm:px-6">
      <div role="list" class="divide-y divide-gray-200">
        <router-link :to="'/announcements/' + announcement.id" v-for="announcement in announcements.data"
          :key="announcement.id" class="block py-5">
          <div class="flex items-baseline justify-between gap-x-4">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ announcement.title }}</p>
            <p class="flex-none text-xs text-gray-600">
              <time :datetime="announcement.created_at">{{ relativeDate(announcement.created_at) }}</time>
            </p>
          </div>
          <p class="mt-1 text-sm leading-6 text-gray-600 line-clamp-2">{{ stripTags(announcement.content) }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listAnnouncements } from '@/api';
import { relativeDate, stripTags } from '@/utils';

const announcements = ref({ data: [] });

async function loadData() {
  const { data } = await listAnnouncements();
  announcements.value = data;
}
loadData();
</script>
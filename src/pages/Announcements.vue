<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Pengumuman" />

    <div class="overflow-hidden bg-white rounded-md shadow">
      <div role="list" class="divide-y divide-gray-200">
        <router-link :to="'/announcements/' + announcement.id" v-for="announcement in announcements.data"
          :key="announcement.id" :class="[
            'block px-6 py-4',
            announcement.is_sticky ? 'bg-warning-100' : '',
          ]">
          <div class="flex items-baseline justify-between gap-x-4">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ announcement.title }}</p>
            <p class="flex-none text-xs text-gray-600">
              <time :datetime="announcement.created_at">{{ relativeDate(announcement.created_at) }}</time>
            </p>
          </div>
          <p class="mt-1 text-sm leading-6 text-gray-600 line-clamp-2">{{ stripTags(announcement.content) }}</p>
        </router-link>
      </div>

      <Pagination :meta="announcements" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listAnnouncements } from '@/api';
import { relativeDate, stripTags } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import { ChatBubbleLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';

const breadcrumbs = ref([
  { name: 'Pengumuman', route: '/announcements', current: true },
]);
const page = ref(1);
const announcements = ref({ data: [] });

async function loadData() {
  const { data } = await listAnnouncements(page.value);
  announcements.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}
</script>
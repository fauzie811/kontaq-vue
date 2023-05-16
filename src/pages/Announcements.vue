<template>
  <div>
    <Breadcrumbs :pages="breadcrumbs" />
    <PageHeader class="mt-4" page-title="Pengumuman" />

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="announcement in announcements.data" :key="announcement.id"
        class="flex flex-wrap items-center justify-between py-5 gap-x-6 gap-y-4 sm:flex-nowrap">
        <div>
          <p class="text-sm font-semibold leading-6 text-gray-900">
            <router-link :to="`/announcements/${announcement.id}`" class="hover:underline">{{ announcement.title
            }}</router-link>
          </p>
          <div class="flex items-center mt-1 text-xs leading-5 text-gray-500 gap-x-2">
            <!-- <p>
              <a :href="announcement.author.href" class="hover:underline">{{ announcement.author.name }}</a>
            </p>
            <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
              <circle cx="1" cy="1" r="1" />
            </svg> -->
            <p>
              <time :datetime="announcement.created_at">{{ shortDate(announcement.created_at) }}</time>
            </p>
          </div>
        </div>
        <!-- <dl class="flex justify-between flex-none w-full gap-x-8 sm:w-auto">
          <div class="flex -space-x-0.5">
            <dt class="sr-only">Commenters</dt>
            <dd v-for="commenter in announcement.commenters" :key="commenter.id">
              <img class="w-6 h-6 rounded-full bg-gray-50 ring-2 ring-white" :src="commenter.imageUrl"
                :alt="commenter.name" />
            </dd>
          </div>
          <div class="flex w-16 gap-x-2.5">
            <dt>
              <span class="sr-only">Total comments</span>
              <CheckCircleIcon v-if="announcement.status === 'resolved'" class="w-6 h-6 text-gray-400" aria-hidden="true" />
              <ChatBubbleLeftIcon v-else class="w-6 h-6 text-gray-400" aria-hidden="true" />
            </dt>
            <dd class="text-sm leading-6 text-gray-900">{{ announcement.totalComments }}</dd>
          </div>
        </dl> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listAnnouncements } from '@/api';
import { shortDate } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import { ChatBubbleLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const breadcrumbs = ref([
  { name: 'Pengumuman', route: '/announcements', current: true },
]);
const announcements = ref({ data: [] });

async function loadData() {
  const { data } = await listAnnouncements();
  announcements.value = data;
}
loadData();
</script>
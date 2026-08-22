<template>
  <div>
    <PageHeader class="mb-8" page-title="Pengumuman" />

    <div class="max-w-3xl overflow-hidden bg-card rounded-2xl border border-border shadow-xs text-card-foreground">
      <div role="list" class="divide-y divide-border">
        <router-link :to="'/announcements/' + announcement.id" v-for="announcement in announcements.data"
          :key="announcement.id" :class="[
            'block px-6 py-4 transition-colors',
            announcement.is_sticky ? 'bg-accent/10 hover:bg-accent/15 border-l-4 border-accent' : 'hover:bg-secondary/50',
          ]">
          <div class="flex items-baseline justify-between gap-x-4">
            <p class="text-sm font-semibold leading-6 text-foreground">{{ announcement.title }}</p>
            <p class="flex-none text-xs text-muted-foreground">
              <time :datetime="announcement.created_at">{{ relativeDate(announcement.created_at) }}</time>
            </p>
          </div>
          <p class="mt-1 text-sm leading-6 text-muted-foreground line-clamp-2">{{ stripTags(announcement.content) }}</p>
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
import Pagination from '@/components/Pagination.vue';

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
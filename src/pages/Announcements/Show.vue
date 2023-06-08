<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" :page-title="announcement ? announcement.title : '...'" />

    <div class="max-w-2xl overflow-hidden bg-white rounded-lg shadow">
      <div class="px-4 py-5 sm:p-6">
        <div class="prose" v-html="announcement ? announcement.content : ''"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getAnnouncement } from '@/api';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import PageHeader from '../../components/PageHeader.vue';

const route = useRoute();
const announcement = ref();
const breadcrumbs = ref([
  { name: 'Pengumuman', route: '/announcements', current: false },
]);

async function loadData() {
  const data = await getAnnouncement(route.params.id);
  announcement.value = data.data;
  breadcrumbs.value = [
    ...breadcrumbs.value,
    { name: announcement.value.title, route: `/announcements/${announcement.value.id}`, current: true },
  ]
}
loadData();
</script>
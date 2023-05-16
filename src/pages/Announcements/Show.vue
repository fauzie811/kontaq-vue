<template>
  <div>
    <Breadcrumbs :pages="breadcrumbs" />
    <PageHeader class="mt-4" :page-title="announcement ? announcement.title : '...'" />

    <div class="mt-8 prose" v-html="announcement ? announcement.content : ''"></div>
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
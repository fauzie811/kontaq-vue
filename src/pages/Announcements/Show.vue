<template>
  <div>
    <PageHeader class="mb-8" :page-title="announcement ? announcement.title : '...'" />

    <div class="max-w-3xl overflow-hidden bg-white rounded-lg shadow">
      <div class="px-4 py-5 sm:p-6">
        <div class="prose max-w-none" v-html="announcement ? announcement.content : ''"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getAnnouncement } from '@/api';
import PageHeader from '../../components/PageHeader.vue';

const route = useRoute();
const announcement = ref(null);

async function loadData(id) {
  if (!id) return;
  try {
    const data = await getAnnouncement(id);
    announcement.value = data.data;
  } catch (e) {
    console.error('Failed to load announcement:', e);
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId);
    }
  },
  { immediate: true }
);
</script>

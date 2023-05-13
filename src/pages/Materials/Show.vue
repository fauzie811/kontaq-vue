<template>
  <div>
    <Breadcrumbs :pages="breadcrumbs" />
    <PageHeader class="mt-4" :page-title="material ? material.title : '...'" />

    <div class="mt-8 prose" v-html="material ? material.content : ''"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getMaterial } from '@/api';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import PageHeader from '../../components/PageHeader.vue';

const route = useRoute();
const material = ref();
const breadcrumbs = ref([
  { name: 'Materi Tadabbur', route: { name: 'materials' }, current: false },
]);

async function loadData() {
  const data = await getMaterial(route.params.id);
  material.value = data.data;
  breadcrumbs.value = [
    ...breadcrumbs.value,
    { name: material.value.title, route: { name: 'materials.show', params: { id: material.value.id } }, current: true },
  ]
}
loadData();
</script>
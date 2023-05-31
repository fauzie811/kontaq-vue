<template>
  <div>
    <Breadcrumbs :pages="breadcrumbs" />
    <PageHeader class="mt-4" :page-title="material ? material.title : '...'" />

    <div class="mt-8 prose" v-html="material ? material.content : ''"></div>

    <button @click="finishRead" type="button"
      class="mt-8 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Selesai</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getMyMaterial, updateMyMaterial } from '@/api';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import PageHeader from '../../components/PageHeader.vue';

const route = useRoute();
const router = useRouter();
const material = ref();
const breadcrumbs = ref([
  { name: 'Materi Tadabbur', route: { name: 'materials' }, current: false },
]);

async function loadData() {
  const data = await getMyMaterial(route.params.id);
  material.value = data.data;
  breadcrumbs.value = [
    ...breadcrumbs.value,
    { name: material.value.title, route: { name: 'materials.show', params: { id: material.value.id } }, current: true },
  ]
}
loadData();

async function finishRead() {
  const data = await updateMyMaterial(route.params.id);
  router.push('/materials');
}
</script>
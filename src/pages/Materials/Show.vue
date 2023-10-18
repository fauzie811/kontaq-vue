<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" :page-title="material ? material.title : null" />

    <div v-if="material && material.prologue" :class="[
      'max-w-3xl mb-6 overflow-hidden bg-white rounded-lg shadow',
      font == 'sans' ? 'font-sans' : '',
      font == 'arial' ? 'font-arial' : '',
      font == 'times' ? 'font-times' : '',
    ]">
      <div class="px-4 py-5 sm:p-6">
        <div class="prose max-w-none" v-html="'<h3>Prolog</h3>' + material.prologue"></div>
      </div>
    </div>

    <div :class="[
      'max-w-3xl overflow-hidden bg-white rounded-lg shadow',
      font == 'sans' ? 'font-sans' : '',
      font == 'arial' ? 'font-arial' : '',
      font == 'times' ? 'font-times' : '',
    ]">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="material" class="prose max-w-none" v-html="material.content"></div>
        <div v-else class="prose max-w-none">
          <p>
            <TextPlaceholder class="block" />
          </p>
          <p>
            <TextPlaceholder class="block" />
          </p>
          <p>
            <TextPlaceholder class="block w-96" />
          </p>
        </div>
      </div>
    </div>

    <button @click="finishRead" type="button"
      class="mt-8 rounded-md bg-lime-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">Selesai</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useLocalStorage from '@/plugins/localStorage';
import { getMyMaterial, updateMyMaterial } from '@/api';
import Breadcrumbs from '../../components/Breadcrumbs.vue';
import PageHeader from '../../components/PageHeader.vue';
import TextPlaceholder from '@/components/placeholders/TextPlaceholder.vue';

const route = useRoute();
const router = useRouter();
const font = useLocalStorage('font-family', 'sans');
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
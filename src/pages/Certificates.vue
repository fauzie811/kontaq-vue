<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Sertifikat" />

    <div class="max-w-2xl overflow-hidden bg-white rounded-lg shadow">
      <div class="px-4 py-5 sm:p-6">
        <div v-if="certificate">
          <object class="w-full aspect-[2/3]" :data="certificate.url + '?_token=' + authStore.token"
            type="application/pdf"></object>
        </div>
        <div v-else class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-12 h-12 mx-auto text-gray-400">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"
              d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
          </svg>

          <h3 class="mt-2 text-sm font-semibold text-gray-900">Belum ada sertifikat</h3>
          <!-- <p class="mt-1 text-sm text-gray-500">Get started by creating a new project.</p> -->
          <!-- <div class="mt-6">
            <button type="button"
              class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <PlusIcon class="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Project
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/20/solid';
import authStore from '@/store/auth';
import { getMyCertificate } from '@/api';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import PageHeader from '../components/PageHeader.vue';

const breadcrumbs = ref([
  { name: 'Sertifikat', route: '/certificates', current: true },
]);
const certificate = ref(null);

const loadData = async () => {
  const data = await getMyCertificate();
  certificate.value = data.data;
}
loadData();
</script>
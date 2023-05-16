<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader page-title="Materi Tadabbur">
      <!-- <button type="button"
        class="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Edit</button>
      <button type="button"
        class="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Publish</button> -->
    </PageHeader>

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="material in materials.data" :key="material.id" class="flex items-center justify-between py-5 gap-x-6">
        <div class="min-w-0">
          <div class="flex items-start gap-x-3">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ material.title }}</p>
            <!-- <p
              :class="[statuses[material.status], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
              {{ material.status }}</p> -->
          </div>
          <div class="flex items-center mt-1 text-xs leading-5 text-gray-500 gap-x-2">
            <p class="whitespace-nowrap">
              Tanggal <time :datetime="material.created_at">{{ shortDate(material.created_at) }}</time>
            </p>
            <!-- <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <p class="truncate">Created by {{ material.createdBy }}</p> -->
          </div>
        </div>
        <div class="flex items-center flex-none gap-x-4">
          <router-link :to="{ name: 'materials.show', params: { id: material.id } }"
            class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">Lihat
            materi<span class="sr-only">, {{ material.name }}</span></router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listMaterials } from '@/api';
import { shortDate } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

const breadcrumbs = ref([
  { name: 'Materi Tadabbur', route: { name: 'materials' }, current: true },
]);
const materials = ref({ data: [] });

async function loadData() {
  const data = await listMaterials();
  materials.value = data;
}
loadData();

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
</script>
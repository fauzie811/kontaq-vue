<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Materi Tadabbur">
      <!-- <button type="button"
        class="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Edit</button>
      <button type="button"
        class="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-600 hover:bg-lime-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">Publish</button> -->
    </PageHeader>

    <div class="max-w-3xl">
      <div class="flex justify-end gap-4 mb-4">
        <PartPicker class="w-full sm:w-40" v-model="part_number" @update:modelValue="() => changePage(1)" />
        <CategoryPicker show-all-option class="w-full sm:w-56" v-model="category"
          @update:modelValue="() => changePage(1)" />
      </div>

      <div class="overflow-hidden bg-white rounded-md shadow">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="material in materials.data" :key="material.id"
            class="flex items-center justify-between px-6 py-4 gap-x-6">
            <div class="min-w-0">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-gray-900">{{ material.title }}</p>
                <p
                  :class="[statuses[getStatus(material)], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
                  {{ getStatus(material) }}</p>
              </div>
              <div class="flex items-center mt-1 text-xs leading-5 text-gray-500 gap-x-2">
                <p v-if="material.category" class="truncate">{{ material.category.name }}</p>
                <svg v-if="material.category" viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <p v-if="material.part_number" class="truncate">Juz {{ material.part_number }}</p>
                <svg v-if="material.part_number" viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                  <circle cx="1" cy="1" r="1" />
                </svg>
                <p v-if="material.chapter" class="truncate">Surah {{ material.chapter }}</p>
                <!-- <p class="whitespace-nowrap">
                  Tanggal <time :datetime="material.created_at">{{ shortDate(material.created_at) }}</time>
                </p> -->
              </div>
            </div>
            <div class="flex items-center flex-none gap-x-4">
              <router-link :to="{ name: 'materials.show', params: { id: material.id } }"
                class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">Lihat
                materi<span class="sr-only">, {{ material.name }}</span></router-link>
            </div>
          </li>
        </ul>
        <Pagination :meta="materials" v-on:change="changePage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listMyMaterials } from '@/api';
import { shortDate } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';
import PartPicker from '@/components/PartPicker.vue';

const breadcrumbs = ref([
  { name: 'Materi Tadabbur', route: { name: 'materials' }, current: true },
]);
const page = ref(1);
const category = ref(null);
const part_number = ref(null);
const materials = ref({ data: [] });

async function loadData() {
  const { data } = await listMyMaterials({ page: page.value, category: category.value ? category.value.id : null, part_number: part_number.value });
  materials.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(material) {
  if (material.read_at) return 'Selesai';
  return 'Belum dibaca';
}

const statuses = {
  Selesai: 'text-success-700 bg-success-50 ring-success-600/20',
  'Belum dibaca': 'text-gray-600 bg-gray-50 ring-gray-500/10',
}

</script>
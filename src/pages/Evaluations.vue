<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Evaluasi" />

    <div class="overflow-hidden bg-white rounded-md shadow">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="evaluation in evaluations.data" :key="evaluation.id"
          class="flex items-center justify-between px-6 py-4 gap-x-6">
          <div class="min-w-0">
            <div class="flex items-start gap-x-3">
              <p class="text-sm font-semibold leading-6 text-gray-900">{{ evaluation.title }}</p>
              <p
                :class="[statuses[getStatus(evaluation)], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
                {{ getStatus(evaluation) }}</p>
            </div>
            <div class="flex items-center text-xs leading-5 text-gray-500 gap-x-2">
              <p class="whitespace-nowrap">
                {{ evaluation.duration }} menit
              </p>
            </div>
          </div>
          <div class="flex items-center flex-none gap-x-4">
            <router-link :to="{ name: 'evaluations.show', params: { id: evaluation.id } }"
              class="block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{{
                getButtonLabel(evaluation) }}</router-link>
          </div>
        </li>
      </ul>
      <Pagination :meta="evaluations" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listMyEvaluations } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';

const breadcrumbs = ref([
  { name: 'Evaluasi', route: '/evaluations', current: true },
]);
const page = ref(1);
const evaluations = ref({ data: [] });

async function loadData() {
  const { data } = await listMyEvaluations(page.value);
  evaluations.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(evaluation) {
  if (evaluation.finished_at) return 'Selesai';
  if (evaluation.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}
function getButtonLabel(evaluation) {
  if (evaluation.finished_at) return 'Lihat hasil';
  if (evaluation.started_at) return 'Lanjukan';
  return 'Mulai';
}

const statuses = {
  Selesai: 'text-green-700 bg-green-50 ring-green-600/20',
  'Sedang dikerjakan': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  'Belum dikerjakan': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
</script>
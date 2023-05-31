<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader page-title="Kuis" />

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="quiz in quizzes.data" :key="quiz.id" class="flex items-center justify-between py-4 gap-x-6">
        <div class="min-w-0">
          <div class="flex items-start gap-x-3">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ quiz.title }}</p>
            <p
              :class="[statuses[getStatus(quiz)], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
              {{ getStatus(quiz) }}</p>
          </div>
          <div class="flex items-center text-xs leading-5 text-gray-500 gap-x-2">
            <p class="whitespace-nowrap">
              {{ quiz.duration }} menit
            </p>
          </div>
        </div>
        <div class="flex items-center flex-none gap-x-4">
          <router-link :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
            class="block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{{
              getButtonLabel(quiz) }}</router-link>
        </div>
      </li>
    </ul>

    <Pagination class="mt-5" :meta="quizzes" v-on:change="changePage" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listMyQuizzes } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';

const breadcrumbs = ref([
  { name: 'Kuis', route: '/quizzes', current: true },
]);
const page = ref(1);
const quizzes = ref({ data: [] });

async function loadData() {
  const { data } = await listMyQuizzes(page.value);
  quizzes.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(quiz) {
  if (quiz.finished_at) return 'Selesai';
  if (quiz.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}
function getButtonLabel(quiz) {
  if (quiz.finished_at) return 'Lihat hasil';
  if (quiz.started_at) return 'Lanjukan';
  return 'Mulai';
}

const statuses = {
  Selesai: 'text-green-700 bg-green-50 ring-green-600/20',
  'Sedang dikerjakan': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  'Belum dikerjakan': 'text-gray-600 bg-gray-50 ring-gray-500/10',
}
</script>
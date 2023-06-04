<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Kuis" />

    <div class="flex justify-end mb-4">
      <CategoryPicker show-all-option class="w-full sm:w-64" v-model="category" @update:modelValue="loadData" />
    </div>

    <div class="overflow-hidden bg-white rounded-md shadow">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="quiz in quizzes.data" :key="quiz.id" class="flex items-center justify-between px-6 py-4 gap-x-6">
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
            <button v-if="!quiz.material_read" v-on:click.prevent="showAlert(quiz.material_id)"
              class="block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{{
                getButtonLabel(quiz) }}</button>
            <router-link v-else :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
              class="block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">{{
                getButtonLabel(quiz) }}</router-link>
          </div>
        </li>
      </ul>
      <Pagination :meta="quizzes" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { listMyQuizzes } from '@/api';
import { swConfirm } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';

const router = useRouter();
const breadcrumbs = ref([
  { name: 'Kuis', route: '/quizzes', current: true },
]);
const page = ref(1);
const category = ref();
const quizzes = ref({ data: [] });

async function loadData() {
  const { data } = await listMyQuizzes({ page: page.value, category: category.value ? category.value.id : null });
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

async function showAlert(id) {
  const res = await swConfirm({
    icon: 'warning',
    title: 'Mohon Maaf',
    text: 'Anda harus menyelesaikan materi terkait untuk mengerjakan kuis ini.',
    confirmButtonText: 'Baca Materi',
    cancelButtonText: 'Tutup',
  });
  if (res.isConfirmed && id) router.push(`/materials/${id}`);
}

const statuses = {
  Selesai: 'text-green-700 bg-green-50 ring-green-600/20',
  'Sedang dikerjakan': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
  'Belum dikerjakan': 'text-gray-600 bg-gray-50 ring-gray-500/10',
}
</script>
<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Rapor" />

    <div class="flex justify-end mb-4">
      <CategoryPicker root-only class="w-full sm:w-64" v-model="category" @update:modelValue="loadData" />
    </div>

    <div v-if="reports" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nama Peserta</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" v-for="(quiz, index) in reports.quizzes"
              :key="quiz.id">Kuis {{ index + 1 }}</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              v-for="(evaluation, index) in reports.evaluations" :key="evaluation.id">Evaluasi {{ index + 1 }}</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in reports.items">
            <td class="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">{{ item.name }}</td>
            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" v-for="quiz in reports.quizzes" :key="quiz.id">
              {{ item.scores ? item.scores[`quiz_${quiz.id}`] || '-' : ''
              }}</td>
            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" v-for="evaluation in reports.evaluations"
              :key="evaluation.id">{{
                item.scores ? item.scores[`evaluation_${evaluation.id}`] || '-' : '' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getReports } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';

const breadcrumbs = ref([
  { name: 'Rapor', route: '/reports', current: true },
]);
const category = ref();
const reports = ref();

async function loadData() {
  const data = await getReports(category.value ? category.value.id : null);
  reports.value = data.data;
  console.log(data);
}
loadData();
</script>
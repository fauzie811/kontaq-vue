<template>
  <div>
    <PageHeader page-title="Kuis" />

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="quiz in quizzes.data" :key="quiz.id" class="flex items-center justify-between py-4 gap-x-6">
        <div class="min-w-0">
          <div class="flex items-start gap-x-3">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ quiz.title }}</p>
            <!-- <p
              :class="[statuses[quiz.status], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
              {{ quiz.status }}</p> -->
          </div>
          <div class="flex items-center text-xs leading-5 text-gray-500 gap-x-2">
            <p class="whitespace-nowrap">
              {{ quiz.duration }} menit
            </p>
          </div>
        </div>
        <div class="flex items-center flex-none gap-x-4">
          <router-link :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
            class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">Mulai</router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { listQuizzes } from '@/api';
import PageHeader from '../components/PageHeader.vue';

const quizzes = ref({ data: [] });

async function loadData() {
  const { data } = await listQuizzes();
  quizzes.value = data;
}
loadData();

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
const projects = [
  {
    id: 1,
    name: 'GraphQL API',
    href: '#',
    status: 'Complete',
    duration: 60,
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Archived',
    duration: 60,
  },
]
</script>
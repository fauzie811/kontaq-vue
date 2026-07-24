<template>
  <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
    <div class="md:col-span-2 lg:col-span-3">
      <div v-if="evaluation" class="mt-4 space-y-5">
        <PageHeader :page-title="evaluation.title" />

        <!-- Active Evaluation Questions -->
        <template v-if="(evaluation && userEvaluation) && !userEvaluation.finished_at">
          <QuestionCard
            v-for="(question, index) in evaluation.questions"
            :key="question.id"
            :question="question"
            :index="index"
            v-model="selected[question.id]"
          />
        </template>

        <!-- Completed Evaluation Review -->
        <div v-if="userEvaluation && userEvaluation.finished_at" class="overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          <div class="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 text-center">
            <h3 class="text-xl font-bold text-emerald-900 mb-1">Jazaakumullah khayran katsiran</h3>
            <p class="text-base text-emerald-800">Nilai Anda: <strong class="text-2xl font-bold text-emerald-950">{{ userEvaluation.score }}</strong></p>
          </div>

          <div
            v-for="(question, index) in evaluation.questions"
            :key="question.id"
            class="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden"
          >
            <!-- Question Header -->
            <div class="bg-[#f0f2f1] flex items-stretch min-h-[52px] border-b border-gray-200/60">
              <div class="bg-[#dcfce7] text-[#144227] w-12 sm:w-14 flex items-center justify-center font-bold text-lg sm:text-xl flex-shrink-0">
                {{ index + 1 }}
              </div>
              <div class="px-4 py-3 flex items-center text-gray-900 font-semibold text-base sm:text-lg flex-1 leading-snug">
                <div class="prose max-w-none text-gray-900 font-semibold text-base sm:text-lg" v-html="question.content"></div>
              </div>
            </div>

            <!-- Options Review List -->
            <div class="py-1">
              <div
                v-for="option in ['a', 'b', 'c', 'd']"
                :key="option"
                :class="[
                  userEvaluation.answers[question.id] === option ? 'bg-[#bbf7d0] text-emerald-950 font-medium' : 'text-gray-800',
                  'flex items-center px-4 sm:px-6 py-3 text-base'
                ]"
              >
                <CheckIcon
                  class="flex-shrink-0 w-5 h-5 mr-3"
                  :class="[question.answer === option ? 'text-emerald-700 font-bold' : 'opacity-0']"
                />
                <span class="mr-2 font-normal text-base">{{ option }}.</span>
                <span class="text-base leading-relaxed">{{ question.details[`option_${option}`] || question.details[`option_${option} `] }}</span>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <router-link
              to="/evaluations"
              class="inline-flex rounded-full bg-[#144227] hover:bg-[#0f321d] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition"
            >
              Kembali
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Sidebar Timer & Action -->
    <div>
      <div v-if="(evaluation && userEvaluation) && !userEvaluation.finished_at" class="space-y-5 md:sticky md:top-20">
        <div class="overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200/80 p-5 text-center">
          <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Sisa Waktu</h3>
          <p class="text-2xl font-bold text-emerald-800 font-mono">
            <Countdown :start-time="parseISO(userEvaluation.created_at)" :duration="evaluation.duration" @finished="forceFinish" />
          </p>
        </div>

        <button
          @click="submitAnswers"
          type="button"
          class="w-full rounded-full bg-[#144227] hover:bg-[#0f321d] px-4 py-3 text-base font-bold text-white shadow-md transition cursor-pointer"
        >
          Selesai
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckIcon } from '@heroicons/vue/24/outline';
import parseISO from 'date-fns/parseISO';

import { swAlert } from '@/utils';
import { getMyEvaluation, updateMyEvaluation } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import Countdown from '@/components/Countdown.vue';
import QuestionCard from '@/components/QuestionCard.vue';

const route = useRoute();
const router = useRouter();

const selected = ref({});
const evaluation = ref();
const userEvaluation = ref();

async function loadData() {
  const data = await getMyEvaluation(route.params.id);
  evaluation.value = data.data.evaluation;
  userEvaluation.value = data.data.user_evaluation;
  if (!data.success) return showAlert();
}
loadData();

async function showAlert() {
  await swAlert({
    icon: 'warning',
    title: 'Mohon Maaf',
    text: 'Anda harus menyelesaikan semua kuis terkait untuk mengerjakan evaluasi ini.',
    buttonText: 'Kembali',
  });
  router.back();
}

async function submitAnswers() {
  await updateMyEvaluation(route.params.id, selected.value);
  router.push('/evaluations');
}

const forceFinish = () => {
  alert('Waktu habis!');
  submitAnswers();
};
</script>
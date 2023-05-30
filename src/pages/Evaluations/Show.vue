<template>
  <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
    <div class="md:col-span-2 lg:col-span-3">
      <Breadcrumbs :pages="breadcrumbs" />
      <div v-if="evaluation" class="mt-4 space-y-5">
        <PageHeader :page-title="evaluation.title" />
        <template v-if="evaluation && !userEvaluation.finished_at">
          <div v-for="question, index in evaluation.questions" :key="question.id"
            class="overflow-hidden bg-white rounded-lg shadow">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-start gap-2">
                <p class="flex-shrink-0 leading-7">{{ index + 1 }}.</p>
                <div class="flex-1 prose" v-html="question.content"></div>
              </div>

              <RadioGroup class="mt-5" v-model="selected[question.id]">
                <div class="relative -space-y-px bg-white rounded-md">
                  <RadioGroupOption :key="question.id + '_a'" value="a" v-slot="{ checked, active }">
                    <div
                      :class="['rounded-tl-md rounded-tr-md', checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-indigo-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        a.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_a }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_b'" value="b" v-slot="{ checked, active }">
                    <div
                      :class="[checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-indigo-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        b.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_b }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_c'" value="c" v-slot="{ checked, active }">
                    <div
                      :class="[checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-indigo-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        c.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_c }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_d'" value="d" v-slot="{ checked, active }">
                    <div
                      :class="['rounded-bl-md rounded-br-md', checked ? 'z-10 border-indigo-200 bg-indigo-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-indigo-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-indigo-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        d.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-indigo-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_d }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
          </div>
        </template>
        <div v-if="userEvaluation.finished_at"
          class="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
          <div class="px-4 py-5 space-y-5 sm:p-6">
            <p>Jazaakumullah khayran katsiran.</p>
            <p>Nilai Anda <strong>{{ userEvaluation.score }}</strong></p>

            <div v-for="question, index in evaluation.questions" :key="question.id"
              class="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <div class="px-4 py-3">
                <div class="flex items-start gap-2">
                  <p class="flex-shrink-0 leading-7">{{ index + 1 }}.</p>
                  <div class="flex-1 prose" v-html="question.content"></div>
                </div>

                <div class="mt-3 text-sm text-gray-700">
                  <div v-for="option in ['a', 'b', 'c', 'd']" class="flex items-center gap-2 px-2 py-1.5 rounded"
                    :class="[userEvaluation.answers[question.id] == option ? 'bg-gray-100' : '']">
                    <CheckIcon class="flex-shrink-0 w-5 h-5 text-green-600"
                      :class="[question.answer == option ? '' : 'opacity-0']" />
                    <p class="flex-shrink-0">{{ option }}.</p>
                    <p>{{ question.details[`option_${option}`] }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6">
            <router-link to="/evaluations"
              class="inline-flex rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Kembali</router-link>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="evaluation && !userEvaluation.finished_at" class="space-y-5 md:sticky md:top-0">
        <div class="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-center">Sisa Waktu</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <p class="text-lg font-semibold text-center">
              <Countdown :start-time="parseISO(userEvaluation.created_at)" :duration="evaluation.duration"
                @finished="forceFinish" />
            </p>
          </div>
        </div>

        <button @click="submitAnswers" type="button"
          class="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Selesai</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/outline';
import parseISO from 'date-fns/parseISO';

import { getMyEvaluation, updateMyEvaluation } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Countdown from '@/components/Countdown.vue';

const route = useRoute();
const router = useRouter();

const selected = ref({})
const evaluation = ref();
const userEvaluation = ref();
const breadcrumbs = ref([
  { name: 'Evaluasi', route: { name: 'evaluations' }, current: false },
]);

async function loadData() {
  const data = await getMyEvaluation(route.params.id);
  evaluation.value = data.data.evaluation;
  userEvaluation.value = data.data.user_evaluation;
  breadcrumbs.value = [
    ...breadcrumbs.value,
    { name: evaluation.value.title, route: { name: 'evaluations.show', params: { id: evaluation.value.id } }, current: true },
  ]
}
loadData();

async function submitAnswers() {
  const data = await updateMyEvaluation(route.params.id, selected.value);
  router.push('/evaluations');
}

const forceFinish = () => {
  alert('Waktu habis!');
  submitAnswers();
}
</script>
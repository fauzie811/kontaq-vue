<template>
  <div class="grid gap-5 md:grid-cols-3 lg:grid-cols-4">
    <div class="md:col-span-2 lg:col-span-3">
      <Breadcrumbs :pages="breadcrumbs" />
      <div v-if="quiz" class="mt-4 space-y-5">
        <PageHeader :page-title="quiz.title" />
        <template v-if="quiz && !userQuiz.finished_at">
          <div v-for="question, index in quiz.questions" :key="question.id"
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
                      :class="['rounded-tl-md rounded-tr-md', checked ? 'z-10 border-lime-200 bg-lime-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-lime-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-lime-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        a.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_a }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_b'" value="b" v-slot="{ checked, active }">
                    <div
                      :class="[checked ? 'z-10 border-lime-200 bg-lime-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-lime-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-lime-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        b.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_b }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_c'" value="c" v-slot="{ checked, active }">
                    <div
                      :class="[checked ? 'z-10 border-lime-200 bg-lime-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-lime-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-lime-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        c.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_c }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                  <RadioGroupOption :key="question.id + '_d'" value="d" v-slot="{ checked, active }">
                    <div
                      :class="['rounded-bl-md rounded-br-md', checked ? 'z-10 border-lime-200 bg-lime-50' : 'border-gray-200', 'relative cursor-pointer border p-4 flex items-center text-sm focus:outline-none md:pl-4 md:pr-6']">
                      <span
                        :class="[checked ? 'bg-lime-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-lime-600' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
                        aria-hidden="true">
                        <span class="rounded-full bg-white w-1.5 h-1.5" />
                      </span>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        d.</RadioGroupLabel>
                      <RadioGroupLabel as="span" :class="[checked ? 'text-lime-900' : 'text-gray-900', 'ml-3']">
                        {{ question.details.option_d }}</RadioGroupLabel>
                    </div>
                  </RadioGroupOption>
                </div>
              </RadioGroup>
            </div>
          </div>
        </template>
        <div v-if="userQuiz.finished_at" class="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
          <div class="px-4 py-5 space-y-5 sm:p-6">
            <p>Jazaakumullah khayran katsiran.</p>
            <p>Nilai Anda <strong>{{ userQuiz.score }}</strong></p>

            <div v-for="question, index in quiz.questions" :key="question.id"
              class="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
              <div class="px-4 py-3">
                <div class="flex items-start gap-2">
                  <p class="flex-shrink-0 leading-7">{{ index + 1 }}.</p>
                  <div class="flex-1 prose" v-html="question.content"></div>
                </div>

                <div class="mt-3 text-sm text-gray-700">
                  <div v-for="option in ['a', 'b', 'c', 'd']" class="flex items-center gap-2 px-2 py-1.5 rounded"
                    :class="[userQuiz.answers[question.id] == option ? 'bg-gray-100' : '']">
                    <CheckIcon class="flex-shrink-0 w-5 h-5 text-lime-600"
                      :class="[question.answer == option ? '' : 'opacity-0']" />
                    <p class="flex-shrink-0">{{ option }}.</p>
                    <p>{{ question.details[`option_${option}`] }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6">
            <router-link to="/quizzes"
              class="inline-flex rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Kembali</router-link>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div v-if="quiz && !userQuiz.finished_at" class="space-y-5 md:sticky md:top-0">
        <div class="overflow-hidden bg-white divide-y divide-gray-200 rounded-lg shadow">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-center">Sisa Waktu</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <p class="text-lg font-semibold text-center">
              <Countdown :start-time="parseISO(userQuiz.created_at)" :duration="quiz.duration" @finished="forceFinish" />
            </p>
          </div>
        </div>

        <button @click="submitAnswers" type="button"
          class="w-full rounded-md bg-lime-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">Selesai</button>
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

import { getMyQuiz, updateMyQuiz } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Countdown from '@/components/Countdown.vue';

const route = useRoute();
const router = useRouter();

const selected = ref({})
const quiz = ref();
const userQuiz = ref();
const breadcrumbs = ref([
  { name: 'Kuis', route: { name: 'quizzes' }, current: false },
]);

async function loadData() {
  const data = await getMyQuiz(route.params.id);
  quiz.value = data.data.quiz;
  userQuiz.value = data.data.user_quiz;
  breadcrumbs.value = [
    ...breadcrumbs.value,
    { name: quiz.value.title, route: { name: 'quizzes.show', params: { id: quiz.value.id } }, current: true },
  ]
}
loadData();

async function submitAnswers() {
  const data = await updateMyQuiz(route.params.id, selected.value);
  router.push('/quizzes');
}

const forceFinish = () => {
  alert('Waktu habis!');
  submitAnswers();
}

/*
const questions = [
  {
    id: 1,
    question: 'Rasul-rasul sebelum Nabi Muhammad juga didustakan oleh ummatnya, hal ini dijelaskan pada ayat ...',
    option_a: '7',
    option_b: '6',
    option_c: '5',
    option_d: '4',
  },
  {
    id: 2,
    question: 'Di bawah ini adalah peringatan-peringatan Allah yang bermanfaat buat umat sesuai surah Fatir 4-11, kecuali ...',
    option_a: 'Jangan mau diperdaya dunia, sesungguhnya janji Allah adalah benar.',
    option_b: 'Setan adalah musuh bagi manusia, maka perlakukanlah ia sebagai musuhmu.',
    option_c: 'Orang kafir akan mendapat azab yang sangat pedih.',
    option_d: 'Apa saja rahmat Allah yang dianugerahkan kepada manusia, maka tidak ada yang bisa menahannya, dan apa saja yang Allah tahan, maka tidak ada yang bisa melepaskan.',
  },
  {
    id: 3,
    question: 'Perhatikan pernyataan di bawah ini, yang tidak sesuai dengan no. ayatnya adalah ...',
    option_a: 'Umur seseorang telah ditetapkan dan ditulis dalam kitab Lauh Mahfuz; ayat 11.',
    option_b: 'Kemuliaan adalah milik Allah. Allah akan menerima perkataan-perkataan baik dan amal shaleh; ayat 10.',
    option_c: 'Allah akan menyesatkan dan memberi petunjuk bagi siapa yang dikehendakiNya; ayat 9',
    option_d: 'Sesungguhnya Allah Maha Tahu apa yang manusia perbuat; ayat 8.',
  },
]*/
</script>
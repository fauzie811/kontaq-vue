<template>
  <div class="space-y-5">
    <template v-if="quiz">
      <div v-for="question in quiz.questions" :key="question.id" class="overflow-hidden bg-white rounded-lg shadow">
        <div class="px-4 py-5 sm:p-6">
          <div class="prose" v-html="question.content"></div>

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

    <button type="button"
      class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Selesai</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'
import { getQuiz } from '@/api';

const route = useRoute();

const selected = ref({})
const quiz = ref();

async function loadData() {
  const data = await getQuiz(route.params.id);
  quiz.value = data.data;
}
loadData();

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
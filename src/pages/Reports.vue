<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Rapor" />

    <div class="mb-4 sm:flex">
      <InputFrame class="w-full sm:w-64" label="Grup">
        <p v-if="authStore.user && authStore.user.group">{{ authStore.user.group.name }}</p>
        <TextPlaceholder v-else class="block w-32" />
      </InputFrame>
      <CategoryPicker root-only class="w-full ml-auto sm:w-56" v-model="category" @update:modelValue="loadData" />
    </div>

    <div v-if="reports" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table class="min-w-full divide-y divide-gray-300">
        <thead class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">#</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Nama Peserta</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
              v-for="(quiz, index) in reports.quizzes" :key="quiz.id">Kuis {{ index + 1 }}</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
              v-for="evaluation in reports.evaluations" :key="evaluation.id">Evaluasi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, idx) in reports.items">
            <td class="py-4 pl-4 whitespace-nowrap sm:pl-6">
              {{ idx + 1 }}
            </td>
            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
              <p class="text-xs text-gray-500">{{ item.username }}</p>
              <p class="text-sm font-medium text-gray-900 ">{{ item.name }}</p>
            </td>
            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" v-for="quiz in reports.quizzes" :key="quiz.id">
              <QuizScore :score="item.scores ? item.scores[`quiz_${quiz.id}`] : undefined"
                @update-score="score => updateScore(item.id, `quiz_${quiz.id}`, score)" />
            </td>
            <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap" v-for="evaluation in reports.evaluations"
              :key="evaluation.id">
              <EvaluationScore :score="item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined" />
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-gray-50">
          <tr>
            <th class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"></th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"></th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
              v-for="quiz in reports.quizzes" :key="quiz.id">{{ totals[`quiz_${quiz.id}`] }}</th>
            <th class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 text-center"
              v-for="evaluation in reports.evaluations" :key="evaluation.id"></th>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- <div v-if="reports" class="flex justify-end mt-4">
      <button @click="shareDialog = true" type="button"
        class="px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-600 hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600">Bagikan</button>
    </div> -->

    <TransitionRoot as="template" :show="shareDialog">
      <Dialog as="div" class="relative z-50" @close="shareDialog = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div class="mt-3 sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">Rekap KontaQ
                    </DialogTitle>
                    <div class="mt-2 text-sm" ref="shareContent">
                      REKAP KONTAQ GRUP {{ authStore.user ? authStore.user.group.name : '-' }}<br />
                      📡 {{ category ? category.name : '-' }}<br />
                      ➖➖➖➖➖➖➖➖<br />
                      Admin : {{ reports.items[0].name }}<br />
                      Asmin : {{ reports.items[1].name }}<br />
                      <br />
                      📋 Kuis wajib dikerjakan<br />
                      <br />
                      🆔 1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ <br />
                      <br />
                      <span v-for="(item, idx) in reports.items">
                        {{ `${idx + 1}`.padStart(2, '0') }}
                        <span class="text-red-600" v-for="quiz in reports.quizzes" :key="quiz.id">
                          {{ quizScoreEmoji(item.scores ? item.scores[`quiz_${quiz.id}`] : undefined) }}
                        </span>
                        <span v-for="evaluation in reports.evaluations" :key="evaluation.id">
                          {{ evaluationScoreEmoji(item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined) }}
                        </span>
                        {{ item.name }}
                        <br />
                      </span>
                      💯 {{ reports.quizzes.map(q => totals[`quiz_${q.id}`]).join('-') }}<br />
                      <br />
                      ➖➖➖➖➖➖➖➖➖<br />
                      <br />
                      📝 Keterangan :<br />
                      💯 = Kholas tadabbur harian<br />
                      🎓 = Kholas Evaluasi<br />
                      ✖️ = Tidak ada kabar<br />
                      ℹ️ = Izin / Sakit<br />
                      🏆 = Peringkat 10 besar<br />
                      🆕 = SK baru bergabung<br />
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                    class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-lime-600 hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600 sm:col-start-2"
                    @click="shareDialog = false">Tutup</button>
                  <button type="button"
                    class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="copyShare">Salin</button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { getReports, updateReport } from '@/api';
import authStore from '@/store/auth';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';
import InputFrame from '@/components/forms/InputFrame.vue';
import TextPlaceholder from '@/components/placeholders/TextPlaceholder.vue';
import EvaluationScore from '@/components/EvaluationScore.vue';
import QuizScore from '@/components/QuizScore.vue';

const route = useRoute();
const breadcrumbs = ref([
  { name: 'Rapor', route: '/reports', current: true },
]);
const category = ref();
const reports = ref();
const totals = ref({});
const shareDialog = ref(false);

async function loadData() {
  if (category.value) {
    const data = await getReports(category.value ? category.value.id : null);
    reports.value = data.data;
    calculateTotals();
    console.log(data);
  }
}
loadData();

const updateScore = async (userId, key, value) => {
  const data = await updateReport({ user_id: userId, category_id: category.value.id, scores: { [key]: value } });
  const items = reports.value.items;
  items.forEach(i => {
    if (i.id == userId) {
      i.scores = {
        ...i.scores,
        [key]: value,
      };
    }
  });
  reports.value = {
    ...reports.value,
    items: [
      ...items,
    ],
  };
}

const calculateTotals = () => {
  let totalsTemp = {};
  if (reports.value) {
    reports.value.quizzes.forEach(quiz => {
      totalsTemp[`quiz_${quiz.id}`] = 0;
    });
    reports.value.items.forEach(item => {
      Object.keys(totalsTemp).forEach(q => {
        if (item.scores != null && item.scores[q] == 100) totalsTemp[q]++;
      });
    });
  }
  totals.value = totalsTemp;
};

const quizScoreEmoji = (score) => {
  if (score === null || score === undefined) return '✖️ ';
  if (score == 'i') return 'ℹ️ ';
  if (score == 'n') return '🆕 ';
  if (score == 100) return '💯 ';
  return score + ' ';
}

const evaluationScoreEmoji = (score) => {
  if (score === null || score === undefined) return '✖️';
  return '🎓';
}

const shareContent = ref();
const copyShare = () => {
  navigator.clipboard.writeText(shareContent.value.innerText);
}
</script>
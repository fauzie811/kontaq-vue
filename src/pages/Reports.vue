<template>
  <div>
    <PageHeader class="mb-8" page-title="Rapor" />

    <div class="mb-4 sm:flex">
      <InputFrame class="w-full sm:w-64" label="Grup">
        <p v-if="authStore.user && authStore.user.group">{{ authStore.user.group.name }}</p>
        <TextPlaceholder v-else class="block w-32" />
      </InputFrame>
      <WeekPicker class="w-full ml-auto sm:w-56" v-model="week" @update:modelValue="loadData" />
    </div>

    <div v-if="reports" class="overflow-x-auto rounded-2xl border border-border shadow-xs">
      <table class="min-w-full divide-y divide-border">
        <thead class="bg-muted/50">
          <tr>
            <th class="sticky left-0 z-10 bg-muted/50 w-10 min-w-10 py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground">#</th>
            <th class="sticky left-10 z-10 bg-muted/50 border-r border-border shadow-xs py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground">Nama Peserta</th>
            <th class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground text-center"
              v-for="(quiz, index) in reports.quizzes" :key="quiz.id">Kuis {{ index + 1 }}</th>
            <th class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground text-center"
              v-for="evaluation in reports.evaluations" :key="evaluation.id">Evaluasi</th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border text-card-foreground">
          <tr v-for="(item, idx) in reports.items" :key="item.id">
            <td class="sticky left-0 z-10 bg-card w-10 min-w-10 py-2.5 px-2.5 sm:py-4 sm:px-3 text-xs sm:text-sm whitespace-nowrap text-muted-foreground">
              {{ idx + 1 }}
            </td>
            <td class="sticky left-10 z-10 bg-card border-r border-border shadow-xs py-2.5 px-2.5 sm:py-4 sm:px-3 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              <p class="text-xs text-muted-foreground">{{ item.username }}</p>
              <p class="text-xs sm:text-sm font-medium text-foreground">{{ item.name }}</p>
            </td>
            <td class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-xs sm:text-sm text-muted-foreground whitespace-nowrap" v-for="quiz in reports.quizzes" :key="quiz.id">
              <QuizScore :score="item.scores ? item.scores[`quiz_${quiz.id}`] : undefined"
                @update-score="score => updateScore(item.id, `quiz_${quiz.id}`, score)" />
            </td>
            <td class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-xs sm:text-sm text-muted-foreground whitespace-nowrap" v-for="evaluation in reports.evaluations"
              :key="evaluation.id">
              <EvaluationScore :score="item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined" />
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-muted/50">
          <tr>
            <th class="sticky left-0 z-10 bg-muted/50 w-10 min-w-10 py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground"></th>
            <th class="sticky left-10 z-10 bg-muted/50 border-r border-border shadow-xs py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground"></th>
            <th class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground text-center"
              v-for="quiz in reports.quizzes" :key="quiz.id">{{ totals[`quiz_${quiz.id}`] }}</th>
            <th class="py-2.5 px-2.5 sm:py-4 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground text-center"
              v-for="evaluation in reports.evaluations" :key="evaluation.id"></th>
          </tr>
        </tfoot>
      </table>
    </div>

    <TransitionRoot as="template" :show="shareDialog">
      <Dialog as="div" class="relative z-50" @close="shareDialog = false">
        <TransitionChild as="template" enter="ease-out duration-250" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-xs" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-250"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-[0.96]"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-150"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-[0.96]">
              <DialogPanel
                class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-card border border-border text-card-foreground rounded-2xl shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div class="mt-3 sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-foreground">Rekap KontaQ
                    </DialogTitle>
                    <div class="mt-2 text-sm text-muted-foreground" ref="shareContent">
                      REKAP KONTAQ GRUP {{ authStore.user ? authStore.user.group.name : '-' }}<br />
                      Pekan {{ week }}<br />
                      ➖➖➖➖➖➖➖➖<br />
                      Admin : {{ reports.items[0] ? reports.items[0].name : '-' }}<br />
                      Asmin : {{ reports.items[1] ? reports.items[1].name : '-' }}<br />
                      <br />
                      Kuis wajib dikerjakan<br />
                      <br />
                      1 2 3 4 5 6 <br />
                      <br />
                      <span v-for="(item, idx) in reports.items">
                        {{ `${idx + 1}`.padStart(2, '0') }}
                        <span class="text-destructive" v-for="quiz in reports.quizzes" :key="quiz.id">
                          {{ quizScoreEmoji(item.scores ? item.scores[`quiz_${quiz.id}`] : undefined) }}
                        </span>
                        <span v-for="evaluation in reports.evaluations" :key="evaluation.id">
                          {{ evaluationScoreEmoji(item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined) }}
                        </span>
                        {{ item.name }}
                        <br />
                      </span>
                      Totals: {{ reports.quizzes.map(q => totals[`quiz_${q.id}`]).join('-') }}<br />
                      <br />
                      ➖➖➖➖➖➖➖➖➖<br />
                      <br />
                      Keterangan :<br />
                      Kholas tadabbur harian<br />
                      Kholas Evaluasi<br />
                      Tidak ada kabar<br />
                      Izin / Sakit<br />
                      Peringkat 10 besar<br />
                      SK baru bergabung<br />
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button type="button"
                    class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl shadow-xs transition-colors sm:col-start-2 cursor-pointer"
                    @click="shareDialog = false">Tutup</button>
                  <button type="button"
                    class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-secondary-foreground bg-secondary hover:bg-secondary/80 border border-border rounded-xl shadow-xs transition-colors sm:col-start-1 sm:mt-0 cursor-pointer"
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
import WeekPicker from '@/components/WeekPicker.vue';
import InputFrame from '@/components/forms/InputFrame.vue';
import TextPlaceholder from '@/components/placeholders/TextPlaceholder.vue';
import EvaluationScore from '@/components/EvaluationScore.vue';
import QuizScore from '@/components/QuizScore.vue';

const route = useRoute();
const week = ref(1);
const reports = ref();
const totals = ref({});
const shareDialog = ref(false);

async function loadData() {
  if (week.value) {
    const data = await getReports(week.value);
    reports.value = data.data;
    calculateTotals();
    console.log(data);
  }
}
loadData();

const updateScore = async (userId, key, value) => {
  const data = await updateReport({ user_id: userId, week: week.value, scores: { [key]: value } });
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
  if (score === null || score === undefined) return 'X ';
  if (score == 'i') return 'I ';
  if (score == 'n') return 'N ';
  if (score == 100) return '100 ';
  return score + ' ';
}

const evaluationScoreEmoji = (score) => {
  if (score === null || score === undefined) return 'X';
  return 'OK';
}

const shareContent = ref();
const copyShare = () => {
  navigator.clipboard.writeText(shareContent.value.innerText);
}
</script>
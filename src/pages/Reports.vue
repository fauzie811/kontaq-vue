<template>
  <div>
    <PageHeader
      class="mb-6 sm:mb-8"
      page-title="Rapor"
      description="Rekap nilai kuis dan evaluasi peserta per pekan."
    >
      <Button v-if="reports && reports.items.length" type="button" class="gap-2" @click="shareDialog = true">
        <ClipboardList class="w-4 h-4" />
        <span>Rekap</span>
      </Button>
    </PageHeader>

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <InputFrame class="w-full sm:w-64" label="Grup">
        <p v-if="authStore.user && authStore.user.group">{{ authStore.user.group.name }}</p>
        <TextPlaceholder v-else class="block w-32" />
      </InputFrame>
      <WeekPicker class="w-full sm:ml-auto sm:w-56" v-model="week" @update:modelValue="loadData" />
    </div>

    <!-- SKELETON LOADING -->
    <div
      v-if="isLoading"
      class="animate-pulse divide-y divide-border/60 overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      aria-hidden="true"
    >
      <div class="h-11 bg-muted/60 sm:h-14"></div>
      <div v-for="i in 6" :key="i" class="flex items-center gap-3 px-3 py-4 sm:px-4">
        <div class="h-3.5 w-6 rounded-full bg-muted"></div>
        <div class="h-3.5 w-32 rounded-full bg-muted sm:w-44"></div>
        <div class="ml-auto hidden h-3.5 w-10 rounded-full bg-muted/70 sm:block"></div>
        <div class="hidden h-3.5 w-10 rounded-full bg-muted/70 sm:block"></div>
        <div class="hidden h-3.5 w-10 rounded-full bg-muted/70 sm:block"></div>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div
      v-else-if="loadError"
      class="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-xs sm:p-12"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 text-danger-600 shadow-inner">
        <CircleAlert class="h-8 w-8" />
      </div>
      <h4 class="mb-1 text-base font-bold text-foreground">Gagal Memuat Rapor</h4>
      <p class="mb-5 max-w-md text-sm text-muted-foreground">
        Terjadi kesalahan saat memuat rapor. Silakan coba lagi.
      </p>
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 active:scale-[0.98]"
        @click="loadData"
      >
        <RotateCcw class="h-3.5 w-3.5" />
        <span>Coba Lagi</span>
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-else-if="!reports || reports.items.length === 0"
      class="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-xs sm:p-12"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
        <Users class="h-8 w-8" />
      </div>
      <h4 class="mb-1 text-base font-bold text-foreground">Belum Ada Peserta</h4>
      <p class="max-w-md text-sm text-muted-foreground">
        Rapor untuk <span class="font-semibold text-foreground">Pekan {{ week }}</span> belum memiliki data peserta.
      </p>
    </div>

    <!-- REPORT TABLE -->
    <div v-else class="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
      <table class="min-w-full divide-y divide-border">
        <caption class="sr-only">Rapor nilai kuis dan evaluasi peserta</caption>
        <thead class="bg-muted">
          <tr>
            <th scope="col"
              class="sticky left-0 z-10 w-10 min-w-10 bg-muted py-2.5 px-2.5 text-left text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm">
              #</th>
            <th scope="col"
              class="sticky left-10 z-10 whitespace-nowrap border-r border-border bg-muted py-2.5 px-2.5 text-left text-xs font-semibold text-foreground shadow-xs sm:px-3 sm:py-4 sm:text-sm">
              Nama Peserta</th>
            <th scope="col" v-for="(quiz, index) in reports.quizzes" :key="quiz.id"
              class="whitespace-nowrap py-2.5 px-2.5 text-center text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm">
              Kuis {{ index + 1 }}</th>
            <th scope="col" v-for="(evaluation, index) in reports.evaluations" :key="evaluation.id"
              class="whitespace-nowrap py-2.5 px-2.5 text-center text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm">
              Evaluasi {{ index + 1 }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border text-card-foreground">
          <tr v-for="(item, idx) in reports.items" :key="item.id">
            <td
              class="sticky left-0 z-10 w-10 min-w-10 whitespace-nowrap bg-card py-2.5 px-2.5 text-xs text-muted-foreground sm:px-3 sm:py-4 sm:text-sm">
              {{ idx + 1 }}
            </td>
            <td
              class="sticky left-10 z-10 whitespace-nowrap border-r border-border bg-card py-2.5 px-2.5 text-xs text-muted-foreground shadow-xs sm:px-3 sm:py-4 sm:text-sm">
              <p class="text-xs text-muted-foreground">{{ item.username }}</p>
              <p class="text-xs font-medium text-foreground sm:text-sm">{{ item.name }}</p>
            </td>
            <td class="whitespace-nowrap py-2.5 px-2.5 text-xs text-muted-foreground sm:px-3 sm:py-4 sm:text-sm"
              v-for="quiz in reports.quizzes" :key="quiz.id">
              <QuizScore :score="item.scores ? item.scores[`quiz_${quiz.id}`] : undefined"
                @update-score="score => updateScore(item.id, `quiz_${quiz.id}`, score)" />
            </td>
            <td class="whitespace-nowrap py-2.5 px-2.5 text-xs text-muted-foreground sm:px-3 sm:py-4 sm:text-sm"
              v-for="evaluation in reports.evaluations" :key="evaluation.id">
              <EvaluationScore :score="item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined" />
            </td>
          </tr>
        </tbody>
        <tfoot class="bg-muted">
          <tr>
            <th scope="col"
              class="sticky left-0 z-10 w-10 min-w-10 bg-muted py-2.5 px-2.5 text-left text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm"></th>
            <th scope="col"
              class="sticky left-10 z-10 whitespace-nowrap border-r border-border bg-muted py-2.5 px-2.5 text-left text-xs font-semibold text-foreground shadow-xs sm:px-3 sm:py-4 sm:text-sm">
              Total</th>
            <th scope="col" v-for="quiz in reports.quizzes" :key="quiz.id"
              class="py-2.5 px-2.5 text-center text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm">
              {{ totals[`quiz_${quiz.id}`] }}</th>
            <th scope="col" v-for="evaluation in reports.evaluations" :key="evaluation.id"
              class="py-2.5 px-2.5 text-center text-xs font-semibold text-foreground sm:px-3 sm:py-4 sm:text-sm"></th>
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
                class="relative w-full overflow-hidden rounded-2xl border border-border bg-card px-4 pt-5 pb-4 text-left text-card-foreground shadow-xl transition-all transform sm:my-8 sm:max-w-md sm:p-6">
                <div>
                  <div class="mt-3 sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-foreground">Rekap KontaQ
                    </DialogTitle>
                    <div
                      class="mt-2 font-mono text-xs leading-relaxed whitespace-pre-wrap text-muted-foreground sm:text-sm"
                      ref="shareContent">
                      <span class="font-semibold text-foreground">REKAP KONTAQ GRUP {{ authStore.user?.group?.name ?? '-' }}</span><br />
                      Pekan {{ week }}<br />
                      ➖➖➖➖➖➖➖➖<br />
                      Admin : {{ reports.items[0] ? reports.items[0].name : '-' }}<br />
                      Asmin : {{ reports.items[1] ? reports.items[1].name : '-' }}<br />
                      <br />
                      Kuis wajib dikerjakan<br />
                      <br />
                      1 2 3 4 5 6 <br />
                      <br />
                      <span v-for="row in recapRows" :key="row.id">
                        {{ row.number }}
                        <span v-for="(token, i) in row.quizzes" :key="`q${i}`" :class="token.class">{{ token.text }}</span>
                        <span v-for="(token, i) in row.evaluations" :key="`e${i}`" :class="token.class">{{ token.text }}</span>
                        {{ row.name }}
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
                  <Button type="button" variant="outline" class="w-full sm:col-start-1" @click="shareDialog = false">
                    Tutup
                  </Button>
                  <Button type="button" class="mt-3 w-full gap-2 sm:col-start-2 sm:mt-0" @click="copyShare">
                    <Check v-if="copied" class="w-4 h-4" />
                    <Copy v-else class="w-4 h-4" />
                    <span>{{ copied ? 'Tersalin!' : 'Salin' }}</span>
                  </Button>
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Check, CircleAlert, ClipboardList, Copy, RotateCcw, Users } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { getReports, updateReport } from '@/api';
import authStore from '@/store/auth';
import { Button } from '@/components/ui/button';
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
const isLoading = ref(false);
const loadError = ref(false);

async function loadData() {
  if (!week.value) return;
  isLoading.value = true;
  loadError.value = false;
  try {
    const data = await getReports(week.value);
    reports.value = data.data;
    calculateTotals();
  } catch (error) {
    reports.value = undefined;
    loadError.value = true;
    toast.error('Gagal memuat rapor.');
  } finally {
    isLoading.value = false;
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

const quizScoreToken = (score) => {
  if (score === null || score === undefined) return { text: 'X ', class: 'text-destructive' };
  if (score == 'i') return { text: 'I ', class: 'text-blue-600' };
  if (score == 'n') return { text: 'N ', class: 'text-warning-600' };
  if (score == 100) return { text: '100 ', class: 'text-success-600' };
  return { text: score + ' ', class: 'text-foreground' };
}

const evaluationScoreToken = (score) => {
  if (score === null || score === undefined) return { text: 'X', class: 'text-destructive' };
  return { text: 'OK', class: 'text-success-600' };
}

const recapRows = computed(() => {
  if (!reports.value) return [];
  return reports.value.items.map((item, idx) => ({
    id: item.id,
    number: `${idx + 1}`.padStart(2, '0'),
    name: item.name,
    quizzes: reports.value.quizzes.map(quiz =>
      quizScoreToken(item.scores ? item.scores[`quiz_${quiz.id}`] : undefined)),
    evaluations: reports.value.evaluations.map(evaluation =>
      evaluationScoreToken(item.scores ? item.scores[`evaluation_${evaluation.id}`] : undefined)),
  }));
});

const shareContent = ref();
const copied = ref(false);
let copiedTimer;
const copyShare = async () => {
  try {
    await navigator.clipboard.writeText(shareContent.value.innerText);
    copied.value = true;
    toast.success('Rekap disalin ke clipboard');
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 2000);
  } catch (error) {
    toast.error('Gagal menyalin rekap');
  }
}
</script>

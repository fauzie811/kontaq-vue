<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Navigation Bar: Beranda · Rapor [mode] [n] · Sertifikat -->
    <nav class="flex items-center justify-between gap-1.5 sm:gap-2 rounded-full bg-[#ebebeb] dark:bg-muted px-3.5 sm:px-10 py-2 sm:py-3">
      <router-link
        :to="{ name: 'home' }"
        class="font-bold text-primary text-sm sm:text-lg hover:text-primary/80 transition-colors shrink-0"
      >
        Beranda
      </router-link>

      <div class="flex items-center gap-1.5 sm:gap-4 min-w-0">
        <label class="relative flex items-center rounded-full bg-card min-w-0">
          <span class="sr-only">Jenis rapor</span>
          <select
            :value="mode"
            @change="changeMode($event.target.value)"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-bold text-primary text-sm sm:text-lg cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring truncate pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2"
          >
            <option v-for="(label, value) in MODES" :key="value" :value="value">Rapor {{ label }}</option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>

        <label class="relative flex items-center rounded-full bg-card shrink-0">
          <span class="sr-only">Pilih {{ MODES[mode] }}</span>
          <select
            :value="number"
            @change="changeNumber($event.target.value)"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-bold text-primary text-sm sm:text-lg cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2"
          >
            <option v-for="n in maxNumber" :key="n" :value="n">{{ n }}</option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>
      </div>

      <router-link
        :to="{ name: 'certificates' }"
        class="font-bold text-primary text-sm sm:text-lg hover:text-primary/80 transition-colors shrink-0"
      >
        Sertifikat
      </router-link>
    </nav>

    <!-- SKELETON LOADING -->
    <div v-if="isLoading" class="animate-pulse space-y-2" aria-hidden="true">
      <div class="h-10"></div>
      <div v-for="i in 5" :key="i" class="h-16 bg-muted/60"></div>
    </div>

    <!-- ERROR STATE -->
    <div
      v-else-if="loadError"
      class="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center sm:p-12"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-50 text-danger-600">
        <CircleAlert class="h-8 w-8" />
      </div>
      <h4 class="mb-1 text-base font-bold text-foreground">Gagal Memuat Rapor</h4>
      <p class="mb-5 max-w-md text-sm text-muted-foreground">
        Terjadi kesalahan saat memuat rapor. Silakan coba lagi.
      </p>
      <button
        type="button"
        class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 active:scale-[0.98]"
        @click="loadData"
      >
        <RotateCcw class="h-3.5 w-3.5" />
        <span>Coba Lagi</span>
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-else-if="!reports || reports.items.length === 0"
      class="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center sm:p-12"
    >
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Users class="h-8 w-8" />
      </div>
      <h4 class="mb-1 text-base font-bold text-foreground">Belum Ada Peserta</h4>
      <p class="max-w-md text-sm text-muted-foreground">
        Rapor {{ MODES[mode] }} {{ number }} belum memiliki data peserta.
      </p>
    </div>

    <!-- REPORT TABLE -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm sm:text-base">
        <caption class="sr-only">Rapor {{ MODES[mode] }} {{ number }}</caption>
        <thead>
          <tr class="text-foreground font-medium">
            <th scope="col" class="py-3 px-3 text-left whitespace-nowrap">No.</th>
            <th scope="col" class="py-3 px-3 text-left whitespace-nowrap">Nama Peserta</th>
            <th v-for="(quiz, index) in reports.quizzes" :key="quiz.id" scope="col" :title="quiz.title"
              class="py-3 px-3 text-center whitespace-nowrap">
              {{ reports.quizzes.length === 1 ? 'Kuis' : `Kuis ${index + 1}` }}
            </th>
            <th v-for="(evaluation, index) in reports.evaluations" :key="evaluation.id" scope="col" :title="evaluation.title"
              class="py-3 px-3 text-center whitespace-nowrap">
              {{ reports.evaluations.length === 1 ? 'Evaluasi' : `Evaluasi ${index + 1}` }}
            </th>
            <th scope="col" class="py-3 px-3 text-center whitespace-nowrap">Total Nilai</th>
            <th scope="col" class="py-3 px-3 text-center whitespace-nowrap">Peringkat</th>
            <th scope="col" class="py-3 px-3 text-center whitespace-nowrap">Juz</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border text-foreground border-y border-border">
          <tr v-for="(item, idx) in reports.items" :key="item.id">
            <td class="w-12 sm:w-16 bg-gradient-to-b from-[#b8f0d8] to-[#e4f2f8] dark:from-primary/25 dark:to-primary/5 py-4 px-3 text-center font-medium align-top">
              {{ idx + 1 }}
            </td>
            <td class="py-4 px-3 align-top whitespace-nowrap">
              <p class="font-medium">{{ item.name }}</p>
              <p class="text-muted-foreground">{{ item.username }}</p>
            </td>
            <td v-for="key in scoreKeys" :key="key" class="py-4 px-3 text-center align-top whitespace-nowrap">
              <span :class="scoreCell(item.scores?.[key]).class">{{ scoreCell(item.scores?.[key]).text }}</span>
            </td>
            <td class="py-4 px-3 text-center align-top font-semibold">{{ formatNumber(item.total) }}</td>
            <td class="py-4 px-3 text-center align-top font-bold text-primary">{{ item.rank ?? '–' }}</td>
            <td class="py-4 px-3 text-center align-top whitespace-nowrap">{{ juzLabel }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { ChevronDown, ChevronUp, CircleAlert, RotateCcw, Users } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { getReports } from '@/api';
import authStore from '@/store/auth';

const MODES = { daily: 'Harian', weekly: 'Pekanan', juz: 'Juz' };

const mode = ref('weekly');
const number = ref(authStore.user?.group?.current_week || 1);
const reports = ref();
const isLoading = ref(false);
const loadError = ref(false);

// The backend reports how many days/weeks/juz exist; keep the current pick selectable meanwhile.
const maxNumber = computed(() => Math.max(reports.value?.max || 0, number.value));

const scoreKeys = computed(() => [
  ...(reports.value?.quizzes || []).map((quiz) => `quiz_${quiz.id}`),
  ...(reports.value?.evaluations || []).map((evaluation) => `evaluation_${evaluation.id}`),
]);

const juzLabel = computed(() => {
  const juz = reports.value?.juz || [];
  if (juz.length === 0) return '–';
  return juz.length === 1 ? juz[0] : `${juz[0]}–${juz[juz.length - 1]}`;
});

async function loadData() {
  isLoading.value = true;
  loadError.value = false;
  try {
    const data = await getReports({ mode: mode.value, number: number.value });
    reports.value = data.data;
  } catch (error) {
    reports.value = undefined;
    loadError.value = true;
    toast.error('Gagal memuat rapor.');
  } finally {
    isLoading.value = false;
  }
}
loadData();

function changeMode(value) {
  mode.value = value;
  number.value = value === 'weekly' ? authStore.user?.group?.current_week || 1 : 1;
  loadData();
}

function changeNumber(value) {
  number.value = Number(value);
  loadData();
}

function scoreCell(score) {
  if (score === null || score === undefined) return { text: '–', class: 'text-muted-foreground' };
  if (score === 'i') return { text: 'Izin', class: 'text-blue-600 dark:text-blue-400 font-medium' };
  if (score === 'n') return { text: 'SK Baru', class: 'text-amber-700 dark:text-amber-400 font-medium' };
  return { text: score, class: score == 100 ? 'font-bold text-primary' : '' };
}

function formatNumber(value) {
  if (value === null || value === undefined) return '–';
  return Number.isInteger(value) ? value : Number(value).toFixed(2);
}
</script>

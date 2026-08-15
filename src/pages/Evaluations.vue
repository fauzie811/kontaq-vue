<template>
  <div>
    <!-- Page Header -->
    <PageHeader
      class="mb-6 sm:mb-8"
      page-title="Evaluasi Pembelajaran"
      description="Evaluasi berkala untuk mengukur capaian dan pemahaman materi Anda secara menyeluruh."
    />

    <div class="max-w-5xl space-y-6">
      <!-- Top Action Bar & Category Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card rounded-2xl border border-border p-4 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Award class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs text-muted-foreground block">Total Evaluasi</span>
            <span class="text-sm font-bold text-foreground">
              {{ evaluations.data?.length || 0 }} evaluasi {{ week ? `(Pekan ${week})` : 'tersedia' }}
            </span>
          </div>
        </div>

        <div class="w-full sm:w-auto">
          <WeekPicker
            show-all-option
            class="w-full sm:w-60"
            v-model="week"
            @update:modelValue="() => changePage(1)"
          />
        </div>
      </div>

      <!-- SKELETON LOADING GRID -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div v-for="i in 4" :key="i" class="bg-card rounded-2xl border border-border p-5 animate-pulse space-y-4">
          <div class="flex items-center justify-between">
            <div class="h-6 w-24 bg-muted rounded-full"></div>
            <div class="h-6 w-28 bg-muted rounded-full"></div>
          </div>
          <div class="h-5 w-3/4 bg-muted rounded"></div>
          <div class="h-4 w-1/2 bg-muted/60 rounded"></div>
          <div class="pt-3 border-t border-border/50">
            <div class="h-10 w-full bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>

      <!-- CARD GRID -->
      <div v-else-if="evaluations.data && evaluations.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div
          v-for="evaluation in evaluations.data"
          :key="evaluation.id"
          class="bg-card rounded-2xl border border-border shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all duration-200 p-5 flex flex-col justify-between group h-full text-card-foreground"
        >
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3.5">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                <Clock class="w-3.5 h-3.5 text-muted-foreground" />
                <span>{{ evaluation.duration }} menit</span>
              </div>

              <div :class="[statuses[getStatus(evaluation)].wrapper, 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset']">
                <component :is="statuses[getStatus(evaluation)].icon" class="w-3.5 h-3.5" />
                <span>{{ getStatus(evaluation) }}</span>
              </div>
            </div>

            <!-- Card Content: Title -->
            <h3 class="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-snug">
              {{ evaluation.title }}
            </h3>
          </div>

          <!-- Card Footer: Action Button -->
          <div class="pt-3 border-t border-border/40">
            <router-link
              :to="{ name: 'evaluations.show', params: { id: evaluation.id } }"
              :class="[
                'w-full font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center cursor-pointer active:scale-[0.98]',
                getStatus(evaluation) === 'Selesai'
                  ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
                  : getStatus(evaluation) === 'Sedang dikerjakan'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              ]"
            >
              <component :is="getButtonIcon(evaluation)" class="w-4 h-4" />
              <span>{{ getButtonLabel(evaluation) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="bg-card rounded-2xl border border-border p-10 sm:p-12 text-center text-card-foreground shadow-xs flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 shadow-inner">
          <Award class="w-8 h-8" />
        </div>
        <h4 class="text-base font-bold text-foreground mb-1">Belum Ada Evaluasi</h4>
        <p class="text-sm text-muted-foreground max-w-md mb-5">
          Evaluasi untuk <span v-if="week" class="font-semibold text-foreground">Pekan {{ week }}</span><span v-else>semua pekan</span> belum tersedia saat ini.
        </p>
        <button
          v-if="week"
          @click="resetWeek"
          class="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-all cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Tampilkan Semua Pekan</span>
        </button>
      </div>

      <!-- Pagination -->
      <Pagination v-if="!isLoading" :meta="evaluations" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Sparkles,
  Award,
  Eye,
  RotateCcw,
  Info,
  ArrowRight
} from 'lucide-vue-next';
import { listMyEvaluations } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import WeekPicker from '@/components/WeekPicker.vue';

const page = ref(1);
const week = ref(null);
const evaluations = ref({ data: [] });
const isLoading = ref(true);

async function loadData() {
  isLoading.value = true;
  try {
    const { data } = await listMyEvaluations({
      page: page.value,
      week: week.value,
    });
    evaluations.value = data;
  } catch (error) {
    console.error('Gagal memuat daftar evaluasi:', error);
  } finally {
    isLoading.value = false;
  }
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function resetWeek() {
  week.value = null;
  changePage(1);
}

function getStatus(evaluation) {
  if (evaluation.finished_at) return 'Selesai';
  if (evaluation.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}

function getButtonLabel(evaluation) {
  if (evaluation.finished_at) return 'Lihat hasil';
  if (evaluation.started_at) return 'Lanjutkan';
  return 'Mulai Evaluasi';
}

function getButtonIcon(evaluation) {
  if (evaluation.finished_at) return Eye;
  if (evaluation.started_at) return PlayCircle;
  return ArrowRight;
}

const statuses = {
  Selesai: {
    wrapper: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 ring-emerald-500/20',
    icon: CheckCircle2,
  },
  'Sedang dikerjakan': {
    wrapper: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 ring-amber-500/20',
    icon: PlayCircle,
  },
  'Belum dikerjakan': {
    wrapper: 'text-muted-foreground bg-secondary ring-border',
    icon: Sparkles,
  },
};
</script>
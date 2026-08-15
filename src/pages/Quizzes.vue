<template>
  <div>
    <!-- Page Header -->
    <PageHeader
      class="mb-6 sm:mb-8"
      page-title="Kuis Interaktif"
      description="Uji pemahaman Anda terhadap materi pembelajaran yang telah dipelajari."
    />

    <div class="max-w-5xl space-y-6">
      <!-- Top Action Bar & Category Filter -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card rounded-2xl border border-border p-4 shadow-xs">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-primary/10 text-primary">
            <FileQuestion class="w-5 h-5" />
          </div>
          <div>
            <span class="text-xs text-muted-foreground block">Total Kuis</span>
            <span class="text-sm font-bold text-foreground">
              {{ quizzes.data?.length || 0 }} kuis {{ week ? `(Pekan ${week})` : 'tersedia' }}
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
      <div v-else-if="quizzes.data && quizzes.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div
          v-for="quiz in quizzes.data"
          :key="quiz.id"
          class="bg-card rounded-2xl border border-border shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 p-5 flex flex-col justify-between group h-full text-card-foreground"
        >
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3.5">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                <Clock class="w-3.5 h-3.5 text-muted-foreground" />
                <span>{{ quiz.duration }} menit</span>
              </div>

              <!-- Locked Prerequisite or Status Badge -->
              <div v-if="!quiz.material_read" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-500/20">
                <Lock class="w-3.5 h-3.5" />
                <span>Materi Belum Dibaca</span>
              </div>
              <div v-else :class="[statuses[getStatus(quiz)].wrapper, 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset']">
                <component :is="statuses[getStatus(quiz)].icon" class="w-3.5 h-3.5" />
                <span>{{ getStatus(quiz) }}</span>
              </div>
            </div>

            <!-- Card Content: Title -->
            <h3 class="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4 leading-snug">
              {{ quiz.title }}
            </h3>
          </div>

          <!-- Card Footer: Action Button -->
          <div class="pt-3 border-t border-border/40">
            <!-- Locked Button (Needs Material Read) -->
            <button
              v-if="!quiz.material_read"
              type="button"
              @click.prevent="showAlert(quiz.material_id)"
              class="w-full bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer border border-border"
            >
              <BookOpen class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Baca Materi Terlebih Dahulu</span>
            </button>

            <!-- Unlocked Action Button -->
            <router-link
              v-else
              :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
              :class="[
                'w-full font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center cursor-pointer active:scale-[0.98]',
                getStatus(quiz) === 'Selesai'
                  ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border'
                  : getStatus(quiz) === 'Sedang dikerjakan'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              ]"
            >
              <component :is="getButtonIcon(quiz)" class="w-4 h-4" />
              <span>{{ getButtonLabel(quiz) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-else class="bg-card rounded-2xl border border-border p-10 sm:p-12 text-center text-card-foreground shadow-xs flex flex-col items-center">
        <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-inner">
          <HelpCircle class="w-8 h-8" />
        </div>
        <h4 class="text-base font-bold text-foreground mb-1">Belum Ada Kuis</h4>
        <p class="text-sm text-muted-foreground max-w-md mb-5">
          Kuis untuk <span v-if="week" class="font-semibold text-foreground">Pekan {{ week }}</span><span v-else>semua pekan</span> belum tersedia saat ini.
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
      <Pagination v-if="!isLoading" :meta="quizzes" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Clock,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Eye,
  Lock,
  RotateCcw,
  Info,
  ArrowRight,
  FileQuestion
} from 'lucide-vue-next';
import { listMyQuizzes } from '@/api';
import { swConfirm } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import WeekPicker from '@/components/WeekPicker.vue';

const router = useRouter();
const page = ref(1);
const week = ref(null);
const quizzes = ref({ data: [] });
const isLoading = ref(true);

async function loadData() {
  isLoading.value = true;
  try {
    const { data } = await listMyQuizzes({
      page: page.value,
      week: week.value,
    });
    quizzes.value = data;
  } catch (error) {
    console.error('Gagal memuat daftar kuis:', error);
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

function getStatus(quiz) {
  if (quiz.finished_at) return 'Selesai';
  if (quiz.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}

function getButtonLabel(quiz) {
  if (quiz.finished_at) return 'Lihat hasil';
  if (quiz.started_at) return 'Lanjutkan';
  return 'Mulai Kuis';
}

function getButtonIcon(quiz) {
  if (quiz.finished_at) return Eye;
  if (quiz.started_at) return PlayCircle;
  return ArrowRight;
}

async function showAlert(id) {
  const res = await swConfirm({
    icon: 'warning',
    title: 'Materi Belum Selesai',
    text: 'Anda harus menyelesaikan materi terkait untuk mengerjakan kuis ini.',
    confirmButtonText: 'Baca Materi',
    cancelButtonText: 'Tutup',
  });
  if (res.isConfirmed && id) router.push(`/materials/${id}`);
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
<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Running Text (Tata Tertib) -->
    <Teleport defer to="#header-marquee" :disabled="!isDesktop">
      <div class="overflow-hidden bg-primary/10 border-y border-primary/20 py-2 -mx-4 px-4 sm:m-0 sm:p-0 sm:bg-transparent sm:border-0">
        <div class="whitespace-nowrap animate-marquee flex items-center text-sm font-medium text-primary">
          <span class="mr-8">Tata Tertib Kuis: Harap mengerjakan kuis dengan jujur dan tidak melihat catatan atau Al-Qur'an kecuali untuk soal yang diperbolehkan.</span>
          <span class="mr-8">Pastikan koneksi internet stabil sebelum memulai.</span>
          <span class="mr-8">Sistem akan menyimpan jawaban otomatis dan mengumpulkan saat waktu habis.</span>
          <span>Semoga Allah memberikan kemudahan.</span>
        </div>
      </div>
    </Teleport>

    <!-- Navigation Bar: Beranda · Kuis [n] · Evaluasi -->
    <nav class="flex items-center justify-between gap-1.5 sm:gap-2 rounded-full bg-[#ebebeb] dark:bg-muted px-3.5 sm:px-10 py-2 sm:py-3">
      <router-link
        :to="{ name: 'home' }"
        class="font-medium text-primary text-sm sm:text-base hover:text-primary/80 transition-colors shrink-0"
      >
        Beranda
      </router-link>

      <div class="flex items-center gap-1.5 sm:gap-4 min-w-0">
        <span class="rounded-full bg-card font-medium text-primary text-sm sm:text-base px-3 sm:px-5 py-1.5 sm:py-2">Kuis</span>

        <label class="relative flex items-center rounded-full bg-card shrink-0">
          <span class="sr-only">Pilih kuis</span>
          <select
            :value="currentIndex + 1"
            @change="goToQuiz($event.target.value)"
            :disabled="quizList.length === 0"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-medium text-primary text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2"
          >
            <option v-for="(item, idx) in quizList" :key="item.id" :value="idx + 1">{{ idx + 1 }}</option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>
      </div>

      <router-link
        :to="{ name: 'evaluations' }"
        class="font-medium text-primary text-sm sm:text-base hover:text-primary/80 transition-colors shrink-0"
      >
        Evaluasi
      </router-link>
    </nav>

    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="space-y-4 animate-pulse">
      <div class="h-8 w-48 mx-auto bg-muted rounded"></div>
      <div v-for="i in 3" :key="i" class="h-40 bg-muted/60 rounded"></div>
    </div>

    <!-- ================================================================= -->
    <!-- 0. LOCKED QUIZ (closed schedule, unread material, or refused)    -->
    <!-- ================================================================= -->
    <div v-else-if="lockState || blockedMessage" class="space-y-4">
      <h2 class="text-lg sm:text-xl font-medium text-foreground text-center">{{ currentItem?.title || 'Kuis' }}</h2>

      <div class="bg-card rounded-2xl border border-border p-6 sm:p-8 text-center text-card-foreground flex flex-col items-center gap-3 max-w-xl mx-auto">
        <div class="w-14 h-14 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
          <component :is="lockIcon" class="w-7 h-7" />
        </div>

        <h3 class="text-base font-bold text-foreground">{{ lockTitle }}</h3>

        <p v-if="blockedMessage" class="text-sm text-muted-foreground">{{ blockedMessage }}</p>

        <p v-if="lockState === 'closed' && currentItem.opens_at" class="text-sm text-muted-foreground flex items-center gap-1.5">
          <CalendarClock class="w-4 h-4 shrink-0" />
          <span>{{ shortDateTime(currentItem.opens_at) }} &ndash; {{ shortDateTime(currentItem.closes_at) }}</span>
        </p>

        <!-- Late permission feedback -->
        <p v-if="currentItem?.late_permission_status === 'pending'" class="text-sm font-medium text-amber-700 dark:text-amber-400">
          Pengajuan izin telat Anda sedang ditinjau admin.
        </p>
        <p v-else-if="currentItem?.late_permission_status === 'rejected'" class="text-sm font-medium text-rose-700 dark:text-rose-400">
          Pengajuan izin telat ditolak{{ currentItem.late_permission_review_note ? `: ${currentItem.late_permission_review_note}` : '.' }}
        </p>

        <button
          v-if="lockState === 'closed' && currentItem.can_request_late_permission"
          type="button"
          @click="requestDialogOpen = true"
          class="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full py-2.5 px-6 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Send class="w-4 h-4" />
          <span>Ajukan Izin Telat</span>
        </button>

        <span
          v-else-if="lockState === 'closed' && currentItem.late_permission_status === 'pending'"
          class="mt-2 bg-muted text-muted-foreground font-semibold rounded-full py-2.5 px-6 text-sm flex items-center justify-center gap-2 border border-border"
        >
          <Hourglass class="w-4 h-4" />
          <span>Menunggu Persetujuan</span>
        </span>

        <router-link
          v-else-if="lockState === 'material'"
          :to="`/materials/${currentItem.material_id}`"
          class="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full py-2.5 px-6 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <BookOpen class="w-4 h-4" />
          <span>Baca Materi Terlebih Dahulu</span>
        </router-link>
      </div>
    </div>

    <!-- ================================================================= -->
    <!-- 1. ACTIVE QUIZ TAKING MODE -->
    <!-- ================================================================= -->
    <template v-else-if="quiz && userQuiz && !userQuiz.finished_at">
      <div class="text-center space-y-1.5">
        <h2 class="text-lg sm:text-xl font-medium text-foreground">{{ quiz.title }}</h2>
        <p ref="headerTimer" class="text-sm sm:text-base font-medium text-primary">
          Sisa Waktu :
          <span class="font-mono">
            <Countdown :start-time="parseISO(userQuiz.created_at)" :duration="quiz.duration" @finished="forceFinish" @tick="handleTick" />
          </span>
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-4">
        <!-- Questions List -->
        <div class="md:col-span-3">
          <QuestionCard
            v-for="(question, index) in quiz.questions"
            :key="question.id"
            :question="question"
            :index="index"
            v-model="selected[question.id]"
          />
        </div>

        <!-- Sidebar: timer sticks once the header timer scrolls away; Submit pinned below -->
        <div class="flex flex-col gap-6">
          <div
            v-show="!headerTimerVisible"
            class="hidden md:block sticky top-24 rounded-2xl bg-[#d9f5e7] dark:bg-secondary px-5 py-4 text-center text-primary"
          >
            <p class="text-sm font-semibold">Sisa Waktu</p>
            <p class="font-mono text-2xl font-bold">
              <Countdown :start-time="parseISO(userQuiz.created_at)" :duration="quiz.duration" @finished="forceFinish" @tick="handleTick" />
            </p>
          </div>

          <div class="mt-auto md:sticky md:bottom-24">
            <button
              @click="confirmSubmit"
              type="button"
              :disabled="isSubmitting"
              class="w-full rounded-full bg-[#d9f5e7] dark:bg-secondary hover:bg-primary/15 active:scale-[0.98] px-5 py-3 text-lg font-bold text-primary transition-all cursor-pointer disabled:opacity-50"
            >
              {{ isSubmitting ? 'Mengumpulkan...' : 'Selesai' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- ================================================================= -->
    <!-- 2. COMPLETED QUIZ REVIEW MODE -->
    <!-- ================================================================= -->
    <div v-else-if="quiz && userQuiz && userQuiz.finished_at" class="space-y-6">
      <h2 class="text-xl sm:text-2xl font-bold text-foreground text-center">{{ quiz.title }}</h2>

      <!-- Celebratory Score Hero Banner -->
      <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-card rounded-3xl border border-primary/20 p-6 sm:p-8 text-center relative overflow-hidden">
        <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
          <Award class="w-8 h-8 stroke-[2.2]" />
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-foreground mb-1.5">Jazaakumullaah khoyran katsiiran</h3>
        <p class="text-sm sm:text-base text-muted-foreground mb-4">Anda telah menyelesaikan kuis ini.</p>

        <!-- Score Pill -->
        <div class="inline-flex flex-col items-center justify-center bg-card rounded-2xl border border-border px-8 py-4">
          <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Nilai Anda</span>
          <span class="text-4xl sm:text-5xl font-extrabold text-primary font-mono">{{ userQuiz.score }}</span>
        </div>
      </div>

      <!-- Question Review Cards -->
      <div class="space-y-5">
        <h4 class="text-lg font-bold text-foreground">Pembahasan & Jawaban</h4>

        <div
          v-for="(question, index) in quiz.questions"
          :key="question.id"
          class="bg-card rounded-2xl border border-border overflow-hidden"
        >
          <!-- Question Header -->
          <div class="bg-muted/50 flex items-stretch min-h-[52px] border-b border-border">
            <div class="bg-primary/10 text-primary w-12 sm:w-14 flex items-center justify-center font-bold text-lg sm:text-xl shrink-0 border-r border-border/80">
              {{ index + 1 }}
            </div>
            <div class="px-4 py-3.5 sm:py-4 flex items-center text-foreground font-semibold text-base sm:text-lg flex-1 leading-snug">
              <div class="prose dark:prose-invert max-w-none text-foreground font-semibold text-base sm:text-lg" v-html="question.content"></div>
            </div>
          </div>

          <!-- True/False Review (Side-by-side) -->
          <div v-if="question.type === 'true_false'" class="p-4 sm:p-5">
            <div class="grid grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="opt in [{ key: 'true', label: 'Benar' }, { key: 'false', label: 'Salah' }]"
                :key="opt.key"
                :class="[
                  userQuiz.answers && userQuiz.answers[question.id] === opt.key
                    ? 'bg-primary/15 text-primary font-bold border-primary ring-1 ring-primary/30'
                    : 'text-foreground border-border bg-card',
                  'flex items-center justify-center px-4 py-3.5 sm:py-4 rounded-xl border-2 text-base sm:text-lg min-h-[52px]'
                ]"
              >
                <CheckIcon
                  class="shrink-0 w-5 h-5 mr-2"
                  :class="[question.answer === opt.key ? 'text-primary font-bold' : 'opacity-0']"
                />
                <span>{{ opt.label }}</span>
              </div>
            </div>
          </div>

          <!-- Multiple Choice Options Review List -->
          <div v-else class="py-1 divide-y divide-border/60">
            <div
              v-for="option in getMultipleOptions(question)"
              :key="option"
              :class="[
                userQuiz.answers && userQuiz.answers[question.id] === option
                  ? 'bg-primary/10 text-foreground font-semibold'
                  : 'text-foreground',
                'flex items-start sm:items-center px-4 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base'
              ]"
            >
              <div class="flex items-center mr-3 mt-0.5 sm:mt-0 shrink-0">
                <CheckIcon
                  class="w-5 h-5"
                  :class="[question.answer === option ? 'text-primary font-bold' : 'opacity-0']"
                />
              </div>
              <span class="mr-2 font-bold text-sm sm:text-base shrink-0">{{ option }}.</span>
              <span class="text-sm sm:text-base leading-relaxed text-foreground flex-1">
                {{ question.details?.[`option_${option}`] || question.details?.[`option_${option} `] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <LatePermissionDialog
      v-model:open="requestDialogOpen"
      type="quiz"
      :item-id="currentItem?.id"
      :item-label="currentItem?.title"
      :closed-at="currentItem?.closes_at"
      @submitted="loadData(true)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckIcon } from '@heroicons/vue/24/outline';
import {
  Award,
  BookOpen,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  ClockAlert,
  Hourglass,
  Lock,
  Send,
} from 'lucide-vue-next';
import parseISO from 'date-fns/parseISO';
import { useElementVisibility, useMediaQuery } from '@vueuse/core';

import { swAlert, swConfirm, shortDateTime } from '@/utils';
import { getMyQuiz, listAllMyQuizzes, updateMyQuiz } from '@/api';
import Countdown from '@/components/Countdown.vue';
import LatePermissionDialog from '@/components/LatePermissionDialog.vue';
import QuestionCard from '@/components/QuestionCard.vue';

const route = useRoute();
const isDesktop = useMediaQuery('(min-width: 640px)');
const router = useRouter();

// Dev server only: skip locks so locked quizzes can be opened.
// Pairs with the backend's local-environment bypass in LearningAccess.
const devUnlock = import.meta.env.MODE === 'development';

const isLoading = ref(true);
const isSubmitting = ref(false);
const headerTimer = ref(null);
const headerTimerVisible = useElementVisibility(headerTimer);
const selected = ref({});
const quiz = ref();
const userQuiz = ref();
const quizList = ref([]);
const blockedMessage = ref(null);
const requestDialogOpen = ref(false);

const currentIndex = computed(() => quizList.value.findIndex((q) => String(q.id) === String(route.params.id)));
const currentItem = computed(() => quizList.value[currentIndex.value]);

// Checked from the list row before opening, since opening a quiz starts its timer.
// Finished quizzes are always opened so their results stay viewable.
const lockState = computed(() => {
  const item = currentItem.value;
  if (devUnlock || !item || item.finished_at) return null;
  if (!item.is_open) return 'closed';
  if (item.material_id && !item.material_read) return 'material';
  return null;
});

const notYetOpen = computed(() => currentItem.value?.opens_at && new Date(currentItem.value.opens_at) > new Date());

const lockTitle = computed(() => {
  if (lockState.value === 'material') return 'Materi Belum Dibaca';
  if (lockState.value === 'closed') return notYetOpen.value ? 'Belum Dibuka' : 'Waktu Habis';
  return 'Kuis Tidak Dapat Dikerjakan';
});

const lockIcon = computed(() => {
  if (lockState.value === 'material') return BookOpen;
  if (lockState.value === 'closed' && !notYetOpen.value) return ClockAlert;
  return Lock;
});

const totalQuestions = computed(() => quiz.value?.questions?.length || 0);

const answeredCount = computed(() => {
  if (!quiz.value?.questions) return 0;
  return quiz.value.questions.filter((q) => selected.value[q.id] !== undefined && selected.value[q.id] !== '').length;
});

async function loadData(refreshList = false) {
  isLoading.value = true;
  blockedMessage.value = null;
  quiz.value = null;
  userQuiz.value = null;
  selected.value = {};
  try {
    if (refreshList || quizList.value.length === 0) {
      quizList.value = await listAllMyQuizzes();
    }
    if (lockState.value) return;

    const data = await getMyQuiz(route.params.id);

    // The backend may still refuse (schedule or unread material)
    if (!data.success) {
      blockedMessage.value = data.message || 'Kuis ini tidak dapat dikerjakan saat ini.';
      return;
    }

    quiz.value = data.data.quiz;
    userQuiz.value = data.data.user_quiz;
  } catch (error) {
    blockedMessage.value = 'Terjadi kesalahan saat memuat kuis.';
  } finally {
    isLoading.value = false;
  }
}
loadData();
watch(() => route.params.id, (id) => id && loadData());

async function goToQuiz(position) {
  const target = quizList.value[Number(position) - 1];
  if (!target) return;

  if (userQuiz.value && !userQuiz.value.finished_at) {
    const res = await swConfirm({
      title: 'Tinggalkan Kuis?',
      text: 'Waktu kuis akan terus berjalan jika Anda pindah. Yakin ingin membuka kuis lain?',
      confirmButtonText: 'Ya, Pindah',
      cancelButtonText: 'Lanjutkan Kuis',
      icon: 'warning',
    });
    if (!res.isConfirmed) return;
  }
  router.push({ name: 'quizzes.show', params: { id: target.id } });
}

async function confirmSubmit() {
  if (isSubmitting.value) return;

  const unanswered = totalQuestions.value - answeredCount.value;
  const isAllAnswered = unanswered === 0;

  const res = await swConfirm({
    title: 'Kumpulkan Jawaban?',
    text: isAllAnswered
      ? 'Semua soal telah Anda jawab. Apakah Anda yakin ingin menyelesaikan kuis sekarang?'
      : `Masih ada ${unanswered} soal yang belum dijawab. Apakah Anda yakin ingin mengakhiri dan mengumpulkan kuis sekarang?`,
    confirmButtonText: 'Ya, Kumpulkan',
    cancelButtonText: 'Periksa Kembali',
    icon: isAllAnswered ? 'success' : 'warning',
  });

  if (res.isConfirmed) {
    submitAnswers();
  }
}

async function submitAnswers() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const data = await updateMyQuiz(route.params.id, selected.value);

    if (!data.success) {
      blockedMessage.value = data.message || 'Kuis ini tidak dapat dikumpulkan.';
      return;
    }

    // Reload into review mode (score + Jazaakumullaah banner)
    await loadData(true);
  } catch (error) {
    await swAlert({
      icon: 'warning',
      title: 'Gagal Mengirim',
      text: 'Terjadi kesalahan saat mengumpulkan kuis. Silakan coba lagi.',
      buttonText: 'OK',
    });
  } finally {
    isSubmitting.value = false;
  }
}

function getMultipleOptions(question) {
  const base = ['a', 'b', 'c', 'd'];
  const optionE = question?.details?.option_e || question?.details?.['option_e '];
  if (optionE && String(optionE).trim() !== '') {
    base.push('e');
  }
  return base;
}

const forceFinish = () => {
  submitAnswers();
};

let warningSoundPlayed = false;
function playWarningSound() {
  if (warningSoundPlayed) return;
  warningSoundPlayed = true;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    for(let i=0; i<3; i++) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime + (i * 0.5));
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime + (i * 0.5));

      osc.start(ctx.currentTime + (i * 0.5));
      osc.stop(ctx.currentTime + (i * 0.5) + 0.2);
    }
  } catch (e) {
    console.error('AudioContext error', e);
  }
}

function handleTick({ remainingSeconds }) {
  // Play sound when 1 minute (60 seconds) or less is remaining
  if (remainingSeconds > 0 && remainingSeconds <= 60 && !warningSoundPlayed) {
    playWarningSound();
  }
}
</script>

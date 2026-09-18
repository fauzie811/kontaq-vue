<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Skeleton Loading State -->
    <div v-if="isLoading" class="space-y-6 animate-pulse">
      <div class="h-10 w-64 bg-muted rounded-xl"></div>
      <div class="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div class="md:col-span-2 lg:col-span-3 space-y-4">
          <div v-for="i in 3" :key="i" class="h-44 bg-card rounded-2xl border border-border p-6"></div>
        </div>
        <div class="h-60 bg-card rounded-2xl border border-border p-6 hidden md:block"></div>
      </div>
    </div>

    <!-- Main Quiz Content -->
    <div v-else-if="quiz" class="space-y-6">
      <!-- Page Header with Back & Metadata -->
      <PageHeader
        :page-title="quiz.title"
        :description="userQuiz?.finished_at ? 'Tinjauan hasil pengerjaan kuis Anda.' : `Durasi: ${quiz.duration} menit • ${quiz.questions?.length || 0} Soal`"
        :show-back="true"
        @back="handleBackNavigation"
      />

      <!-- Running Text (Tata Tertib) -->
      <div v-if="quiz && userQuiz && !userQuiz.finished_at" class="overflow-hidden bg-primary/10 border-y border-primary/20 py-2 sm:py-2.5 -mx-4 px-4 sm:mx-0 sm:rounded-xl">
        <div class="whitespace-nowrap animate-marquee flex items-center text-sm font-medium text-primary">
          <span class="mr-8">Tata Tertib Kuis: Harap mengerjakan kuis dengan jujur dan tidak melihat catatan atau Al-Qur'an kecuali untuk soal yang diperbolehkan.</span>
          <span class="mr-8">Pastikan koneksi internet stabil sebelum memulai.</span>
          <span class="mr-8">Sistem akan menyimpan jawaban otomatis dan mengumpulkan saat waktu habis.</span>
          <span>Semoga Allah memberikan kemudahan.</span>
        </div>
      </div>

      <!-- ================================================================= -->
      <!-- 1. ACTIVE QUIZ TAKING MODE -->
      <!-- ================================================================= -->
      <template v-if="quiz && userQuiz && !userQuiz.finished_at">
        <!-- MOBILE STICKY FLOATING TIMER & PROGRESS BAR (< md) -->
        <div class="md:hidden sticky top-16 z-30 -mx-4 px-4 py-2 bg-card/95 backdrop-blur-md border-y border-border transition-all">
          <div class="flex items-center justify-between gap-3 mb-2">
            <!-- Countdown Timer Pill -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground border border-border font-medium text-xs sm:text-sm">
              <Clock class="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <span class="text-muted-foreground font-medium">Sisa Waktu:</span>
              <span class="font-mono font-bold text-foreground">
                <Countdown :start-time="parseISO(userQuiz.created_at)" :duration="quiz.duration" @finished="forceFinish" @tick="handleTick" />
              </span>
            </div>

            <!-- Answered Count Badge -->
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <span>{{ answeredCount }}/{{ totalQuestions }} Terjawab</span>
            </div>
          </div>

          <!-- Mobile Quick Question Navigation Pills -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              v-for="(q, idx) in quiz.questions"
              :key="q.id"
              type="button"
              @click="scrollToQuestion(idx)"
              :class="[
                selected[q.id]
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'bg-muted text-muted-foreground hover:bg-secondary border border-border/80 font-medium',
                'w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 transition-all active:scale-90 cursor-pointer'
              ]"
              :title="'Lompat ke Soal ' + (idx + 1)"
            >
              {{ idx + 1 }}
            </button>
          </div>
        </div>

        <!-- Layout Grid: Questions on Left, Sticky Sidebar on Right (Desktop) -->
        <div class="grid gap-6 md:grid-cols-3 lg:grid-cols-4 items-start">
          <!-- Questions List -->
          <div class="md:col-span-2 lg:col-span-3 space-y-4">
            <QuestionCard
              v-for="(question, index) in quiz.questions"
              :key="question.id"
              :question="question"
              :index="index"
              v-model="selected[question.id]"
            />

            <!-- Mobile Bottom Submit Button -->
            <div class="pt-2 md:hidden">
              <button
                @click="confirmSubmit"
                type="button"
                :disabled="isSubmitting"
                class="w-full rounded-full bg-primary hover:bg-primary/90 active:scale-[0.98] px-5 py-4 text-base font-bold text-primary-foreground transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 class="w-5 h-5" />
                <span>{{ isSubmitting ? 'Mengumpulkan...' : 'Selesai & Kumpulkan Jawaban' }}</span>
              </button>
            </div>
          </div>

          <!-- DESKTOP STICKY SIDEBAR (Timer, Progress & Question Navigator) -->
          <div class="hidden md:block md:sticky md:top-20 space-y-4">
            <!-- Timer Card -->
            <div class="bg-card rounded-2xl border border-border p-5 text-center space-y-3">
              <div class="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock class="w-4 h-4 text-primary" />
                <h3 class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sisa Waktu</h3>
              </div>
              <div class="text-3xl font-extrabold text-foreground font-mono tracking-tight">
                <Countdown :start-time="parseISO(userQuiz.created_at)" :duration="quiz.duration" @finished="forceFinish" @tick="handleTick" />
              </div>
              <p class="text-xs text-muted-foreground">Kuis otomatis tersimpan jika waktu habis.</p>
            </div>

            <!-- Progress & Question Matrix Card -->
            <div class="bg-card rounded-2xl border border-border p-5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Progress</span>
                <span class="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {{ answeredCount }} dari {{ totalQuestions }}
                </span>
              </div>

              <!-- Visual Progress Bar -->
              <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>

              <!-- Question Navigator Matrix -->
              <div class="pt-2 border-t border-border/60">
                <span class="text-xs text-muted-foreground block mb-2.5 font-medium">Daftar Soal:</span>
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="(q, idx) in quiz.questions"
                    :key="q.id"
                    type="button"
                    @click="scrollToQuestion(idx)"
                    :class="[
                      selected[q.id]
                        ? 'bg-primary text-primary-foreground font-bold'
                        : 'bg-muted text-muted-foreground hover:bg-secondary border border-border/80 font-medium',
                      'h-9 rounded-full flex items-center justify-center text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer'
                    ]"
                    :title="'Lompat ke Soal ' + (idx + 1)"
                  >
                    {{ idx + 1 }}
                  </button>
                </div>
              </div>

              <!-- Desktop Submit Button -->
              <button
                @click="confirmSubmit"
                type="button"
                :disabled="isSubmitting"
                class="w-full rounded-full bg-primary hover:bg-primary/90 active:scale-[0.98] px-4 py-3 text-sm font-bold text-primary-foreground transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Mengumpulkan...' : 'Selesai & Kumpulkan' }}</span>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- ================================================================= -->
      <!-- 2. COMPLETED QUIZ REVIEW MODE -->
      <!-- ================================================================= -->
      <div v-if="userQuiz && userQuiz.finished_at" class="space-y-6">
        <!-- Celebratory Score Hero Banner -->
        <div class="bg-gradient-to-br from-primary/10 via-primary/5 to-card rounded-3xl border border-primary/20 p-6 sm:p-8 text-center relative overflow-hidden">
          <div class="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <Award class="w-8 h-8 stroke-[2.2]" />
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-foreground mb-1.5">Jazaakumullah khayran katsiran</h3>
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

        <!-- Back to Quizzes Navigation Button -->
        <div class="pt-4 flex items-center justify-between">
          <router-link
            to="/quizzes"
            class="inline-flex items-center gap-2 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground border border-border px-6 py-3 text-sm font-bold transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Kembali ke Daftar Kuis</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CheckIcon } from '@heroicons/vue/24/outline';
import { Clock, CheckCircle2, Award, ArrowLeft } from 'lucide-vue-next';
import parseISO from 'date-fns/parseISO';

import { swAlert, swConfirm } from '@/utils';
import { getMyQuiz, updateMyQuiz } from '@/api';
import PageHeader from '@/components/PageHeader.vue';
import Countdown from '@/components/Countdown.vue';
import QuestionCard from '@/components/QuestionCard.vue';

const route = useRoute();
const router = useRouter();

const isLoading = ref(true);
const isSubmitting = ref(false);
const selected = ref({});
const quiz = ref();
const userQuiz = ref();

const totalQuestions = computed(() => quiz.value?.questions?.length || 0);

const answeredCount = computed(() => {
  if (!quiz.value?.questions) return 0;
  return quiz.value.questions.filter((q) => selected.value[q.id] !== undefined && selected.value[q.id] !== '').length;
});

const progressPercentage = computed(() => {
  if (totalQuestions.value === 0) return 0;
  return Math.round((answeredCount.value / totalQuestions.value) * 100);
});

async function loadData() {
  isLoading.value = true;
  try {
    const data = await getMyQuiz(route.params.id);

    // The quiz may be locked by its schedule or by an unread material
    if (!data.success) {
      return showBlocked(data.message);
    }

    quiz.value = data.data.quiz;
    userQuiz.value = data.data.user_quiz;
  } catch (error) {
    showBlocked('Terjadi kesalahan saat memuat kuis.');
  } finally {
    isLoading.value = false;
  }
}
loadData();

async function showBlocked(message) {
  await swAlert({
    icon: 'warning',
    title: 'Mohon Maaf',
    text: message || 'Kuis ini tidak dapat dikerjakan saat ini.',
    buttonText: 'Kembali',
  });
  router.push('/quizzes');
}

function scrollToQuestion(index) {
  const el = document.getElementById(`question-${index + 1}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function handleBackNavigation() {
  if (userQuiz.value && !userQuiz.value.finished_at) {
    const res = await swConfirm({
      title: 'Tinggalkan Kuis?',
      text: 'Waktu kuis akan terus berjalan jika Anda keluar. Yakin ingin kembali ke daftar kuis?',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Lanjutkan Kuis',
      icon: 'warning',
    });
    if (!res.isConfirmed) return;
  }
  router.push('/quizzes');
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
      return showBlocked(data.message);
    }

    router.push('/quizzes');
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
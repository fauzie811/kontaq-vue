<template>
  <div>
    <PageHeader class="mb-8" page-title="Kuis" />

    <div class="max-w-5xl">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground">
            Menampilkan <strong class="text-foreground">{{ quizzes.data?.length || 0 }}</strong> kuis
          </span>
        </div>
        <CategoryPicker show-all-option class="w-full sm:w-56" v-model="category"
          @update:modelValue="() => changePage(1)" />
      </div>

      <!-- Card Grid -->
      <div v-if="quizzes.data && quizzes.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div v-for="quiz in quizzes.data" :key="quiz.id"
          class="bg-card rounded-2xl border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 p-5 flex flex-col justify-between group h-full text-card-foreground">
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                <Clock class="w-3.5 h-3.5 text-muted-foreground" />
                <span>{{ quiz.duration }} menit</span>
              </div>

              <div :class="[statuses[getStatus(quiz)].wrapper, 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset']">
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
          <div class="pt-2">
            <button v-if="!quiz.material_read" @click.prevent="showAlert(quiz.material_id)"
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer">
              <BookOpen class="w-4 h-4" />
              <span>{{ getButtonLabel(quiz) }}</span>
            </button>
            <router-link v-else :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center">
              <span>{{ getButtonLabel(quiz) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-card rounded-2xl border border-border p-12 text-center my-6 text-card-foreground">
        <div class="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <HelpCircle class="w-6 h-6" />
        </div>
        <h4 class="text-base font-semibold text-foreground mb-1">Belum Ada Kuis</h4>
        <p class="text-sm text-muted-foreground">Kuis untuk kategori ini belum tersedia.</p>
      </div>

      <!-- Pagination -->
      <Pagination :meta="quizzes" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Clock, CheckCircle2, PlayCircle, HelpCircle, Sparkles, BookOpen } from 'lucide-vue-next';
import { listMyQuizzes } from '@/api';
import { swConfirm } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';

const router = useRouter();
const page = ref(1);
const category = ref();
const quizzes = ref({ data: [] });

async function loadData() {
  const { data } = await listMyQuizzes({ page: page.value, category: category.value ? category.value.id : null });
  quizzes.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(quiz) {
  if (quiz.finished_at) return 'Selesai';
  if (quiz.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}
function getButtonLabel(quiz) {
  if (quiz.finished_at) return 'Lihat hasil';
  if (quiz.started_at) return 'Lanjukan';
  return 'Mulai';
}

async function showAlert(id) {
  const res = await swConfirm({
    icon: 'warning',
    title: 'Mohon Maaf',
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
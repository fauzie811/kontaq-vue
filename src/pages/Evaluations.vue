<template>
  <div>
    <PageHeader class="mb-8" page-title="Evaluasi" />

    <div class="max-w-5xl">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground">
            Menampilkan <strong class="text-foreground">{{ evaluations.data?.length || 0 }}</strong> evaluasi
          </span>
        </div>
        <CategoryPicker show-all-option root-only class="w-full sm:w-56" v-model="category"
          @update:modelValue="() => changePage(1)" />
      </div>

      <!-- Card Grid -->
      <div v-if="evaluations.data && evaluations.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div v-for="evaluation in evaluations.data" :key="evaluation.id"
          class="bg-card rounded-2xl border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all duration-200 p-5 flex flex-col justify-between group h-full text-card-foreground">
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3">
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
          <div class="pt-2">
            <router-link :to="{ name: 'evaluations.show', params: { id: evaluation.id } }"
              class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center block">
              <span>{{ getButtonLabel(evaluation) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-card rounded-2xl border border-border p-12 text-center my-6 text-card-foreground">
        <div class="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <HelpCircle class="w-6 h-6" />
        </div>
        <h4 class="text-base font-semibold text-foreground mb-1">Belum Ada Evaluasi</h4>
        <p class="text-sm text-muted-foreground">Evaluasi untuk kategori ini belum tersedia.</p>
      </div>

      <!-- Pagination -->
      <Pagination :meta="evaluations" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Clock, CheckCircle2, PlayCircle, HelpCircle, Sparkles } from 'lucide-vue-next';
import { listMyEvaluations } from '@/api';
import PageHeader from '../components/PageHeader.vue';
import Pagination from '@/components/Pagination.vue';
import CategoryPicker from '@/components/CategoryPicker.vue';

const page = ref(1);
const category = ref();
const evaluations = ref({ data: [] });

async function loadData() {
  const { data } = await listMyEvaluations({ page: page.value, category: category.value ? category.value.id : null });
  evaluations.value = data;
}
loadData();

function changePage(p) {
  page.value = p;
  loadData();
}

function getStatus(evaluation) {
  if (evaluation.finished_at) return 'Selesai';
  if (evaluation.started_at) return 'Sedang dikerjakan';
  return 'Belum dikerjakan';
}
function getButtonLabel(evaluation) {
  if (evaluation.finished_at) return 'Lihat hasil';
  if (evaluation.started_at) return 'Lanjukan';
  return 'Mulai';
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
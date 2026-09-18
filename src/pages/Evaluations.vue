<template>
  <div class="max-w-6xl mx-auto">
    <div v-if="isLoading" class="space-y-4 animate-pulse">
      <div class="h-14 bg-muted rounded-full"></div>
      <div class="h-8 w-48 mx-auto bg-muted rounded"></div>
      <div v-for="i in 3" :key="i" class="h-40 bg-muted/60 rounded"></div>
    </div>

    <div v-else class="bg-card rounded-2xl border border-border p-10 sm:p-12 text-center text-card-foreground flex flex-col items-center">
      <div class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
        <EvaluationIcon class="w-8 h-8" />
      </div>
      <h4 class="text-base font-bold text-foreground mb-1">Belum Ada Evaluasi</h4>
      <p class="text-sm text-muted-foreground max-w-md">Evaluasi belum tersedia saat ini.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FEATURES } from '@/constants/features';
import { listAllMyEvaluations } from '@/api';

const EvaluationIcon = FEATURES.evaluations.icon;

const router = useRouter();
const isLoading = ref(true);

// Dev server only: treat locked evaluations as open, like the evaluation page does.
const devUnlock = import.meta.env.MODE === 'development';

// No index page: jump straight to the first open, unfinished evaluation, else the latest one.
async function openDefaultEvaluation() {
  try {
    const evaluations = await listAllMyEvaluations();
    const target =
      evaluations.find((q) => (devUnlock || q.is_open) && !q.finished_at) ?? evaluations.at(-1);
    if (target) return router.replace({ name: 'evaluations.show', params: { id: target.id } });
  } catch (error) {
    console.error('Gagal memuat daftar evaluasi:', error);
  }
  isLoading.value = false;
}
openDefaultEvaluation();
</script>

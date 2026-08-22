<template>
  <div class="max-w-3xl pb-16">
    <!-- Header with Back Navigation -->
    <PageHeader
      class="mb-6"
      :page-title="material ? material.title : ''"
      back-url="/materials"
      show-back
    />

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <!-- Metadata Skeleton -->
      <div class="flex items-center gap-2.5">
        <div class="h-6 w-24 rounded-full bg-muted animate-pulse"></div>
        <div class="h-6 w-28 rounded-full bg-muted animate-pulse"></div>
        <div class="h-6 w-20 rounded-full bg-muted animate-pulse"></div>
      </div>

      <!-- Verses Skeleton Card -->
      <div class="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-border/60">
          <div class="h-4 w-28 bg-muted rounded animate-pulse"></div>
          <div class="h-4 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="h-8 w-3/4 ml-auto bg-muted rounded animate-pulse"></div>
        <div class="h-4 w-full bg-muted rounded animate-pulse"></div>
        <div class="h-4 w-5/6 bg-muted rounded animate-pulse"></div>
      </div>

      <!-- Content Skeleton Card -->
      <div class="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div class="h-4 w-full bg-muted rounded animate-pulse"></div>
        <div class="h-4 w-11/12 bg-muted rounded animate-pulse"></div>
        <div class="h-4 w-4/5 bg-muted rounded animate-pulse"></div>
        <div class="h-4 w-full bg-muted rounded animate-pulse mt-4"></div>
        <div class="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 text-center text-destructive my-6 shadow-xs space-y-3"
    >
      <AlertCircle class="w-8 h-8 mx-auto text-destructive" />
      <p class="font-bold text-base sm:text-lg">Gagal Memuat Materi</p>
      <p class="text-sm text-muted-foreground max-w-md mx-auto">{{ error }}</p>
      <div class="pt-2 flex items-center justify-center gap-3">
        <button
          type="button"
          @click="loadData(route.params.id)"
          class="inline-flex items-center gap-2 px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold rounded-xl text-sm transition-all cursor-pointer shadow-xs active:scale-[0.98]"
        >
          <RotateCw class="w-4 h-4" />
          <span>Coba Lagi</span>
        </button>
        <router-link
          to="/materials"
          class="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl text-sm border border-border transition-all cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Kembali</span>
        </router-link>
      </div>
    </div>

    <!-- Content Loaded -->
    <div v-else-if="material" class="space-y-6">
      <!-- Material Metadata & Status Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Week Badge -->
          <span
            v-if="material.week"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border"
          >
            <Calendar class="w-3.5 h-3.5 text-primary" />
            <span>Pekan {{ material.week }}</span>
          </span>

          <!-- Part Badge (if available) -->
          <span
            v-if="material.part_number"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border"
          >
            <BookOpen class="w-3.5 h-3.5 text-primary" />
            <span>Bagian {{ material.part_number }}</span>
          </span>

          <!-- Reading Time Estimate -->
          <span
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/60 border border-border/60"
          >
            <Clock class="w-3.5 h-3.5" />
            <span>~{{ estimatedReadMinutes }} menit baca</span>
          </span>
        </div>

        <!-- Read Status Pill -->
        <div>
          <span
            v-if="material.read_at"
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
          >
            <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Sudah Dibaca</span>
          </span>
          <span
            v-else
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-muted-foreground border border-border"
          >
            <span>Belum Dibaca</span>
          </span>
        </div>
      </div>

      <!-- Related Quran Verses Card (Single Compact Card) -->
      <MaterialRelatedVerses
        v-if="materialVerses.length > 0"
        :verses="materialVerses"
      />

      <!-- Material Content Card -->
      <article
        :class="[
          'overflow-hidden bg-card text-card-foreground border border-border rounded-2xl shadow-xs transition-all',
          fontClass,
        ]"
      >
        <div class="px-5 py-6 sm:p-8 lg:p-10">
          <div
            class="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed sm:leading-loose [&_p]:mb-4 [&_p:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-5 [&_h3]:mb-2 [&_blockquote]:border-l [&_blockquote]:border-primary/60 [&_blockquote]:bg-secondary/30 [&_blockquote]:rounded-r-xl [&_blockquote]:py-2.5 [&_blockquote]:px-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:text-primary/80 [&_strong]:text-foreground [&_strong]:font-semibold"
            v-html="material.content"
          ></div>
        </div>
      </article>

      <!-- Completion Banner (when already read) -->
      <div
        v-if="material.read_at"
        class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 class="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <p class="font-bold text-sm text-emerald-950 dark:text-emerald-100">
              Materi Ini Sudah Selesai Dibaca
            </p>
            <p class="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
              Selesai pada {{ formatFinishedDate(material.read_at) }}
            </p>
          </div>
        </div>

        <router-link
          to="/materials"
          class="inline-flex items-center gap-2 px-4 py-2 bg-card hover:bg-muted text-foreground font-semibold text-xs sm:text-sm rounded-xl border border-emerald-500/30 shadow-2xs transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft class="w-4 h-4 text-primary" />
          <span>Kembali ke Materi</span>
        </router-link>
      </div>

      <!-- Action Footer (Bottom Controls when not yet read) -->
      <div
        v-if="!material.read_at"
        class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-border/60"
      >
        <router-link
          to="/materials"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-sm rounded-xl border border-border shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft class="w-4 h-4 text-primary" />
          <span>Kembali ke Daftar</span>
        </router-link>

        <button
          @click="finishRead"
          type="button"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div
            v-if="isSubmitting"
            class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"
          ></div>
          <CheckCircle2 v-else class="w-4 h-4" />
          <span>{{ isSubmitting ? 'Menyimpan...' : 'Selesai Membaca' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  ArrowLeft,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import useLocalStorage from '@/plugins/localStorage';
import { getMyMaterial, updateMyMaterial } from '@/api';
import { shortDateTime, stripTags } from '@/utils';
import PageHeader from '@/components/PageHeader.vue';
import MaterialRelatedVerses from '@/components/MaterialRelatedVerses.vue';

const route = useRoute();
const router = useRouter();
const font = useLocalStorage('font-family', 'sans');

const material = ref(null);
const loading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);

const fontClass = computed(() => {
  if (font.value === 'arial') return 'font-arial';
  if (font.value === 'times') return 'font-times';
  return 'font-sans';
});

const materialVerses = computed(() => {
  if (!material.value) return [];
  return material.value.quran_verses || material.value.quranVerses || [];
});

const estimatedReadMinutes = computed(() => {
  if (!material.value?.content) return 1;
  const text = stripTags(material.value.content);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
});

function formatFinishedDate(dateStr) {
  if (!dateStr) return '';
  try {
    return shortDateTime(dateStr);
  } catch {
    return dateStr;
  }
}

async function loadData(id) {
  if (!id) return;
  loading.value = true;
  error.value = null;
  try {
    const data = await getMyMaterial(id);
    material.value = data.data;
  } catch (e) {
    console.error('Failed to load material:', e);
    error.value =
      typeof e === 'string'
        ? e
        : e?.message || 'Gagal memuat data materi tadabbur.';
  } finally {
    loading.value = false;
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadData(newId);
    }
  },
  { immediate: true }
);

async function finishRead() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  try {
    await updateMyMaterial(route.params.id);
    toast.success('Materi berhasil diselesaikan!');
    router.push('/materials');
  } catch (e) {
    console.error('Failed to finish material:', e);
    const msg =
      typeof e === 'string'
        ? e
        : e?.message || 'Gagal menyimpan status baca materi.';
    toast.error(msg);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
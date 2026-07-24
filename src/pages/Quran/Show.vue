<template>
  <div class="max-w-4xl mx-auto pb-16">
    <!-- Navigation / Header Bar -->
    <div class="mb-6 flex items-center justify-between">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-800 font-semibold text-sm rounded-2xl border border-gray-200 shadow-2xs transition-all cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4 text-emerald-600" />
        <span>Kembali ke Daftar Surah</span>
      </button>

      <div v-if="chapterDetails" class="text-xs text-gray-500 font-medium">
        Surah ke-{{ chapterDetails.number }} dari 114
      </div>
    </div>

    <!-- Initial Loading State -->
    <div v-if="initialLoading" class="text-center py-20 bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-emerald-600 border-t-transparent"></div>
      <p class="text-gray-500 text-sm mt-3 font-medium">Memuat ayat-ayat surah...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-3xl p-8 text-center text-red-700 my-6 shadow-xs">
      <p class="font-bold text-lg mb-2">Terjadi Kesalahan</p>
      <p class="text-sm mb-4">{{ error }}</p>
      <button
        @click="resetAndFetch"
        class="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-xs"
      >
        Coba Lagi
      </button>
    </div>

    <div v-else-if="chapterDetails">
      <!-- Surah Header Banner -->
      <div class="bg-linear-to-br from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg mb-8 relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 opacity-10 font-arabic text-9xl select-none pointer-events-none">
          {{ chapterDetails.arabic }}
        </div>

        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <div class="inline-flex items-center gap-2 bg-emerald-700/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-emerald-100 mb-3 border border-emerald-500/30">
              <span>Surah #{{ chapterDetails.number }}</span>
              <span>•</span>
              <span>{{ chapterDetails.revelation_type || 'Makkiyah' }}</span>
              <span>•</span>
              <span>{{ chapterDetails.ayat }} Ayat</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
              {{ chapterDetails.latin }}
            </h1>
            <p class="text-emerald-200 text-base sm:text-lg font-medium">
              "{{ chapterDetails.meaning }}"
            </p>
          </div>

          <div class="font-arabic text-4xl sm:text-5xl font-bold text-emerald-100 drop-shadow-md dir-rtl">
            {{ chapterDetails.arabic }}
          </div>
        </div>
      </div>

      <!-- Bismillah Banner (Show if not Surah At-Tawbah #9) -->
      <div
        v-if="chapterDetails.number !== 9 && chapterDetails.number !== 1"
        class="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-6 text-center mb-8 shadow-2xs"
      >
        <p class="font-quran text-3xl text-emerald-900 font-bold dir-rtl leading-relaxed">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p class="text-xs text-emerald-700 font-medium mt-2">
          Dengan menyebut nama Allah Yang Maha Pengasih, lagi Maha Penyayang
        </p>
      </div>

      <!-- Verses List -->
      <div class="space-y-6">
        <div
          v-for="verse in verses"
          :key="verse.id"
          class="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200/80 shadow-xs hover:border-emerald-200 transition-all space-y-4"
        >
          <!-- Verse Header -->
          <div class="flex items-center justify-between border-b border-gray-100 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-inner">
                {{ verse.verse }}
              </span>
              <span class="text-xs text-gray-400 font-medium">
                QS {{ chapterDetails.latin }}: {{ verse.verse }}
              </span>
            </div>

            <!-- Actions (Copy verse text) -->
            <button
              @click="copyVerse(verse)"
              title="Salin Ayat"
              class="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
            >
              <Copy v-if="copiedId !== verse.id" class="w-4 h-4" />
              <Check v-else class="w-4 h-4 text-emerald-600" />
            </button>
          </div>

          <!-- Arabic Text -->
          <div class="py-2 text-right dir-rtl">
            <p class="font-quran text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-[2.2] tracking-wide font-bold">
              {{ verse.text }}
            </p>
          </div>

          <!-- Transliteration -->
          <p v-if="verse.transliteration" class="text-emerald-800 text-sm italic leading-relaxed font-medium">
            {{ verse.transliteration }}
          </p>

          <!-- Indonesian Translation -->
          <p class="text-gray-700 text-sm sm:text-base leading-relaxed">
            {{ verse.translation }}
          </p>

          <!-- Footnotes -->
          <div v-if="verse.footnotes" class="bg-gray-50 p-3 rounded-2xl text-xs text-gray-500 border border-gray-100">
            <span class="font-bold text-gray-600">Catatan:</span> {{ verse.footnotes }}
          </div>
        </div>
      </div>

      <!-- Sentinel element for IntersectionObserver -->
      <div ref="sentinelRef" class="h-10 my-4 flex items-center justify-center">
        <!-- Loading More Indicator -->
        <div v-if="loadingMore" class="flex items-center gap-2 text-emerald-700 text-sm font-medium py-4">
          <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-emerald-600 border-t-transparent"></div>
          <span>Memuat ayat selanjutnya...</span>
        </div>
      </div>

      <!-- Manual Load More Button fallback if observer missed -->
      <div v-if="hasMore && !loadingMore" class="text-center my-4">
        <button
          @click="loadNextPage"
          class="px-6 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm rounded-2xl border border-emerald-200 transition-all cursor-pointer"
        >
          Muat Lebih Banyak Ayat
        </button>
      </div>

      <!-- End of Surah Indicator -->
      <div v-if="!hasMore && verses.length > 0" class="text-center py-10 my-6 border-t border-gray-200/80">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-full border border-emerald-200">
          <span>Akhir Surah {{ chapterDetails.latin }} ({{ chapterDetails.ayat }} Ayat)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Copy, Check } from 'lucide-vue-next';
import { getQuranChapterVerses } from '@/api';

const route = useRoute();
const router = useRouter();

const chapterNumber = computed(() => parseInt(route.params.chapter, 10));

const initialLoading = ref(true);
const loadingMore = ref(false);
const error = ref(null);

const chapterDetails = ref(null);
const verses = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);
const hasMore = ref(false);

const copiedId = ref(null);
const sentinelRef = ref(null);
let observer = null;

async function resetAndFetch() {
  verses.value = [];
  currentPage.value = 1;
  lastPage.value = 1;
  hasMore.value = false;
  initialLoading.value = true;
  error.value = null;

  await fetchVerses(1);
}

async function fetchVerses(page = 1) {
  try {
    if (page === 1) {
      initialLoading.value = true;
    } else {
      loadingMore.value = true;
    }
    error.value = null;

    const res = await getQuranChapterVerses(chapterNumber.value, page);
    if (res && res.success) {
      chapterDetails.value = res.chapter;
      if (res.data) {
        const newVerses = res.data.data || [];
        if (page === 1) {
          verses.value = newVerses;
        } else {
          // Filter duplicates just in case
          const existingIds = new Set(verses.value.map(v => v.id));
          const filtered = newVerses.filter(v => !existingIds.has(v.id));
          verses.value = [...verses.value, ...filtered];
        }

        currentPage.value = res.data.current_page;
        lastPage.value = res.data.last_page;
        hasMore.value = res.data.current_page < res.data.last_page;
      }
    } else {
      error.value = res.message || 'Surah tidak ditemukan.';
    }
  } catch (e) {
    console.error('Error fetching verses:', e);
    error.value = typeof e === 'string' ? e : (e.message || 'Gagal memuat data ayat.');
  } finally {
    initialLoading.value = false;
    loadingMore.value = false;
  }
}

async function loadNextPage() {
  if (!hasMore.value || loadingMore.value || initialLoading.value) return;
  await fetchVerses(currentPage.value + 1);
}

function setupObserver() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting && hasMore.value && !loadingMore.value && !initialLoading.value) {
        loadNextPage();
      }
    },
    {
      rootMargin: '200px 0px', // Trigger load 200px before scrolling to bottom
    }
  );

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value);
  }
}

onMounted(async () => {
  if (chapterNumber.value) {
    await resetAndFetch();
    setupObserver();
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

watch(chapterNumber, async (newVal) => {
  if (newVal) {
    await resetAndFetch();
    setupObserver();
  }
});

watch(sentinelRef, (el) => {
  if (el && observer) {
    observer.disconnect();
    observer.observe(el);
  }
});

function goBack() {
  router.push({ name: 'tadabbur' });
}

function copyVerse(verse) {
  const textToCopy = `${verse.text}\n\n${verse.translation}\n(QS. ${chapterDetails.value.latin}: ${verse.verse})`;
  navigator.clipboard.writeText(textToCopy);
  copiedId.value = verse.id;
  setTimeout(() => {
    copiedId.value = null;
  }, 2000);
}
</script>

<style scoped>
.font-quran {
  font-family: 'KFGQPC Hafs Uthmanic Script', 'lpmq', serif;
}
.font-arabic {
  font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Dubai', serif;
}
</style>

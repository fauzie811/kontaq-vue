<template>
  <div>
    <!-- Navigation / Header Bar -->
    <nav class="mb-6 flex items-center justify-between gap-1.5 sm:gap-2 rounded-full bg-muted px-3.5 sm:px-10 py-2 sm:py-3">
      <router-link
        :to="{ name: 'home' }"
        class="font-medium text-primary text-sm sm:text-base hover:text-primary/80 transition-colors shrink-0"
      >
        Beranda
      </router-link>

      <div class="flex items-center gap-1.5 sm:gap-4 min-w-0">
        <label class="relative flex items-center rounded-full bg-card min-w-0">
          <span class="sr-only">Pilih surah</span>
          <select
            :value="chapterNumber"
            @change="goToChapter($event.target.value)"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-medium text-primary text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring max-w-32 sm:max-w-none truncate pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2"
          >
            <option v-for="(chapter, number) in CHAPTER_DETAILS" :key="number" :value="Number(number)">
              {{ chapter.latin }}
            </option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>

        <label class="relative flex items-center rounded-full bg-card shrink-0">
          <span class="sr-only">Pilih ayat</span>
          <select
            :value="selectedVerse"
            @change="goToVerse($event.target.value)"
            class="appearance-none bg-transparent bg-none border-0 rounded-full font-medium text-primary text-sm sm:text-base cursor-pointer focus:outline-none focus:ring-0 focus-visible:ring-2 focus-visible:ring-ring pl-3 sm:pl-5 pr-7 sm:pr-12 py-1.5 sm:py-2"
          >
            <option v-for="n in verseCount" :key="n" :value="n">{{ n }}</option>
          </select>
          <span class="pointer-events-none absolute right-2 sm:right-4 flex flex-col items-center text-primary">
            <ChevronUp class="w-3.5 h-3.5 sm:w-5 sm:h-5 -mb-1" />
            <ChevronDown class="w-3.5 h-3.5 sm:w-5 sm:h-5" />
          </span>
        </label>
      </div>

      <router-link
        :to="{ name: 'quizzes' }"
        class="font-medium text-primary text-sm sm:text-base hover:text-primary/80 transition-colors shrink-0"
      >
        Kuis
      </router-link>
    </nav>

    <!-- Initial Loading State -->
    <div v-if="initialLoading" class="text-center py-20 bg-card text-card-foreground rounded-2xl border border-border p-6">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      <p class="text-muted-foreground text-sm mt-3 font-medium">Memuat ayat-ayat surah...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 text-center text-destructive my-6">
      <p class="font-medium text-lg mb-2">Terjadi Kesalahan</p>
      <p class="text-sm mb-4">{{ error }}</p>
      <button
        @click="resetAndFetch"
        class="px-5 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold rounded-full text-sm transition-all cursor-pointer"
      >
        Coba Lagi
      </button>
    </div>

    <div v-else-if="chapterDetails">
      <!-- Surah Header Banner -->
      <div class="p-4 sm:p-6 mb-8 relative overflow-hidden">
        <div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <div>
            <div class="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-border">
              <span>Surah #{{ chapterDetails.number }}</span>
              <span>•</span>
              <span>{{ chapterDetails.revelation_type || 'Makkiyah' }}</span>
              <span>•</span>
              <span>{{ chapterDetails.ayat }} Ayat</span>
            </div>
            <h1 class="text-3xl sm:text-4xl font-bold tracking-tight mb-1 text-foreground">
              {{ chapterDetails.latin }}
            </h1>
            <p class="text-muted-foreground text-base sm:text-lg font-medium">
              "{{ chapterDetails.meaning }}"
            </p>
          </div>

          <SurahName
            :chapter="chapterDetails.number"
            customClass="text-4xl sm:text-6xl text-primary"
          />
        </div>
      </div>

      <!-- Quran Content Card: Bismillah + all verses -->
      <div class="divide-y divide-border">
        <!-- Bismillah (Show if not Surah At-Tawbah #9) -->
        <div
          v-if="chapterDetails.number !== 9 && chapterDetails.number !== 1"
          class="px-4 py-6 sm:px-6 text-center"
        >
          <p class="font-quran text-xl sm:text-2xl lg:text-3xl text-foreground dir-rtl leading-relaxed">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
          <p class="text-sm text-muted-foreground font-medium mt-2">
            Dengan menyebut nama Allah Yang Maha Pengasih, lagi Maha Penyayang
          </p>
        </div>

        <!-- Verses -->
        <QuranVerseItem
          v-for="verse in verses"
          :key="verse.id"
          :ref="(el) => setVerseRef(el, verse.verse)"
          :verse="verse"
          :chapterDetails="chapterDetails"
          :isActive="isVerseActive(verse.verse)"
          :isTargeted="targetVerseNumber === verse.verse"
          :isPlaying="quranAudio.isPlaying"
          :isCopied="copiedId === verse.id"
          @play-verse="handlePlayVerse"
          @copy-verse="copyVerse"
        />
      </div>

      <!-- Sentinel element for IntersectionObserver -->
      <div ref="sentinelRef" class="h-10 my-4 flex items-center justify-center">
        <!-- Loading More Indicator -->
        <div v-if="loadingMore" class="flex items-center gap-2 text-primary text-sm font-medium py-4">
          <div class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
          <span>Memuat ayat selanjutnya...</span>
        </div>
      </div>

      <!-- Manual Load More Button fallback if observer missed -->
      <div v-if="hasMore && !loadingMore" class="text-center my-4">
        <button
          @click="loadNextPage"
          class="px-6 py-2.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold text-sm rounded-full border border-border transition-all cursor-pointer"
        >
          Muat Lebih Banyak Ayat
        </button>
      </div>

      <!-- End of Surah Indicator -->
      <div v-if="!hasMore && verses.length > 0" class="text-center py-10 my-6 border-t border-border">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground font-semibold text-xs rounded-full border border-border">
          <span>Akhir Surah {{ chapterDetails.latin }} ({{ chapterDetails.ayat }} Ayat)</span>
        </div>
      </div>
    </div>

    <!-- Bottom Audio Player -->
    <QuranAudioPlayer :chapterName="chapterDetails?.latin" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import { CHAPTER_DETAILS } from '@/constants/quran';
import { getQuranChapterVerses } from '@/api';
import { quranAudio } from '@/store/quranAudio';
import QuranAudioPlayer from '@/components/QuranAudioPlayer.vue';
import QuranVerseItem from '@/components/QuranVerseItem.vue';
import SurahName from '@/components/SurahName.vue';

const route = useRoute();
const router = useRouter();

const chapterNumber = computed(() => parseInt(route.params.chapter, 10));
const targetVerseNumber = computed(() => {
  const v =
    route.query.verse ||
    (route.hash ? route.hash.replace('#verse-', '').replace('#', '') : null);
  return v ? parseInt(v, 10) : null;
});

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
const verseRefs = ref({});
let observer = null;

function setVerseRef(el, verseNum) {
  if (el) {
    verseRefs.value[verseNum] = el.$el || el;
  }
}

function isVerseActive(verseNum) {
  return quranAudio.currentChapterNumber === chapterNumber.value && quranAudio.currentVerseNumber === verseNum;
}

function handlePlayVerse(verse) {
  quranAudio.playVerse(verse, chapterNumber.value, verses.value, loadNextPage);
}

watch(verses, (newVerses) => {
  if (quranAudio.currentChapterNumber === chapterNumber.value) {
    quranAudio.versesList = newVerses;
  }
});

async function scrollToVerse(verseNum, smooth = true) {
  if (!verseNum) return;
  await nextTick();
  const attemptScroll = () => {
    const el = verseRefs.value[verseNum] || (typeof document !== 'undefined' ? document.getElementById(`verse-${verseNum}`) : null);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center',
      });
      return true;
    }
    return false;
  };

  if (!attemptScroll()) {
    setTimeout(attemptScroll, 120);
  }
}

watch(
  () => quranAudio.currentVerseNumber,
  async (newVerseNum) => {
    if (newVerseNum && quranAudio.currentChapterNumber === chapterNumber.value) {
      await scrollToVerse(newVerseNum, true);
    }
  }
);

watch(targetVerseNumber, async (newVerse) => {
  if (!newVerse || !chapterNumber.value) return;

  const isLoaded = verses.value.some((v) => v.verse === newVerse);
  if (isLoaded) {
    await scrollToVerse(newVerse, true);
    return;
  }

  const targetPage = Math.ceil(newVerse / 20);
  if (targetPage > currentPage.value && currentPage.value < lastPage.value) {
    loadingMore.value = true;
    try {
      const maxPageToLoad = Math.min(targetPage, lastPage.value);
      const pagePromises = [];
      for (let p = currentPage.value + 1; p <= maxPageToLoad; p++) {
        pagePromises.push(getQuranChapterVerses(chapterNumber.value, p));
      }

      const results = await Promise.all(pagePromises);
      const newVerses = [];
      for (const res of results) {
        if (res && res.success && res.data?.data) {
          newVerses.push(...res.data.data);
        }
      }

      const existingIds = new Set(verses.value.map((v) => v.id));
      const filtered = newVerses.filter((v) => !existingIds.has(v.id));
      verses.value = [...verses.value, ...filtered];

      currentPage.value = maxPageToLoad;
      hasMore.value = maxPageToLoad < lastPage.value;

      await scrollToVerse(newVerse, true);
    } catch (e) {
      console.error('Error loading additional pages for verse:', e);
    } finally {
      loadingMore.value = false;
    }
  }
});

async function resetAndFetch() {
  verses.value = [];
  verseRefs.value = {};
  currentPage.value = 1;
  lastPage.value = 1;
  hasMore.value = false;
  initialLoading.value = true;
  error.value = null;

  try {
    const targetVerse = targetVerseNumber.value;
    const targetPage = targetVerse ? Math.ceil(targetVerse / 20) : 1;

    const res1 = await getQuranChapterVerses(chapterNumber.value, 1);
    if (!res1 || !res1.success) {
      error.value = res1?.message || 'Surah tidak ditemukan.';
      return;
    }

    chapterDetails.value = res1.chapter;
    const totalPages = res1.data?.last_page || 1;
    lastPage.value = totalPages;

    let loadedVerses = res1.data?.data || [];
    let finalPage = 1;

    if (targetPage > 1 && totalPages >= 2) {
      const maxPageToLoad = Math.min(targetPage, totalPages);
      finalPage = maxPageToLoad;

      const pagePromises = [];
      for (let p = 2; p <= maxPageToLoad; p++) {
        pagePromises.push(getQuranChapterVerses(chapterNumber.value, p));
      }

      const additionalResults = await Promise.all(pagePromises);
      for (const res of additionalResults) {
        if (res && res.success && res.data?.data) {
          loadedVerses = [...loadedVerses, ...res.data.data];
        }
      }
    }

    verses.value = loadedVerses;
    currentPage.value = finalPage;
    hasMore.value = finalPage < totalPages;

    if (targetVerse) {
      await scrollToVerse(targetVerse, false);
    }
  } catch (e) {
    console.error('Error fetching verses:', e);
    error.value = typeof e === 'string' ? e : (e.message || 'Gagal memuat data ayat.');
  } finally {
    initialLoading.value = false;
    loadingMore.value = false;
  }
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
      rootMargin: '200px 0px',
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
  quranAudio.stop();
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

const verseCount = computed(() => CHAPTER_DETAILS[chapterNumber.value]?.ayat || chapterDetails.value?.ayat || 1);
const selectedVerse = ref(targetVerseNumber.value || 1);
watch(targetVerseNumber, (v) => { selectedVerse.value = v || 1; });

function goToChapter(number) {
  router.push({ name: 'quran.show', params: { chapter: number } });
}

function goToVerse(number) {
  const verse = parseInt(number, 10);
  selectedVerse.value = verse;
  // Same verse as the URL won't retrigger the targetVerseNumber watcher, so scroll directly.
  if (verse === targetVerseNumber.value) {
    scrollToVerse(verse, true);
    return;
  }
  router.replace({ query: { ...route.query, verse } });
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

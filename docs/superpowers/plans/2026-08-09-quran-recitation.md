# Quran Recitation per Ayat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement per-ayat Quran audio recitation feature with continuous autoplay, switchable EveryAyah reciters (12 top Qaris), playback speed control, and a sticky bottom audio bar in Kontaq Vue.

**Architecture:** Create a reactive Vue audio store (`src/store/quranAudio.js`) encapsulating the HTML5 Audio instance and audio playback state/logic. Create a sticky audio control component (`src/components/QuranAudioPlayer.vue`). Integrate audio trigger buttons, active verse highlighting, smooth auto-scrolling, and auto-fetching next page into `src/pages/Quran/Show.vue`.

**Tech Stack:** Vue 3 (Composition API / reactive objects), Tailwind CSS (v4 styling), Lucide Vue icons (`lucide-vue-next`), HTML5 Audio API.

## Global Constraints
- Target reciter base URL: `https://everyayah.com/data/{reciter_folder}/{surah_00X}{ayat_00X}.mp3`
- Default reciter: `Mishary_Rashid_Alafasy_128kbps`
- LocalStorage key: `'kontaq_quran_reciter'`

---

### Task 1: Create Reactive Quran Audio Store

**Files:**
- Create: `src/store/quranAudio.js`

**Interfaces:**
- Produces: `quranAudio` reactive object with methods:
  - `playVerse(verse, chapterNumber, versesList, onLoadMore)`
  - `togglePlayPause()`
  - `playNext()`
  - `playPrev()`
  - `setReciter(reciterId)`
  - `setPlaybackRate(speed)`
  - `stop()`
  - `RECITERS`: List of available reciters array `[{ id, name, folder }]`

- [ ] **Step 1: Write `src/store/quranAudio.js` implementation**

```javascript
import { reactive } from 'vue';

export const RECITERS = [
  { id: 'Mishary_Rashid_Alafasy_128kbps', name: 'Mishary Rashid Alafasy', folder: 'Mishary_Rashid_Alafasy_128kbps' },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)', folder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)', folder: 'Abdul_Basit_Mujawwad_128kbps' },
  { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahmaan As-Sudais', folder: 'Abdurrahmaan_As-Sudais_192kbps' },
  { id: 'Abu_Bakr_Shatri_128kbps', name: 'Abu Bakr Al-Shatri', folder: 'Abu_Bakr_Shatri_128kbps' },
  { id: 'Mahmoud_Khaliyl_Al-Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', folder: 'Mahmoud_Khaliyl_Al-Husary_128kbps' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'Saood_ash-Shuraym_64kbps', name: 'Saood ash-Shuraym', folder: 'Saood_ash-Shuraym_64kbps' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub', folder: 'Muhammad_Ayyoub_128kbps' },
  { id: 'MaherAlMuaiqly128kbps', name: 'Maher Al Muaiqly', folder: 'MaherAlMuaiqly128kbps' },
  { id: 'Ahmed_ibn_Ali_al-Ajamy_128kbps', name: 'Ahmed ibn Ali al-Ajamy', folder: 'Ahmed_ibn_Ali_al-Ajamy_128kbps' },
  { id: 'Hani_Rifai_192kbps', name: 'Hani Ar-Rifai', folder: 'Hani_Rifai_192kbps' },
];

const LOCAL_STORAGE_KEY = 'kontaq_quran_reciter';

function getInitialReciter() {
  const savedId = typeof localStorage !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;
  const found = RECITERS.find(r => r.id === savedId);
  return found || RECITERS[0];
}

let audioInstance = null;

function getAudioInstance() {
  if (!audioInstance && typeof Audio !== 'undefined') {
    audioInstance = new Audio();
  }
  return audioInstance;
}

export const quranAudio = reactive({
  reciter: getInitialReciter(),
  isPlaying: false,
  isBuffering: false,
  error: null,
  currentVerseNumber: null,
  currentChapterNumber: null,
  currentVerseObj: null,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,
  versesList: [],
  onLoadMore: null,

  initAudioListeners() {
    const audio = getAudioInstance();
    if (!audio || audio._listenersAttached) return;

    audio._listenersAttached = true;

    audio.addEventListener('playing', () => {
      this.isPlaying = true;
      this.isBuffering = false;
      this.error = null;
    });

    audio.addEventListener('pause', () => {
      this.isPlaying = false;
    });

    audio.addEventListener('waiting', () => {
      this.isBuffering = true;
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime || 0;
      this.duration = audio.duration || 0;
    });

    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.playNext();
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.isPlaying = false;
      this.isBuffering = false;
      this.error = 'Gagal memuat audio ayat.';
    });
  },

  getAudioUrl(chapterNumber, verseNumber) {
    const pad = (n) => String(n).padStart(3, '0');
    return `https://everyayah.com/data/${this.reciter.folder}/${pad(chapterNumber)}${pad(verseNumber)}.mp3`;
  },

  playVerse(verse, chapterNumber, versesList = [], onLoadMore = null) {
    this.initAudioListeners();
    const audio = getAudioInstance();
    if (!audio) return;

    if (versesList.length > 0) {
      this.versesList = versesList;
    }
    if (onLoadMore) {
      this.onLoadMore = onLoadMore;
    }

    const verseNum = typeof verse === 'object' ? verse.verse : verse;
    const verseObj = typeof verse === 'object' ? verse : versesList.find(v => v.verse === verseNum);

    // Toggle pause if clicking current playing verse
    if (this.currentChapterNumber === chapterNumber && this.currentVerseNumber === verseNum && this.isPlaying) {
      this.pause();
      return;
    }

    this.currentChapterNumber = chapterNumber;
    this.currentVerseNumber = verseNum;
    this.currentVerseObj = verseObj || { verse: verseNum };
    this.error = null;

    const url = this.getAudioUrl(chapterNumber, verseNum);
    audio.src = url;
    audio.playbackRate = this.playbackRate;
    audio.load();

    this.isBuffering = true;
    audio.play().catch(err => {
      console.error('Play error:', err);
      this.isPlaying = false;
      this.isBuffering = false;
      this.error = 'Tidak dapat memutar audio.';
    });
  },

  pause() {
    const audio = getAudioInstance();
    if (audio) {
      audio.pause();
      this.isPlaying = false;
    }
  },

  resume() {
    const audio = getAudioInstance();
    if (audio && audio.src) {
      audio.play().catch(err => console.error(err));
    }
  },

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else if (this.currentVerseNumber) {
      this.resume();
    }
  },

  async playNext() {
    if (!this.currentVerseNumber || !this.versesList.length) return;

    const currentIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
    if (currentIndex >= 0 && currentIndex < this.versesList.length - 1) {
      const nextVerse = this.versesList[currentIndex + 1];
      this.playVerse(nextVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
    } else if (currentIndex === this.versesList.length - 1 && this.onLoadMore) {
      // Reached the end of current list, try loading more
      this.isBuffering = true;
      try {
        await this.onLoadMore();
        // Give reactive state a tiny tick to update versesList
        setTimeout(() => {
          const newIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
          if (newIndex >= 0 && newIndex < this.versesList.length - 1) {
            const nextVerse = this.versesList[newIndex + 1];
            this.playVerse(nextVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
          } else {
            this.stop();
          }
        }, 300);
      } catch (_) {
        this.stop();
      }
    } else {
      this.stop();
    }
  },

  playPrev() {
    if (!this.currentVerseNumber || !this.versesList.length) return;

    const currentIndex = this.versesList.findIndex(v => v.verse === this.currentVerseNumber);
    if (currentIndex > 0) {
      const prevVerse = this.versesList[currentIndex - 1];
      this.playVerse(prevVerse, this.currentChapterNumber, this.versesList, this.onLoadMore);
    }
  },

  seek(seconds) {
    const audio = getAudioInstance();
    if (audio) {
      audio.currentTime = seconds;
      this.currentTime = seconds;
    }
  },

  setReciter(reciterId) {
    const found = RECITERS.find(r => r.id === reciterId);
    if (!found) return;

    this.reciter = found;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, reciterId);
    }

    if (this.currentChapterNumber && this.currentVerseNumber) {
      const wasPlaying = this.isPlaying;
      const currVerse = this.currentVerseNumber;
      const currChapter = this.currentChapterNumber;
      if (wasPlaying) {
        this.playVerse(currVerse, currChapter, this.versesList, this.onLoadMore);
      }
    }
  },

  setPlaybackRate(speed) {
    this.playbackRate = speed;
    const audio = getAudioInstance();
    if (audio) {
      audio.playbackRate = speed;
    }
  },

  stop() {
    const audio = getAudioInstance();
    if (audio) {
      audio.pause();
      audio.src = '';
    }
    this.isPlaying = false;
    this.isBuffering = false;
    this.currentVerseNumber = null;
    this.currentChapterNumber = null;
    this.currentVerseObj = null;
  }
});
```

- [ ] **Step 2: Commit store file**

```bash
git add src/store/quranAudio.js
git commit -m "feat: create reactive quran audio store with EveryAyah integration"
```

---

### Task 2: Create Sticky Bottom Audio Player Component

**Files:**
- Create: `src/components/QuranAudioPlayer.vue`

**Interfaces:**
- Consumes: `quranAudio` store from `@/store/quranAudio`

- [ ] **Step 1: Write `src/components/QuranAudioPlayer.vue` component**

```vue
<template>
  <Transition
    enter-active-class="transition ease-out duration-300 transform"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-200 transform"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="quranAudio.currentVerseNumber"
      class="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-emerald-200/80 shadow-2xl px-4 py-3 sm:px-6"
    >
      <div class="max-w-4xl mx-auto flex flex-col gap-2">
        <!-- Progress Bar -->
        <div class="flex items-center gap-3 text-xs font-medium text-gray-500">
          <span>{{ formatTime(quranAudio.currentTime) }}</span>
          <input
            type="range"
            min="0"
            :max="quranAudio.duration || 100"
            :value="quranAudio.currentTime"
            @input="onSeek"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span>{{ formatTime(quranAudio.duration) }}</span>
        </div>

        <div class="flex items-center justify-between gap-4">
          <!-- Info Verse & Reciter Dropdown -->
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
              {{ quranAudio.currentVerseNumber }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-emerald-900 truncate">
                QS {{ chapterName ? chapterName : `Surah #${quranAudio.currentChapterNumber}` }} : {{ quranAudio.currentVerseNumber }}
              </p>
              
              <!-- Reciter Selector -->
              <div class="relative inline-block mt-0.5">
                <select
                  :value="quranAudio.reciter.id"
                  @change="onReciterChange"
                  class="text-xs bg-emerald-50/80 border border-emerald-200 text-emerald-800 rounded-lg px-2 py-0.5 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[180px] sm:max-w-[220px] truncate"
                >
                  <option
                    v-for="r in RECITERS"
                    :key="r.id"
                    :value="r.id"
                  >
                    {{ r.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Transport Controls -->
          <div class="flex items-center gap-1 sm:gap-2">
            <!-- Speed Selector -->
            <button
              @click="cycleSpeed"
              title="Kecepatan Pemutaran"
              class="px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition cursor-pointer min-w-[40px] text-center"
            >
              {{ quranAudio.playbackRate }}x
            </button>

            <!-- Previous Ayat -->
            <button
              @click="quranAudio.playPrev()"
              title="Ayat Sebelumnya"
              class="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
            >
              <SkipBack class="w-5 h-5" />
            </button>

            <!-- Play / Pause -->
            <button
              @click="quranAudio.togglePlayPause()"
              title="Putar / Jeda"
              class="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition cursor-pointer shadow-md flex items-center justify-center min-w-[40px] min-h-[40px]"
            >
              <div v-if="quranAudio.isBuffering" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <Pause v-else-if="quranAudio.isPlaying" class="w-5 h-5 fill-white" />
              <Play v-else class="w-5 h-5 fill-white ml-0.5" />
            </button>

            <!-- Next Ayat -->
            <button
              @click="quranAudio.playNext()"
              title="Ayat Selanjutnya"
              class="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
            >
              <SkipForward class="w-5 h-5" />
            </button>

            <!-- Close / Stop -->
            <button
              @click="quranAudio.stop()"
              title="Tutup Player"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer ml-1"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-vue-next';
import { quranAudio, RECITERS } from '@/store/quranAudio';

const props = defineProps({
  chapterName: {
    type: String,
    default: ''
  }
});

const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];

function cycleSpeed() {
  const currentIndex = speeds.indexOf(quranAudio.playbackRate);
  const nextIndex = (currentIndex + 1) % speeds.length;
  quranAudio.setPlaybackRate(speeds[nextIndex]);
}

function onReciterChange(e) {
  quranAudio.setReciter(e.target.value);
}

function onSeek(e) {
  quranAudio.seek(parseFloat(e.target.value));
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
</script>
```

- [ ] **Step 2: Commit sticky audio player component**

```bash
git add src/components/QuranAudioPlayer.vue
git commit -m "feat: add QuranAudioPlayer sticky bottom bar component"
```

---

### Task 3: Integrate Audio Player into `src/pages/Quran/Show.vue`

**Files:**
- Modify: `src/pages/Quran/Show.vue`

**Interfaces:**
- Consumes `quranAudio` from `@/store/quranAudio` and `QuranAudioPlayer` from `@/components/QuranAudioPlayer.vue`

- [ ] **Step 1: Update `src/pages/Quran/Show.vue`**
  - Import `quranAudio` store and `QuranAudioPlayer` component.
  - Import `Volume2`, `Play`, `Pause` from `lucide-vue-next`.
  - Add Play audio button next to copy verse button on each verse card header.
  - Apply active verse ring/background highlight (`isVerseActive(verse.verse)`).
  - Add watcher for `quranAudio.currentVerseNumber` to smooth scroll to active verse element using `verseRef`.
  - Pass `loadNextPage` function to `quranAudio.playVerse` so continuous playback seamlessly triggers fetching next page verses.
  - Clean up audio (`quranAudio.stop()`) on unmount if leaving Quran page.
  - Render `<QuranAudioPlayer :chapterName="chapterDetails?.latin" />` at end of template.

- [ ] **Step 2: Verify app build & dev server**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/pages/Quran/Show.vue
git commit -m "feat: integrate per-ayat audio recitation, highlighting, auto-scrolling, and bottom player in Show.vue"
```

---

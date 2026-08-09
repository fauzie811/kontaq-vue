# Expandable Murattal Audio Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `QuranAudioPlayer.vue` into a compact, floating, expandable player card that starts minimized on mobile to avoid blocking Quran text, and expands on demand for full controls.

**Architecture:** Vue 3 Composition API state (`isExpanded`) controlling template conditional view (Mini vs. Expanded) wrapped in a smooth CSS transition floating card (`fixed bottom-3 left-3 right-3 sm:right-6 sm:w-96`).

**Tech Stack:** Vue 3, Tailwind CSS, Lucide Icons (`ChevronUp`, `ChevronDown`, `Play`, `Pause`, `SkipBack`, `SkipForward`, `X`, `User`).

## Global Constraints

- Preserve all existing `quranAudio` store interactions (play, pause, next, prev, stop, setReciter, setPlaybackRate, seek).
- Ensure mobile-first responsive design (floating card with backdrop blur).
- Default to collapsed mini-player mode on initial play.

---

### Task 1: Refactor `QuranAudioPlayer.vue` to Expandable Floating Card

**Files:**
- Modify: [`src/components/QuranAudioPlayer.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/components/QuranAudioPlayer.vue)

**Interfaces:**
- Consumes: `quranAudio` store reactivity (`isPlaying`, `isBuffering`, `currentTime`, `duration`, `playbackRate`, `reciter`, `currentVerseNumber`, `currentChapterNumber`) and `RECITERS` list.
- Produces: Expandable UI component with `isExpanded` reactive state and toggle controls (`ChevronUp`, `ChevronDown`).

- [ ] **Step 1: Update imports and add `isExpanded` state in `QuranAudioPlayer.vue`**

Add `ChevronUp`, `ChevronDown`, `User` to Lucide icon imports, and define `const isExpanded = ref(false)`. Watch `quranAudio.currentVerseNumber` to reset `isExpanded` to `false` when a new audio starts if desired.

```javascript
import { ref, watch } from 'vue';
import { Play, Pause, SkipBack, SkipForward, X, ChevronUp, ChevronDown, User } from 'lucide-vue-next';
import { quranAudio, RECITERS } from '@/store/quranAudio';

const isExpanded = ref(false);

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}
```

- [ ] **Step 2: Update Component Template for Mini and Expanded Modes**

Replace the template in `QuranAudioPlayer.vue` with:

```html
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
      class="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl overflow-hidden transition-all duration-300"
    >
      <!-- Top Micro Progress Line (visible always) -->
      <div class="w-full bg-emerald-100 h-1">
        <div
          class="bg-emerald-500 h-1 transition-all duration-200"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <!-- COLLAPSED / MINI PLAYER VIEW -->
      <div v-if="!isExpanded" class="p-3 flex items-center justify-between gap-3">
        <!-- Title & Info (Clickable to Expand) -->
        <div
          @click="toggleExpanded"
          class="flex items-center gap-3 min-w-0 cursor-pointer flex-1 group"
        >
          <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition">
            {{ quranAudio.currentVerseNumber }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-emerald-900 truncate">
              QS {{ chapterName ? chapterName : `Surah #${quranAudio.currentChapterNumber}` }} : {{ quranAudio.currentVerseNumber }}
            </p>
            <p class="text-[10px] text-gray-500 truncate">
              {{ quranAudio.reciter.name }}
            </p>
          </div>
        </div>

        <!-- Mini Controls -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            @click="quranAudio.togglePlayPause()"
            title="Putar / Jeda"
            class="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition cursor-pointer shadow-sm flex items-center justify-center w-8 h-8"
          >
            <div v-if="quranAudio.isBuffering" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <Pause v-else-if="quranAudio.isPlaying" class="w-4 h-4 fill-white" />
            <Play v-else class="w-4 h-4 fill-white ml-0.5" />
          </button>

          <button
            @click="toggleExpanded"
            title="Perluas Player"
            class="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
          >
            <ChevronUp class="w-5 h-5" />
          </button>

          <button
            @click="quranAudio.stop()"
            title="Tutup Player"
            class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- EXPANDED PLAYER VIEW -->
      <div v-else class="p-4 flex flex-col gap-3">
        <!-- Expanded Header -->
        <div class="flex items-center justify-between border-b border-gray-100 pb-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
              {{ quranAudio.currentVerseNumber }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-emerald-900 truncate">
                QS {{ chapterName ? chapterName : `Surah #${quranAudio.currentChapterNumber}` }} : {{ quranAudio.currentVerseNumber }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              @click="toggleExpanded"
              title="Kecilkan Player"
              class="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
            >
              <ChevronDown class="w-5 h-5" />
            </button>
            <button
              @click="quranAudio.stop()"
              title="Tutup Player"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Full Seeker Slider -->
        <div class="flex items-center gap-2.5 text-xs font-medium text-gray-500 pt-1">
          <span class="w-8 text-right text-[11px]">{{ formatTime(quranAudio.currentTime) }}</span>
          <input
            type="range"
            min="0"
            :max="quranAudio.duration || 100"
            :value="quranAudio.currentTime"
            @input="onSeek"
            class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span class="w-8 text-[11px]">{{ formatTime(quranAudio.duration) }}</span>
        </div>

        <!-- Main Transport Controls -->
        <div class="flex items-center justify-center gap-3 py-1">
          <!-- Speed Button -->
          <button
            @click="cycleSpeed"
            title="Kecepatan Pemutaran"
            class="px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition cursor-pointer min-w-[38px] text-center"
          >
            {{ quranAudio.playbackRate }}x
          </button>

          <!-- Prev -->
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
            class="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition cursor-pointer shadow-md flex items-center justify-center w-11 h-11"
          >
            <div v-if="quranAudio.isBuffering" class="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <Pause v-else-if="quranAudio.isPlaying" class="w-5 h-5 fill-white" />
            <Play v-else class="w-5 h-5 fill-white ml-0.5" />
          </button>

          <!-- Next -->
          <button
            @click="quranAudio.playNext()"
            title="Ayat Selanjutnya"
            class="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer"
          >
            <SkipForward class="w-5 h-5" />
          </button>
        </div>

        <!-- Reciter Selector Dropdown -->
        <div class="relative pt-1 border-t border-gray-100">
          <label class="block text-[10px] font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1">
            <User class="w-3 h-3" /> Qori / Murottal
          </label>
          <select
            :value="quranAudio.reciter.id"
            @change="onReciterChange"
            class="w-full text-xs bg-emerald-50/80 border border-emerald-200 text-emerald-900 rounded-xl px-3 py-2 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 truncate"
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
  </Transition>
</template>
```

- [ ] **Step 3: Add `progressPercentage` computed property in script section**

Add `computed` import and computed `progressPercentage`:

```javascript
import { ref, computed } from 'vue';

const progressPercentage = computed(() => {
  if (!quranAudio.duration) return 0;
  return Math.min(100, Math.max(0, (quranAudio.currentTime / quranAudio.duration) * 100));
});
```

- [ ] **Step 4: Verify build/compilation**

Run: `npm run build` or Vite check to confirm no syntax or template errors.

- [ ] **Step 5: Commit changes**

```bash
git add src/components/QuranAudioPlayer.vue
git commit -m "feat: refactor QuranAudioPlayer into expandable floating card"
```

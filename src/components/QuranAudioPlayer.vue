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

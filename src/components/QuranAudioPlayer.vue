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
      :class="[
        'fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 bg-card/95 text-card-foreground backdrop-blur-md border border-border shadow-xl overflow-hidden transition-all duration-300 ease-in-out',
        isExpanded ? 'rounded-2xl p-3 sm:p-4' : 'rounded-3xl p-3 sm:px-5'
      ]"
    >
      <!-- Top Micro Progress Line (visible always) -->
      <div class="w-full bg-secondary h-1 rounded-full overflow-hidden mb-1">
        <div
          class="bg-primary h-1 transition-all duration-200"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>

      <!-- PERSISTENT MINI PLAYER BAR -->
      <div class="flex items-center justify-between gap-3">
        <!-- Title & Info (Clickable to Expand) -->
        <div
          @click="toggleExpanded"
          class="flex items-center gap-3 min-w-0 cursor-pointer flex-1 group"
        >
          <div class="w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-accent transition">
            {{ quranAudio.currentVerseNumber }}
          </div>
          <div class="min-w-0">
            <p class="text-xs font-bold text-foreground truncate">
              QS {{ chapterName ? chapterName : `Surah #${quranAudio.currentChapterNumber}` }} : {{ quranAudio.currentVerseNumber }}
            </p>
            <p class="text-[10px] text-muted-foreground truncate">
              {{ quranAudio.reciter.name }}
            </p>
          </div>
        </div>

        <!-- Mini Controls -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            @click="quranAudio.togglePlayPause()"
            title="Putar / Jeda"
            class="p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition cursor-pointer shadow-xs flex items-center justify-center w-8 h-8"
          >
            <div v-if="quranAudio.isBuffering" class="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
            <Pause v-else-if="quranAudio.isPlaying" class="w-4 h-4 fill-primary-foreground text-primary-foreground" />
            <Play v-else class="w-4 h-4 fill-primary-foreground text-primary-foreground ml-0.5" />
          </button>

          <button
            @click="toggleExpanded"
            :title="isExpanded ? 'Kecilkan Player' : 'Perluas Player'"
            class="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition cursor-pointer"
          >
            <ChevronDown v-if="isExpanded" class="w-5 h-5 transition-transform duration-300" />
            <ChevronUp v-else class="w-5 h-5 transition-transform duration-300" />
          </button>

          <button
            @click="quranAudio.stop()"
            title="Tutup Player"
            class="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- SMOOTH EXPANDABLE DRAWER -->
      <div
        class="grid transition-all duration-300 ease-in-out"
        :class="isExpanded ? 'grid-rows-[1fr] opacity-100 border-t border-border mt-3' : 'grid-rows-[0fr] opacity-0 border-t-0'"
      >
        <div class="overflow-hidden">
          <div class="pt-3 flex flex-col gap-3">
            <!-- Full Seeker Slider -->
            <div class="flex items-center gap-2.5 text-xs font-medium text-muted-foreground">
              <span class="w-8 text-right text-[11px]">{{ formatTime(quranAudio.currentTime) }}</span>
              <input
                type="range"
                min="0"
                :max="quranAudio.duration || 100"
                :value="quranAudio.currentTime"
                @input="onSeek"
                class="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <span class="w-8 text-[11px]">{{ formatTime(quranAudio.duration) }}</span>
            </div>

            <!-- Main Transport Controls -->
            <div class="flex items-center justify-center gap-3 py-1">
              <!-- Speed Button -->
              <button
                @click="cycleSpeed"
                title="Kecepatan Pemutaran"
                class="px-2 py-1 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 bg-secondary rounded-lg border border-border transition cursor-pointer min-w-[38px] text-center"
              >
                {{ quranAudio.playbackRate }}x
              </button>

              <!-- Prev -->
              <button
                @click="quranAudio.playPrev()"
                title="Ayat Sebelumnya"
                class="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition cursor-pointer"
              >
                <SkipBack class="w-5 h-5" />
              </button>

              <!-- Play / Pause -->
              <button
                @click="quranAudio.togglePlayPause()"
                title="Putar / Jeda"
                class="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition cursor-pointer shadow-md flex items-center justify-center w-11 h-11"
              >
                <div v-if="quranAudio.isBuffering" class="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
                <Pause v-else-if="quranAudio.isPlaying" class="w-5 h-5 fill-primary-foreground text-primary-foreground" />
                <Play v-else class="w-5 h-5 fill-primary-foreground text-primary-foreground ml-0.5" />
              </button>

              <!-- Next -->
              <button
                @click="quranAudio.playNext()"
                title="Ayat Selanjutnya"
                class="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition cursor-pointer"
              >
                <SkipForward class="w-5 h-5" />
              </button>
            </div>

            <!-- Reciter Selector Dropdown -->
            <div class="relative pt-2 border-t border-border">
              <label class="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                <User class="w-3 h-3 text-primary" /> Qori / Murottal
              </label>
              <select
                :value="quranAudio.reciter.id"
                @change="onReciterChange"
                class="w-full text-xs bg-secondary border border-border text-secondary-foreground rounded-xl px-3 py-2 font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary truncate"
              >
                <option
                  v-for="r in RECITERS"
                  :key="r.id"
                  :value="r.id"
                  class="bg-popover text-popover-foreground"
                >
                  {{ r.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Play, Pause, SkipBack, SkipForward, X, ChevronUp, ChevronDown, User } from 'lucide-vue-next';
import { quranAudio, RECITERS } from '@/store/quranAudio';

defineProps({
  chapterName: {
    type: String,
    default: ''
  }
});

const isExpanded = ref(false);

watch(() => quranAudio.currentVerseNumber, () => {
  isExpanded.value = false;
});

function toggleExpanded() {
  isExpanded.value = !isExpanded.value;
}

const progressPercentage = computed(() => {
  if (!quranAudio.duration) return 0;
  return Math.min(100, Math.max(0, (quranAudio.currentTime / quranAudio.duration) * 100));
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

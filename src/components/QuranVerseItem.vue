<template>
  <div
    :class="[
      'rounded-3xl p-4 sm:p-7 border transition-all space-y-4 shadow-xs',
      isActive
        ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
        : 'bg-white border-gray-200/80 hover:border-emerald-200'
    ]"
  >
    <!-- Verse Header -->
    <div class="flex items-center justify-between border-b border-gray-100 pb-3">
      <div class="flex items-center gap-2">
        <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-inner">
          {{ verse.verse }}
        </span>
        <span class="text-xs text-gray-400 font-medium">
          QS {{ chapterDetails?.latin }}: {{ verse.verse }}
        </span>
      </div>

      <!-- Actions (Play Audio, Catatan Kaki, Copy Verse) -->
      <div class="flex items-center gap-1.5">
        <!-- Toggle Footnote Button -->
        <button
          v-if="verse.footnotes"
          @click="showFootnotes = !showFootnotes"
          :title="showFootnotes ? 'Sembunyikan Catatan Kaki' : 'Lihat Catatan Kaki'"
          :class="[
            'px-2.5 py-1 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[36px] inline-flex items-center gap-1.5 border',
            showFootnotes
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'text-emerald-700 bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200/80'
          ]"
        >
          <FileText class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">Catatan</span>
        </button>

        <!-- Play Audio Button -->
        <button
          @click="$emit('play-verse', verse)"
          :title="isActive && isPlaying ? 'Jeda Audio' : 'Putar Audio'"
          :class="[
            'p-2 rounded-xl transition cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center',
            isActive
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-gray-400 hover:text-emerald-700 hover:bg-emerald-50'
          ]"
        >
          <Pause v-if="isActive && isPlaying" class="w-4 h-4 fill-white" />
          <Play v-else-if="isActive" class="w-4 h-4 fill-white ml-0.5" />
          <Volume2 v-else class="w-4 h-4" />
        </button>

        <!-- Copy Verse Button -->
        <button
          @click="$emit('copy-verse', verse)"
          title="Salin Ayat"
          class="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center"
        >
          <Copy v-if="!isCopied" class="w-4 h-4" />
          <Check v-else class="w-4 h-4 text-emerald-600" />
        </button>
      </div>
    </div>

    <!-- Arabic Text -->
    <div class="py-2 text-right dir-rtl">
      <p class="font-quran text-xl sm:text-2xl lg:text-3xl text-gray-900 leading-[2.2]">
        {{ verse.text }}
      </p>
    </div>

    <!-- Transliteration -->
    <p v-if="verse.transliteration" class="text-emerald-800 text-sm italic leading-relaxed font-medium">
      {{ verse.transliteration }}
    </p>

    <!-- Indonesian Translation with Formatted Footnote Markers -->
    <p class="text-gray-700 text-sm sm:text-base leading-relaxed" v-html="formattedTranslation"></p>

    <!-- Footnotes Drawer -->
    <div
      v-if="verse.footnotes && showFootnotes"
      class="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 text-xs text-gray-700 leading-relaxed shadow-2xs space-y-1.5 transition-all mt-3"
    >
      <div class="flex items-center gap-1.5 font-bold text-emerald-900 text-xs mb-1">
        <FileText class="w-3.5 h-3.5 text-emerald-700" />
        <span>Catatan Kaki:</span>
      </div>
      <p
        v-for="(line, idx) in footnoteLines"
        :key="idx"
        class="text-gray-600 leading-relaxed pl-2 border-l-2 border-emerald-300"
      >
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FileText, Volume2, Play, Pause, Copy, Check } from 'lucide-vue-next';

const props = defineProps({
  verse: {
    type: Object,
    required: true,
  },
  chapterDetails: {
    type: Object,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isPlaying: {
    type: Boolean,
    default: false,
  },
  isCopied: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['play-verse', 'copy-verse']);

const showFootnotes = ref(false);

const formattedTranslation = computed(() => {
  if (!props.verse?.translation) return '';
  // Transform patterns like "1)" or "2)" into superscript badges
  return props.verse.translation.replace(
    /(\d+)\)/g,
    '<sup class="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-300/50 rounded-xs px-1 py-0.1 mx-0.5 select-none font-mono">[$1]</sup>'
  );
});

const footnoteLines = computed(() => {
  if (!props.verse?.footnotes) return [];
  // Split multiple footnotes if separated by line breaks or numbers
  return props.verse.footnotes
    .split(/\n+/)
    .map(line => line.trim())
    .filter(Boolean);
});
</script>

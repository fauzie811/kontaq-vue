<template>
  <div
    v-if="verses && verses.length > 0"
    class="max-w-3xl overflow-hidden bg-card text-card-foreground border border-border rounded-2xl shadow-xs mb-6"
  >
    <!-- Card Header -->
    <div
      class="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 border-b border-border/70 bg-secondary/30"
    >
      <div class="flex items-center gap-2">
        <BookOpen class="w-4 h-4 text-primary shrink-0" />
        <span class="text-xs sm:text-sm font-bold text-foreground">Ayat Terkait</span>
        <span class="text-xs text-muted-foreground font-medium">({{ verses.length }} Ayat)</span>
      </div>
      <div v-if="summaryText" class="text-xs font-semibold text-primary">
        {{ summaryText }}
      </div>
    </div>

    <!-- Compact Verses Body -->
    <div class="p-4 sm:p-6 divide-y divide-border/60">
      <div
        v-for="(verse, idx) in verses"
        :key="verse.id || idx"
        :class="[idx > 0 ? 'pt-5 mt-5' : '', 'space-y-2.5']"
      >
        <!-- Verse Meta / Badge -->
        <div class="flex items-center justify-between gap-2">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
          >
            QS. {{ getChapterName(verse.chapter) }}: {{ verse.verse }}
          </span>
          <span v-if="verse.juz" class="text-[11px] text-muted-foreground font-medium">
            Juz {{ verse.juz }}
          </span>
        </div>

        <!-- Arabic Text -->
        <div class="py-1 text-right dir-rtl">
          <p class="font-quran text-xl sm:text-2xl text-foreground leading-[2.2] sm:leading-[2.4]">
            {{ verse.text }}&nbsp;<QuranVerseNumber :number="verse.verse" />
          </p>
        </div>

        <!-- Transliteration -->
        <p
          v-if="verse.transliteration"
          class="text-primary text-xs sm:text-sm italic leading-relaxed font-medium"
        >
          {{ verse.transliteration }}
        </p>

        <!-- Translation -->
        <p
          v-if="verse.translation"
          class="text-foreground/90 text-xs sm:text-sm leading-relaxed"
          v-html="formatTranslation(verse.translation)"
        ></p>

        <!-- Footnotes (if available) -->
        <div v-if="verse.footnotes" class="pt-1">
          <button
            type="button"
            @click="toggleFootnote(verse.id || idx)"
            class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <FileText class="w-3.5 h-3.5" />
            <span>{{ isFootnoteOpen(verse.id || idx) ? 'Sembunyikan Catatan Kaki' : 'Lihat Catatan Kaki' }}</span>
          </button>
          <div
            v-if="isFootnoteOpen(verse.id || idx)"
            class="bg-secondary/60 border border-border rounded-xl p-3 text-xs text-muted-foreground leading-relaxed mt-2 space-y-1.5"
          >
            <p
              v-for="(line, fIdx) in splitFootnotes(verse.footnotes)"
              :key="fIdx"
              class="pl-2 border-l-2 border-primary/50"
            >
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { BookOpen, FileText } from 'lucide-vue-next';
import QuranVerseNumber from '@/components/QuranVerseNumber.vue';
import { getChapterName } from '@/constants/quran';

const props = defineProps({
  verses: {
    type: Array,
    default: () => [],
  },
});

const openFootnotes = ref({});

function toggleFootnote(key) {
  openFootnotes.value[key] = !openFootnotes.value[key];
}

function isFootnoteOpen(key) {
  return !!openFootnotes.value[key];
}

const summaryText = computed(() => {
  if (!props.verses || props.verses.length === 0) return '';

  const chapters = [...new Set(props.verses.map((v) => v.chapter).filter(Boolean))];

  if (chapters.length === 1) {
    const chapterNum = chapters[0];
    const surahName = getChapterName(chapterNum);
    const verseNumbers = props.verses
      .map((v) => Number(v.verse))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (verseNumbers.length === 1) {
      return `QS. ${surahName}: ${verseNumbers[0]}`;
    } else if (verseNumbers.length > 1) {
      const min = verseNumbers[0];
      const max = verseNumbers[verseNumbers.length - 1];
      return min === max ? `QS. ${surahName}: ${min}` : `QS. ${surahName}: ${min}-${max}`;
    }
    return `QS. ${surahName}`;
  }

  if (chapters.length > 1) {
    const names = chapters.map((c) => getChapterName(c));
    if (names.length <= 2) {
      return `QS. ${names.join(' & ')}`;
    }
    return `QS. ${names[0]} & ${names.length - 1} Surah Lainnya`;
  }

  return '';
});

function formatTranslation(text) {
  if (!text) return '';
  return text.replace(
    /(\d+)\)/g,
    '<sup class="inline-flex items-center text-[10px] font-bold text-primary bg-secondary border border-border rounded-xs px-1 py-0.1 mx-0.5 select-none font-mono">[$1]</sup>'
  );
}

function splitFootnotes(footnotes) {
  if (!footnotes) return [];
  return footnotes
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}
</script>

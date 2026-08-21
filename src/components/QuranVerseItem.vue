<template>
  <div
    :class="[
      'rounded-2xl p-4 sm:p-6 border transition-all space-y-4 shadow-xs',
      isActive
        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
        : 'bg-card text-card-foreground border-border/70 hover:border-primary/30'
    ]"
  >
    <!-- Verse Header -->
    <div class="flex items-center justify-between border-b border-border/60 pb-3">
      <div class="flex items-center gap-2.5">
        <span class="w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-bold text-xs flex items-center justify-center">
          {{ verse.verse }}
        </span>
        <span class="text-xs text-muted-foreground font-medium">
          QS {{ chapterDetails?.latin }}: {{ verse.verse }}
        </span>
      </div>

      <!-- Actions Dropdown (3-dots) -->
      <Menu as="div" class="relative">
        <MenuButton
          title="Opsi Ayat"
          class="p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg transition cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <MoreVertical class="w-4 h-4" />
        </MenuButton>

        <transition
          enter-active-class="transition duration-250 ease-out"
          enter-from-class="transform scale-[0.97] opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-[0.99] opacity-0"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-2xl bg-popover text-popover-foreground p-1.5 shadow-xl border border-border focus:outline-none space-y-0.5"
          >
            <!-- Play / Pause Audio -->
            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('play-verse', verse)"
                :class="[
                  active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <Pause v-if="isActive && isPlaying" class="w-4 h-4 text-primary fill-primary" />
                <Play v-else-if="isActive" class="w-4 h-4 text-primary fill-primary ml-0.5" />
                <Volume2 v-else class="w-4 h-4 text-muted-foreground" />
                <span>{{ isActive && isPlaying ? 'Jeda Audio' : 'Putar Audio' }}</span>
              </button>
            </MenuItem>

            <!-- Toggle Footnote (If available) -->
            <MenuItem v-if="verse.footnotes" v-slot="{ active }">
              <button
                @click="showFootnotes = !showFootnotes"
                :class="[
                  active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <FileText class="w-4 h-4 text-primary" />
                <span>{{ showFootnotes ? 'Sembunyikan Catatan' : 'Lihat Catatan Kaki' }}</span>
              </button>
            </MenuItem>

            <!-- Copy Verse -->
            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('copy-verse', verse)"
                :class="[
                  active ? 'bg-accent text-accent-foreground' : 'text-foreground',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <Check v-if="isCopied" class="w-4 h-4 text-primary" />
                <Copy v-else class="w-4 h-4 text-muted-foreground" />
                <span>{{ isCopied ? 'Tersalin!' : 'Salin Ayat' }}</span>
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <!-- Arabic Text -->
    <div class="py-2 text-right dir-rtl">
      <p class="font-quran text-xl sm:text-2xl lg:text-3xl text-foreground leading-[2.2]">
        {{ verse.text }}
      </p>
    </div>

    <!-- Transliteration -->
    <p v-if="verse.transliteration" class="text-primary text-sm italic leading-relaxed font-medium">
      {{ verse.transliteration }}
    </p>

    <!-- Indonesian Translation with Formatted Footnote Markers -->
    <p class="text-foreground/90 text-sm sm:text-base leading-relaxed" v-html="formattedTranslation"></p>

    <!-- Footnotes Drawer -->
    <div
      v-if="verse.footnotes && showFootnotes"
      class="bg-secondary/60 border border-border rounded-2xl p-4 text-xs text-foreground leading-relaxed shadow-2xs space-y-1.5 transition-all mt-3"
    >
      <div class="flex items-center gap-1.5 font-bold text-primary text-xs mb-1">
        <FileText class="w-3.5 h-3.5 text-primary" />
        <span>Catatan Kaki:</span>
      </div>
      <p
        v-for="(line, idx) in footnoteLines"
        :key="idx"
        class="text-muted-foreground leading-relaxed pl-2 border-l-2 border-primary/50"
      >
        {{ line }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { FileText, Volume2, Play, Pause, Copy, Check, MoreVertical } from 'lucide-vue-next';

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
    '<sup class="inline-flex items-center text-[10px] font-bold text-primary bg-secondary border border-border rounded-xs px-1 py-0.1 mx-0.5 select-none font-mono">[$1]</sup>'
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

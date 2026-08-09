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

      <!-- Actions Dropdown (3-dots) -->
      <Menu as="div" class="relative">
        <MenuButton
          title="Opsi Ayat"
          class="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <MoreVertical class="w-4 h-4" />
        </MenuButton>

        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <MenuItems
            class="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-gray-900/5 focus:outline-none space-y-0.5"
          >
            <!-- Play / Pause Audio -->
            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('play-verse', verse)"
                :class="[
                  active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <Pause v-if="isActive && isPlaying" class="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <Play v-else-if="isActive" class="w-4 h-4 text-emerald-600 fill-emerald-600 ml-0.5" />
                <Volume2 v-else class="w-4 h-4 text-gray-500" />
                <span>{{ isActive && isPlaying ? 'Jeda Audio' : 'Putar Audio' }}</span>
              </button>
            </MenuItem>

            <!-- Toggle Footnote (If available) -->
            <MenuItem v-if="verse.footnotes" v-slot="{ active }">
              <button
                @click="showFootnotes = !showFootnotes"
                :class="[
                  active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <FileText class="w-4 h-4 text-emerald-600" />
                <span>{{ showFootnotes ? 'Sembunyikan Catatan' : 'Lihat Catatan Kaki' }}</span>
              </button>
            </MenuItem>

            <!-- Copy Verse -->
            <MenuItem v-slot="{ active }">
              <button
                @click="$emit('copy-verse', verse)"
                :class="[
                  active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
                  'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
                ]"
              >
                <Check v-if="isCopied" class="w-4 h-4 text-emerald-600" />
                <Copy v-else class="w-4 h-4 text-gray-500" />
                <span>{{ isCopied ? 'Tersalin!' : 'Salin Ayat' }}</span>
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
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

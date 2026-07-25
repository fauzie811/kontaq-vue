<template>
  <div class="max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-6">
    <!-- Navigation Tabs Pill Header -->
    <div class="bg-[#e6e8e3] rounded-full p-2 flex items-center justify-between gap-2 shadow-inner border border-gray-200/60 max-w-3xl mx-auto mb-8 sm:mb-14">
      <!-- Beranda Link -->
      <router-link
        :to="{ name: 'home' }"
        class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-[#144227] font-bold text-sm sm:text-base hover:bg-white/50 transition-colors cursor-pointer"
      >
        Beranda
      </router-link>

      <!-- Active Infaq & Shodaqoh Tab -->
      <div class="px-6 py-2.5 sm:px-8 sm:py-3 bg-white rounded-full text-[#144227] font-extrabold text-sm sm:text-base shadow-sm border border-emerald-100/50">
        Infaq &amp; Shodaqoh
      </div>

      <!-- Dropdown Selector -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="bg-white px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-[#144227] font-bold text-sm sm:text-base shadow-sm border border-emerald-100/50 flex items-center gap-3 cursor-pointer hover:bg-emerald-50/50 transition-colors"
        >
          <span>{{ selectedCategory.label }}</span>
          <div class="flex flex-col text-[#144227] -space-y-1">
            <ChevronUp class="w-3.5 h-3.5 stroke-[2.5]" />
            <ChevronDown class="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        <!-- Dropdown Menu Options -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat)"
            :class="[
              selectedCategory.id === cat.id ? 'text-[#144227] font-bold bg-emerald-50' : 'text-gray-700 hover:bg-gray-50',
              'w-full text-left px-5 py-3 text-sm sm:text-base transition-colors cursor-pointer'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content Section: Left Text + Right QRIS -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center max-w-4xl mx-auto">
      <!-- Left Column: Dynamic Text & Confirmation Info -->
      <div class="md:col-span-7 text-left space-y-6 sm:space-y-8">
        <!-- Text content for non-elearning categories -->
        <p v-if="!selectedCategory.isELearning" class="text-gray-800 text-lg sm:text-xl font-medium leading-relaxed">
          {{ selectedCategory.text }}
        </p>

        <!-- Text content for E-Learning with highlighted bank details -->
        <div v-else class="space-y-4 text-gray-800 text-base sm:text-lg leading-relaxed">
          <p>
            Infaq dan shodaqoh minimal 50,090 dan maksimal tanpa batas, untuk pengembangan tadabbur online learning berbasis web, melalui rekening:
          </p>
          <p class="font-bold text-gray-900 text-lg sm:text-xl">
            Bank Syariah Indonesia (BSI) 3779444390 a.n Meyrinda Rahmawaty Hilipito QQ KontaQ
          </p>
          <p>
            Tambahkan 'Kode 90' diakhir nominal transfer. Bagi yang tidak menambahkan kode tersebut, maka infaq akan dialokasikan untuk operasional dakwah lainnya
          </p>
        </div>

        <!-- Confirmation Phone / WhatsApp Line -->
        <div class="pt-2 sm:pt-4">
          <a
            href="https://wa.me/6285345147157"
            target="_blank"
            class="inline-flex items-center gap-3 text-gray-800 hover:text-emerald-800 font-medium text-base sm:text-lg transition-colors group"
          >
            <!-- Hand touching phone icon visual -->
            <div class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <path d="M12 18h.01" />
                <path d="M9 13l2 2 4-4" />
              </svg>
            </div>
            <span>Konfirmasi: <strong class="font-bold">0853-4514-7157</strong></span>
          </a>
        </div>
      </div>

      <!-- Right Column: QRIS Display Card -->
      <div class="md:col-span-5 flex justify-center">
        <div class="bg-white p-6 sm:p-7 rounded-3xl shadow-lg border border-gray-100 max-w-xs w-full flex flex-col items-center text-center relative overflow-hidden">
          <!-- QR Code Grid Graphic -->
          <div class="w-full aspect-square bg-white p-3 border border-gray-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <svg class="w-full h-full text-gray-900" viewBox="0 0 100 100" fill="currentColor">
              <!-- Top Left Finder Pattern -->
              <rect x="6" y="6" width="24" height="24" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="11" y="11" width="14" height="14" />
              
              <!-- Top Right Finder Pattern -->
              <rect x="70" y="6" width="24" height="24" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="75" y="11" width="14" height="14" />
              
              <!-- Bottom Left Finder Pattern -->
              <rect x="6" y="70" width="24" height="24" fill="none" stroke="currentColor" stroke-width="4" />
              <rect x="11" y="75" width="14" height="14" />

              <!-- QR Data Modules -->
              <rect x="34" y="6" width="6" height="6" />
              <rect x="44" y="6" width="10" height="6" />
              <rect x="58" y="6" width="6" height="6" />
              <rect x="34" y="16" width="10" height="6" />
              <rect x="48" y="16" width="16" height="6" />
              <rect x="6" y="34" width="6" height="6" />
              <rect x="16" y="34" width="10" height="6" />
              <rect x="6" y="44" width="10" height="6" />
              <rect x="20" y="44" width="6" height="6" />
              <rect x="6" y="58" width="6" height="6" />
              <rect x="16" y="58" width="6" height="6" />

              <!-- Center Alignment Block -->
              <rect x="34" y="34" width="32" height="32" fill="none" stroke="currentColor" stroke-width="3" />
              <rect x="42" y="42" width="16" height="16" />

              <rect x="70" y="34" width="6" height="16" />
              <rect x="80" y="34" width="14" height="6" />
              <rect x="70" y="54" width="24" height="6" />
              <rect x="34" y="70" width="6" height="24" />
              <rect x="44" y="70" width="18" height="6" />
              <rect x="44" y="80" width="6" height="14" />
              <rect x="54" y="84" width="8" height="10" />
              <rect x="70" y="70" width="10" height="10" />
              <rect x="84" y="70" width="10" height="6" />
              <rect x="84" y="80" width="10" height="14" />
            </svg>
          </div>

          <!-- Bottom Footer Info inside Card -->
          <div class="space-y-1 text-center w-full border-t border-gray-100 pt-3">
            <p class="text-xs sm:text-sm font-semibold tracking-wider text-gray-500 uppercase">
              SATU QRIS UNTUK SEMUA
            </p>
            <p class="text-[10px] sm:text-xs text-gray-400">
              Cek aplikasi penyelenggara di: <span class="font-medium">www.aspi-qris.id</span>
            </p>
          </div>

          <!-- Dark Brown Triangular Badge in Bottom-Right Corner -->
          <div class="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
            <svg class="w-full h-full text-[#4a3b32]" viewBox="0 0 100 100" fill="currentColor">
              <polygon points="100,0 100,100 0,100" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronUp, ChevronDown } from 'lucide-vue-next';

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false;
});

const categories = [
  {
    id: 'jumat10',
    label: "Jum'at 10",
    text: "Yuk, ikut syiarkan Al-Qur'an hanya dengan 10 Ribu!",
    isELearning: false,
  },
  {
    id: 'operasional',
    label: 'Operasional Dakwah',
    text: 'Untuk penyebaran materi dakwah “Tadabbur 1 Hari 1 Halaman”, infaq yang disumbangkan insyaAllah menjadi amal jariyah yang akan terus mengalir, sepanjang Al-Qur\'an dibaca, ditadabburkan dan diamalkan',
    isELearning: false,
  },
  {
    id: 'elearning',
    label: 'E-Learning',
    text: '',
    isELearning: true,
  },
];

const selectedCategory = ref(categories[0]);

function selectCategory(cat) {
  selectedCategory.value = cat;
  isDropdownOpen.value = false;
}
</script>

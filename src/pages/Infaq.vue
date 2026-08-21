<template>
  <div class="max-w-5xl mx-auto px-3 sm:px-4 py-2 sm:py-6">
    <!-- Navigation Tabs Pill Header (Desktop) -->
    <div class="hidden sm:flex bg-secondary rounded-full p-2 items-center justify-between gap-2 shadow-inner border border-border max-w-3xl mx-auto mb-8 sm:mb-14">
      <!-- Beranda Link -->
      <router-link
        :to="{ name: 'home' }"
        class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-foreground font-bold text-sm sm:text-base hover:bg-card/50 transition-colors cursor-pointer"
      >
        Beranda
      </router-link>

      <!-- Active Infaq & Shodaqoh Tab -->
      <div class="px-6 py-2.5 sm:px-8 sm:py-3 bg-card rounded-full text-primary font-extrabold text-sm sm:text-base shadow-xs border border-border">
        Infaq &amp; Shodaqoh
      </div>

      <!-- Dropdown Selector -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="bg-card px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-card-foreground font-bold text-sm sm:text-base shadow-xs border border-border flex items-center gap-3 cursor-pointer hover:bg-secondary transition-colors"
        >
          <span>{{ selectedCategory.label }}</span>
          <div class="flex flex-col text-foreground -space-y-1">
            <ChevronUp class="w-3.5 h-3.5 stroke-[2.5]" />
            <ChevronDown class="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        <!-- Dropdown Menu Options -->
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-56 bg-popover rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in zoom-in-[0.97] duration-250"
        >
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="selectCategory(cat)"
            :class="[
              selectedCategory.id === cat.id ? 'text-primary font-bold bg-primary/10' : 'text-popover-foreground hover:bg-secondary',
              'w-full text-left px-5 py-3 text-sm sm:text-base transition-colors cursor-pointer min-h-[44px] flex items-center'
            ]"
          >
            {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Category Chips Bar (Mobile) -->
    <div class="sm:hidden mb-6">
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="selectCategory(cat)"
          :class="[
            selectedCategory.id === cat.id
              ? 'bg-primary text-primary-foreground font-bold shadow-md ring-2 ring-primary/20 px-4 py-2.5 rounded-full text-xs text-nowrap transition-all flex-shrink-0 cursor-pointer min-h-[44px] inline-flex items-center'
              : 'bg-card text-card-foreground font-medium hover:bg-secondary border border-border shadow-2xs px-4 py-2.5 rounded-full text-xs text-nowrap transition-all flex-shrink-0 cursor-pointer min-h-[44px] inline-flex items-center'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Main Content Section: Left Text + Right QRIS -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start max-w-4xl mx-auto">
      <!-- Left Column: Dynamic Text & Confirmation Info -->
      <div class="md:col-span-7 text-left space-y-6 sm:space-y-8">
        <!-- Text content for non-elearning categories -->
        <p v-if="!selectedCategory.isELearning" class="text-foreground text-lg sm:text-xl font-medium leading-relaxed">
          {{ selectedCategory.text }}
        </p>

        <!-- Text content for E-Learning with highlighted bank details -->
        <div v-else class="space-y-4 text-foreground text-base sm:text-lg leading-relaxed">
          <p class="text-foreground text-base sm:text-lg leading-relaxed">
            Infaq dan shodaqoh minimal <strong>Rp 50.090</strong> dan maksimal tanpa batas, untuk pengembangan tadabbur online learning berbasis web.
          </p>

          <!-- Dedicated Bank Account Card Container -->
          <div class="bg-primary/5 border border-primary/20 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-primary text-primary-foreground font-black text-xs flex items-center justify-center shadow-2xs">
                  BSI
                </div>
                <span class="font-semibold text-foreground text-sm sm:text-base">Bank Syariah Indonesia</span>
              </div>
              <button
                @click="copyAccount"
                :class="[
                  isCopied
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-primary hover:bg-primary/10 border border-primary/30',
                  'px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]'
                ]"
              >
                <Check v-if="isCopied" class="w-4 h-4" />
                <Copy v-else class="w-4 h-4" />
                <span>{{ isCopied ? 'Tersalin!' : 'Salin No. Rekening' }}</span>
              </button>
            </div>
            <div>
              <div class="font-mono text-xl sm:text-2xl font-extrabold text-primary tracking-wider">
                3779 444 390
              </div>
              <div class="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                a.n Meyrinda Rahmawaty Hilipito QQ KontaQ
              </div>
            </div>
          </div>

          <!-- Kode 90 Alert Banner -->
          <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-normal flex items-start gap-2.5">
            <div class="shrink-0 mt-0.5 text-amber-600 dark:text-amber-400">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <span>Tambahkan <strong>'Kode 90'</strong> diakhir nominal transfer (contoh: Rp 50.090). Bagi yang tidak menambahkan kode tersebut, infaq akan dialokasikan untuk operasional dakwah lainnya.</span>
          </div>
        </div>

        <!-- Confirmation Phone / WhatsApp Line -->
        <div class="pt-2 sm:pt-4">
          <a
            href="https://wa.me/6285345147157"
            target="_blank"
            class="inline-flex items-center gap-3 text-foreground hover:text-primary font-medium text-base sm:text-lg transition-colors group min-h-[44px] py-1"
          >
            <!-- Hand touching phone icon visual -->
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-2xs group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="bg-card p-6 sm:p-7 rounded-3xl shadow-lg border border-border max-w-xs w-full flex flex-col items-center text-center relative overflow-hidden text-card-foreground">
          <!-- QR Code Grid Graphic -->
          <div class="w-full aspect-square bg-white p-3 border border-border rounded-2xl flex items-center justify-center mb-6 shadow-inner">
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
          <div class="space-y-1 text-center w-full border-t border-border pt-3">
            <p class="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              SATU QRIS UNTUK SEMUA
            </p>
            <p class="text-[10px] sm:text-xs text-muted-foreground/80">
              Cek aplikasi penyelenggara di: <span class="font-medium text-foreground">www.aspi-qris.id</span>
            </p>
          </div>

          <!-- Triangular Badge in Bottom-Right Corner -->
          <div class="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
            <svg class="w-full h-full text-primary opacity-80" viewBox="0 0 100 100" fill="currentColor">
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
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-vue-next';

const isDropdownOpen = ref(false);
const dropdownRef = ref(null);

onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false;
});

const isCopied = ref(false);
const accountNumber = '3779444390';

async function copyAccount() {
  try {
    await navigator.clipboard.writeText(accountNumber);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy account number:', err);
  }
}

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

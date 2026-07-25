<template>
  <div class="flex flex-col items-center w-full py-4 text-center">
    <!-- Menu Navigation Items -->
    <div class="w-full flex flex-col gap-4">
      <component
        v-for="item in menuItems"
        :key="item.title"
        :is="item.route ? 'router-link' : 'button'"
        :to="item.route ? { name: item.route } : undefined"
        @click="!item.route && navigateMenu(item)"
        class="group flex items-center justify-between w-full px-6 py-4 rounded-full border-2 border-[#1b4332] hover:border-[#0f291e] bg-white hover:bg-emerald-50/60 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-700/30 text-left"
      >
        <div class="flex items-center gap-4">
          <!-- Orange Sparkle Star Icon -->
          <svg class="w-5 h-5 text-amber-500 fill-amber-500 shrink-0" viewBox="0 0 24 24">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <span class="text-[#144227] font-bold text-lg sm:text-xl tracking-wide">
            {{ item.title }}
          </span>
        </div>
        <!-- Dark Green Right Arrow Chevron -->
        <svg class="w-5 h-5 text-[#144227] group-hover:translate-x-1.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </component>
    </div>

    <!-- Infaq Modal -->
    <div
      v-if="showInfaqModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showInfaqModal = false"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div class="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <QrCode class="w-7 h-7 text-emerald-700" />
        </div>
        <h3 class="text-xl font-bold text-[#144227] mb-2">Infaq & Donasi KontaQ</h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Salurkan infaq terbaik Anda untuk mendukung dakwah & kegiatan Komunitas Tadabbur Al-Qur'an (KontaQ).
        </p>
        <div class="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200/80 mb-6 text-left space-y-2 text-sm text-[#144227]">
          <div class="flex justify-between items-center">
            <span class="font-semibold">Bank Syariah Indonesia (BSI)</span>
          </div>
          <p class="font-mono text-lg font-bold text-emerald-900 tracking-wider">777-888-9990</p>
          <p class="text-xs text-gray-500">a.n. Komunitas Tadabbur Al-Qur'an</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="showInfaqModal = false; showQrisModal = true"
            class="flex-1 py-2.5 px-4 bg-emerald-100 hover:bg-emerald-200 text-[#144227] font-bold rounded-full transition-all duration-150 cursor-pointer text-sm"
          >
            Scan QRIS
          </button>
          <button
            @click="showInfaqModal = false"
            class="flex-1 py-2.5 px-4 bg-[#144227] hover:bg-[#0f321d] text-white font-bold rounded-full shadow transition-all duration-150 cursor-pointer text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- QRIS Modal -->
    <div
      v-if="showQrisModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      @click.self="showQrisModal = false"
    >
      <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        <!-- QRIS Brand Header -->
        <div class="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <span class="font-extrabold tracking-widest text-red-600 text-xl font-mono">QRIS</span>
          <span class="text-[10px] text-gray-400 font-semibold leading-tight text-left">
            NATIONAL<br />STANDARD
          </span>
        </div>

        <!-- Merchant Info -->
        <h3 class="text-base font-bold text-gray-900 mb-0.5">Komunitas Tadabbur Al-Qur'an</h3>
        <p class="text-xs text-emerald-700 font-semibold mb-4">KontaQ Indonesia</p>

        <!-- QR Code Visual Card -->
        <div class="bg-white p-4 rounded-2xl border-2 border-gray-200 shadow-inner flex flex-col items-center justify-center mx-auto mb-4 w-56 h-56 relative">
          <svg class="w-48 h-48 text-gray-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="10" y="10" width="15" height="15" />
            <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="75" y="10" width="15" height="15" />
            <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" stroke-width="4" />
            <rect x="10" y="75" width="15" height="15" />
            <rect x="35" y="5" width="8" height="8" />
            <rect x="48" y="5" width="8" height="8" />
            <rect x="5" y="35" width="8" height="8" />
            <rect x="18" y="35" width="8" height="8" />
            <rect x="35" y="20" width="12" height="8" />
            <rect x="50" y="18" width="8" height="12" />
            <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3" />
            <rect x="42" y="42" width="16" height="16" />
            <rect x="70" y="35" width="8" height="18" />
            <rect x="83" y="35" width="12" height="8" />
            <rect x="70" y="58" width="25" height="8" />
            <rect x="35" y="70" width="8" height="25" />
            <rect x="48" y="70" width="18" height="8" />
            <rect x="70" y="70" width="12" height="12" />
            <rect x="85" y="85" width="10" height="10" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="bg-white px-2 py-0.5 rounded border border-gray-300 shadow-xs text-[10px] font-bold text-gray-800">
              KontaQ
            </div>
          </div>
        </div>

        <!-- NMID & Instructions -->
        <p class="text-[11px] font-mono text-gray-500 mb-1">NMID: ID1023948576201</p>
        <p class="text-xs text-gray-500 mb-5 leading-relaxed">
          Dapat di-scan menggunakan seluruh aplikasi m-Banking & E-Wallet (BSI, BCA, Mandiri, GoPay, OVO, Dana, LinkAja, dll).
        </p>

        <button
          @click="showQrisModal = false"
          class="w-full py-2.5 px-4 bg-[#144227] hover:bg-[#0f321d] text-white font-bold rounded-full shadow transition-all duration-150 cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QrCode } from 'lucide-vue-next';

const router = useRouter();
const showInfaqModal = ref(false);
const showQrisModal = ref(false);

const menuItems = [
  { title: 'Tadabbur', route: 'tadabbur' },
  { title: 'Kuis', route: 'quizzes' },
  { title: 'Evaluasi', route: 'evaluations' },
  { title: 'Rapor', route: 'reports' },
  { title: 'Infaq', action: 'infaq' },
];

function navigateMenu(item) {
  if (item.route) {
    router.push({ name: item.route });
  } else if (item.action === 'infaq') {
    showInfaqModal.value = true;
  }
}
</script>
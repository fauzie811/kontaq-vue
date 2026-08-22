<template>
  <div class="flex flex-col items-center w-full py-2 sm:py-4 text-center">
    <!-- Main Navigation Module List -->
    <div class="w-full flex flex-col gap-2.5 sm:gap-3.5">
      <component
        v-for="item in menuItems"
        :key="item.title"
        :is="item.route ? 'router-link' : 'button'"
        :to="getRouteLocation(item)"
        @click="!item.route && navigateMenu(item)"
        class="group flex items-center justify-between w-full px-4 py-2.5 sm:px-6 sm:py-3.5 border-2 border-border bg-card hover:bg-secondary/50 text-foreground hover:border-primary/40 rounded-full shadow-xs transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-ring active:scale-[0.98] text-left"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Color Accented Icon Container -->
          <div :class="['w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110', item.iconBg]">
            <component :is="item.icon" class="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <span class="text-foreground font-bold text-base sm:text-lg tracking-wide group-hover:text-primary transition-colors">
            {{ item.title }}
          </span>
        </div>

        <!-- Right Chevron Indicator -->
        <ChevronRight class="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1.5 transition-all duration-200 shrink-0 ml-2" />
      </component>
    </div>

    <!-- Infaq Modal -->
    <div
      v-if="showInfaqModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      @click.self="showInfaqModal = false"
    >
      <div class="bg-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-border animate-in fade-in zoom-in-[0.96] duration-250">
        <div class="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <QrCode class="w-7 h-7 text-primary" />
        </div>
        <h3 class="text-xl font-bold text-foreground mb-2">Infaq & Donasi KontaQ</h3>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Salurkan infaq terbaik Anda untuk mendukung dakwah & kegiatan Komunitas Tadabbur Al-Qur'an (KontaQ).
        </p>
        <div class="bg-muted/50 p-4 rounded-2xl border border-border mb-6 text-left space-y-2 text-sm text-foreground">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-foreground">Bank Syariah Indonesia (BSI)</span>
          </div>
          <p class="font-mono text-lg font-bold text-primary tracking-wider">777-888-9990</p>
          <p class="text-xs text-muted-foreground">a.n. Komunitas Tadabbur Al-Qur'an</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="showInfaqModal = false; showQrisModal = true"
            class="flex-1 py-2.5 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-full transition-all duration-150 cursor-pointer text-sm"
          >
            Scan QRIS
          </button>
          <button
            @click="showInfaqModal = false"
            class="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-xs transition-all duration-150 cursor-pointer text-sm"
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
      <div class="bg-card rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-border animate-in fade-in zoom-in-[0.96] duration-250 relative overflow-hidden">
        <!-- QRIS Brand Header -->
        <div class="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-border">
          <span class="font-extrabold tracking-widest text-red-600 text-xl font-mono">QRIS</span>
          <span class="text-xs text-muted-foreground font-semibold leading-tight text-left">
            NATIONAL<br />STANDARD
          </span>
        </div>

        <!-- Merchant Info -->
        <h3 class="text-base font-bold text-foreground mb-0.5">Komunitas Tadabbur Al-Qur'an</h3>
        <p class="text-xs text-primary font-semibold mb-4">KontaQ Indonesia</p>

        <!-- QR Code Visual Card -->
        <div class="bg-white p-4 rounded-2xl border-2 border-border shadow-inner flex flex-col items-center justify-center mx-auto mb-4 w-56 h-56 relative">
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
            <div class="bg-white px-2 py-0.5 rounded border border-gray-300 shadow-xs text-xs font-bold text-gray-800">
              KontaQ
            </div>
          </div>
        </div>

        <!-- NMID & Instructions -->
        <p class="text-xs font-mono text-muted-foreground mb-1">NMID: ID1023948576201</p>
        <p class="text-xs text-muted-foreground mb-5 leading-relaxed">
          Dapat di-scan menggunakan seluruh aplikasi m-Banking & E-Wallet (BSI, BCA, Mandiri, GoPay, OVO, Dana, LinkAja, dll).
        </p>

        <button
          @click="showQrisModal = false"
          class="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow-xs transition-all duration-150 cursor-pointer"
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
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  MessageSquare,
  ChevronRight,
  QrCode,
  HelpCircle,
} from 'lucide-vue-next';

const router = useRouter();
const showInfaqModal = ref(false);
const showQrisModal = ref(false);

const menuItems = [
  {
    title: 'Tadabbur',
    route: 'tadabbur',
    icon: BookOpen,
    iconBg: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60',
  },
  {
    title: 'Kuis',
    route: 'quizzes',
    icon: Brain,
    iconBg: 'bg-amber-100 text-amber-700 border border-amber-200/60',
  },
  {
    title: 'Evaluasi',
    route: 'evaluations',
    icon: ClipboardCheck,
    iconBg: 'bg-teal-100 text-teal-700 border border-teal-200/60',
  },
  {
    title: 'Rapor',
    route: 'reports',
    icon: GraduationCap,
    iconBg: 'bg-indigo-100 text-indigo-700 border border-indigo-200/60',
  },
  {
    title: 'Forum Ukhuwah',
    route: 'forum',
    icon: MessageSquare,
    iconBg: 'bg-sky-100 text-sky-700 border border-sky-200/60',
  },
  {
    title: 'Infaq',
    route: 'infaq',
    icon: HeartHandshake,
    iconBg: 'bg-rose-100 text-rose-700 border border-rose-200/60',
  },
  {
    title: 'Pusat Bantuan',
    route: 'help',
    icon: HelpCircle,
    iconBg: 'bg-violet-100 text-violet-700 border border-violet-200/60',
  },
];

function getRouteLocation(item) {
  if (!item.route) return undefined;
  return {
    name: item.route,
    params: item.params || undefined,
  };
}

function navigateMenu(item) {
  if (item.route) {
    router.push(getRouteLocation(item));
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 relative pb-24">
    <!-- Top Header -->
    <header class="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30 px-4 py-3 sm:px-8">
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left balance spacer -->
        <div class="w-24 hidden sm:block"></div>

        <!-- Center Logo -->
        <router-link :to="{ name: 'home' }" class="flex items-center justify-center mx-auto sm:mx-0">
          <img src="@/assets/logo-kontaq.png" alt="KontaQ" class="h-14 sm:h-16 w-auto object-contain" />
        </router-link>

        <!-- Right Header Icons (Search, Notification, Profile) -->
        <div class="flex items-center gap-3">
          <!-- Search Icon Button -->
          <button
            @click="isSearchOpen = true"
            title="Cari Surah, ayat, tadabbur"
            class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 cursor-pointer"
          >
            <Search class="w-5 h-5 stroke-[2.2]" />
          </button>

          <!-- Notification Bell Button -->
          <div class="relative">
            <button
              @click="isNotificationOpen = !isNotificationOpen"
              title="Notifikasi"
              class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 relative cursor-pointer"
            >
              <Bell class="w-5 h-5 stroke-[2.2]" />
              <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
            </button>

            <!-- Notification Dropdown -->
            <div
              v-if="isNotificationOpen"
              class="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            >
              <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h4 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <Bell class="w-4 h-4 text-emerald-600" />
                  Notifikasi & Pengumuman
                </h4>
                <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  {{ notificationList.length }} Baru
                </span>
              </div>

              <!-- Notifications List -->
              <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto text-sm">
                <div v-if="notificationList.length === 0" class="p-6 text-center text-xs text-gray-500">
                  Tidak ada pengumuman baru.
                </div>
                <div
                  v-for="(notif, idx) in notificationList"
                  :key="idx"
                  @click="clickNotification(notif)"
                  class="p-3.5 hover:bg-emerald-50/50 transition cursor-pointer flex gap-3 items-start"
                >
                  <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Pin v-if="notif.isSticky" class="w-4 h-4 text-emerald-700" />
                    <Bell v-else class="w-4 h-4 text-emerald-700" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-gray-800 text-xs sm:text-sm truncate">{{ notif.title }}</p>
                    <p class="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{{ notif.desc }}</p>
                    <span class="text-[10px] text-emerald-600 font-medium mt-1 block">{{ notif.time }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer Link to Announcements -->
              <router-link
                :to="{ name: 'announcements' }"
                @click="isNotificationOpen = false"
                class="block text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border-t border-emerald-100"
              >
                Lihat Semua Pengumuman &rarr;
              </router-link>
            </div>
          </div>

          <!-- Profile Icon Button -->
          <router-link
            :to="{ name: 'profile' }"
            title="Profil Saya"
            class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100"
          >
            <User class="w-5 h-5 stroke-[2.2]" />
          </router-link>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs Pill Container -->
    <section class="max-w-4xl mx-auto px-4 mt-6 sm:mt-8 w-full">
      <div class="bg-[#ebeee8] rounded-3xl p-3 sm:p-4 shadow-inner flex items-center justify-around gap-2 sm:gap-4 border border-gray-200/60">
        <router-link
          v-for="item in navTabs"
          :key="item.name"
          :to="{ name: item.route }"
          :class="[
            isTabActive(item)
              ? 'bg-white shadow-sm border border-emerald-200 text-emerald-800'
              : 'hover:bg-white/40 text-gray-700',
            'flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-2xl transition group'
          ]"
        >
          <div
            :class="[
              isTabActive(item) ? 'bg-amber-100/90 text-emerald-700' : 'bg-amber-100/70 text-gray-700',
              'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-1 shadow-sm group-hover:scale-105 transition-transform'
            ]"
          >
            <component :is="item.icon" class="w-7 h-7 stroke-[2] text-amber-600" />
          </div>
          <span class="font-bold text-sm sm:text-base">{{ item.name }}</span>
        </router-link>
      </div>
    </section>

    <!-- Main Content Slot -->
    <main class="max-w-6xl mx-auto px-4 mt-8 sm:mt-10 w-full flex-1">
      <slot />
    </main>

    <!-- Bottom Mint Green Banner (DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN) -->
    <footer class="fixed bottom-0 inset-x-0 bg-[#dcfce7] border-t border-emerald-200/80 py-3.5 px-4 z-20 shadow-lg">
      <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <!-- Banner Text -->
        <span class="font-bold text-emerald-900 text-base sm:text-xl tracking-wide text-center sm:text-left">
          DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN
        </span>

        <!-- Infaq Button & QR Code -->
        <div class="flex items-center gap-4">
          <button
            @click="showInfaqModal = true"
            class="bg-[#144227] hover:bg-[#0f321d] text-white px-7 py-2.5 rounded-full font-bold text-base shadow-md transition-transform hover:scale-105 flex items-center gap-2 cursor-pointer"
          >
            <span>Infaq</span>
          </button>

          <!-- Small QR Code Icon / Box -->
          <button
            @click="showQrisModal = true"
            title="Scan QRIS Infaq"
            class="w-9 h-9 bg-white hover:bg-emerald-50 rounded-lg p-1 border border-emerald-300 shadow-sm flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
          >
            <QrCode class="w-7 h-7 text-gray-800" />
          </button>
        </div>
      </div>
    </footer>

    <!-- Search Modal Popup -->
    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-xs"
      @click.self="isSearchOpen = false"
    >
      <div class="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <!-- Search Input Header -->
        <div class="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search class="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari Surah, ayat, tadabbur, bantuan..."
            class="w-full text-base sm:text-lg focus:outline-none text-gray-800 placeholder-gray-400 bg-transparent"
          />
          <button @click="isSearchOpen = false" class="text-gray-400 hover:text-gray-600 text-sm font-semibold px-2 py-1 rounded-md cursor-pointer">
            Tutup
          </button>
        </div>

        <!-- Filter Chips / Shortcuts -->
        <div class="px-4 py-3 bg-gray-50 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 border-t border-gray-100">
          <span class="font-medium text-gray-500">Ketik</span>
          <button @click="searchQuery = '# '" class="px-2 py-1 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 shadow-2xs hover:bg-emerald-50 cursor-pointer">
            #
          </button>
          <span>untuk cari surah,</span>
          <button @click="searchQuery = '@ '" class="px-2 py-1 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 shadow-2xs hover:bg-emerald-50 cursor-pointer">
            @
          </button>
          <span>untuk cari ayat,</span>
          <button @click="searchQuery = '? '" class="px-2 py-1 bg-white rounded border border-gray-200 font-mono font-bold text-emerald-700 shadow-2xs hover:bg-emerald-50 cursor-pointer">
            ?
          </button>
          <span>bantuan</span>
        </div>
      </div>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Search,
  Bell,
  User,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  FileSpreadsheet,
  QrCode,
  Pin,
} from 'lucide-vue-next';
import authStore from '@/store/auth';
import { getUser, listAnnouncements } from '@/api';
import { relativeDate, stripTags } from '@/utils';

const route = useRoute();
const router = useRouter();

if (authStore.isLoggedIn && !authStore.user) {
  getUser();
}

const isSearchOpen = ref(false);
const isNotificationOpen = ref(false);
const showInfaqModal = ref(false);
const showQrisModal = ref(false);
const searchQuery = ref('');

const navTabs = [
  { name: 'Tadabbur', route: 'tadabbur', icon: BookOpen },
  { name: 'Kuis', route: 'quizzes', icon: ClipboardList },
  { name: 'Evaluasi', route: 'evaluations', icon: ClipboardCheck },
  { name: 'Rapor', route: 'reports', icon: FileSpreadsheet },
];

function isTabActive(item) {
  if (!route.name) return false;
  if (item.route === 'tadabbur') {
    return route.name === 'tadabbur' || route.name.startsWith('materials');
  }
  return route.name.startsWith(item.route);
}

const announcements = ref([]);

onMounted(async () => {
  try {
    const res = await listAnnouncements(1);
    if (res && res.data) {
      const items = Array.isArray(res.data) ? res.data : res.data.data || [];
      if (items.length > 0) {
        announcements.value = items;
      }
    }
  } catch (e) {
    console.warn('Could not load announcements for notifications:', e);
  }
});

const notificationList = computed(() => {
  return announcements.value.map((item) => ({
    id: item.id,
    isSticky: !!item.is_sticky,
    title: item.title,
    desc: stripTags(item.content || ''),
    time: item.created_at ? relativeDate(item.created_at) : 'Terbaru',
    route: { name: 'announcements.show', params: { id: item.id } },
  }));
});

function clickNotification(notif) {
  isNotificationOpen.value = false;
  if (notif.action === 'infaq') {
    showInfaqModal.value = true;
  } else if (notif.route) {
    router.push(notif.route);
  }
}
</script>
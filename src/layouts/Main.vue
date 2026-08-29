<template>
  <div
    class="min-h-screen bg-background flex flex-col font-sans text-foreground relative pb-32 sm:pb-24"
  >
    <!-- Top Header -->
    <header
      class="bg-card/90 backdrop-blur-md border-b border-border shadow-2xs sticky top-0 z-30 px-4 py-2.5 sm:px-8 transition-all"
    >
      <div class="max-w-6xl mx-auto flex items-center justify-between">
        <!-- Left Brand Logo -->
        <div class="flex items-center gap-3">
          <router-link
            :to="{ name: 'home' }"
            class="flex items-center gap-2 group"
          >
            <img
              src="@/assets/logo-kontaq.png"
              alt="KontaQ"
              class="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </router-link>
        </div>

        <!-- Right Header Icons (Search, Notification, User Profile) -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Search Icon Button with keyboard shortcut badge -->
          <button
            @click="isSearchOpen = true"
            title="Cari Surah, ayat, tadabbur, bantuan (Ctrl+K)"
            class="h-10 px-3 sm:px-3.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center gap-2 transition shadow-2xs border border-border cursor-pointer active:scale-95"
          >
            <Search class="w-4.5 h-4.5 stroke-[2.2] text-primary" />
            <span
              class="hidden md:inline-block text-xs text-muted-foreground font-medium"
              >Cari...</span
            >
            <kbd
              class="hidden md:inline-flex items-center gap-0.5 text-xs bg-card/80 px-1.5 py-0.5 rounded border border-border text-muted-foreground font-mono font-bold shadow-2xs"
              >⌘K</kbd
            >
          </button>

          <!-- Notification Bell Button -->
          <div ref="notificationMenuRef" class="relative">
            <button
              @click="toggleNotification"
              title="Notifikasi"
              class="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground flex items-center justify-center transition shadow-2xs border border-border relative cursor-pointer active:scale-95"
            >
              <Bell class="w-5 h-5 stroke-[2.2] text-primary" />
              <span
                v-if="notificationList.length > 0"
                class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-card animate-pulse"
              ></span>
            </button>

            <NotificationDrawer
              :is-open="isNotificationOpen"
              :notifications="notificationList"
              @close="isNotificationOpen = false"
              @select="clickNotification"
            />
          </div>

          <!-- User Menu Dropdown Button -->
          <div ref="userMenuRef" class="relative">
            <button
              @click="toggleUserMenu"
              title="Menu Pengguna"
              class="flex items-center gap-2 p-1 sm:pl-1 sm:pr-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition shadow-2xs border border-border cursor-pointer active:scale-95"
            >
              <img
                :src="authStore.user?.avatar_url || defaultAvatar"
                alt="Avatar"
                class="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
              />
              <span
                class="hidden sm:inline-block text-xs font-bold text-foreground max-w-[100px] truncate"
              >
                {{ authStore.user?.name || 'User' }}
              </span>
              <ChevronDown
                class="w-3.5 h-3.5 text-muted-foreground transition-transform hidden sm:inline-block"
                :class="{ 'rotate-180': isUserMenuOpen }"
              />
            </button>

            <!-- User Menu Dropdown Panel -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-xl border border-border z-50 animate-in fade-in zoom-in-[0.97] duration-250 overflow-hidden"
            >
              <!-- User Info Header -->
              <div
                v-if="authStore.user"
                class="px-4 py-3 border-b border-border bg-muted/50 flex items-center gap-3"
              >
                <img
                  :src="authStore.user.avatar_url || defaultAvatar"
                  alt="Avatar"
                  class="w-10 h-10 rounded-full object-cover ring-2 ring-primary/30 shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-foreground text-xs truncate">
                    {{ authStore.user.name }}
                  </p>
                  <p class="text-xs text-muted-foreground truncate">
                    @{{ authStore.user.username || authStore.user.email }}
                  </p>
                </div>
              </div>

              <div class="py-1">
                <router-link
                  :to="{ name: 'profile' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <User class="w-4 h-4 text-primary" />
                  Profil Saya
                </router-link>

                <router-link
                  :to="{ name: 'forum' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <MessageSquare class="w-4 h-4 text-primary" />
                  Forum Ukhuwah
                </router-link>

                <router-link
                  :to="{ name: 'certificates' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <Award class="w-4 h-4 text-primary" />
                  Sertifikat Saya
                </router-link>

                <router-link
                  :to="{ name: 'announcements' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <Bell class="w-4 h-4 text-primary" />
                  Pengumuman
                </router-link>

                <router-link
                  :to="{ name: 'help' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <HelpCircle class="w-4 h-4 text-primary" />
                  Pusat Bantuan / FAQ
                </router-link>

                <a
                  href="https://kontaq.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click="isUserMenuOpen = false"
                  class="flex items-center justify-between px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition group"
                >
                  <div class="flex items-center gap-2.5">
                    <Globe class="w-4 h-4 text-primary" />
                    <span>Website Resmi</span>
                  </div>
                  <ExternalLink class="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <div class="my-1 border-t border-border"></div>

                <router-link
                  :to="{ name: 'logout' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition"
                >
                  <LogOut class="w-4 h-4 text-destructive" />
                  Keluar
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation Tabs Pill Container (Desktop / Tablet) -->
    <section
      v-if="route.name !== 'infaq'"
      class="hidden sm:block max-w-4xl mx-auto px-4 mt-6 sm:mt-8 w-full"
    >
      <div
        class="bg-muted/80 backdrop-blur-sm rounded-3xl p-2.5 sm:p-3 shadow-inner flex items-center justify-around gap-2 sm:gap-3 border border-border/80"
      >
        <router-link
          v-for="item in navTabs"
          :key="item.name"
          :to="{ name: item.route }"
          :class="[
            isTabActive(item)
              ? 'bg-card shadow-sm border border-primary/30 text-primary font-bold'
              : 'hover:bg-card/60 text-muted-foreground hover:text-foreground font-medium',
            'flex-1 flex flex-col items-center justify-center py-2.5 px-3 rounded-2xl transition-all duration-200 group relative overflow-hidden',
          ]"
        >
          <div
            :class="[
              isTabActive(item)
                ? 'bg-primary/10 text-primary'
                : 'bg-secondary text-muted-foreground group-hover:text-foreground',
              'w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-105 transition-all duration-200',
            ]"
          >
            <component
              :is="item.icon"
              class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] text-primary"
            />
          </div>
          <span class="text-xs sm:text-sm tracking-wide">{{ item.name }}</span>
          <!-- Active Tab Indicator Dot -->
          <div
            v-if="isTabActive(item)"
            class="w-1.5 h-1.5 bg-primary rounded-full mt-1 animate-in zoom-in duration-200"
          ></div>
        </router-link>
      </div>
    </section>

    <!-- Main Content Slot -->
    <main
      class="max-w-6xl mx-auto px-4 mt-8 sm:mt-10 w-full flex-1"
    >
      <slot />
    </main>

    <!-- Floating Mint Green Banner (DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN) -->
    <footer
      class="fixed bottom-20 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-4xl bg-secondary border border-primary/20 rounded-full px-5 sm:px-8 py-2.5 sm:py-3 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
    >
      <div class="flex items-center justify-between gap-2 sm:gap-4">
        <!-- Banner Text -->
        <span
          class="font-bold text-secondary-foreground text-xs sm:text-base tracking-wide text-left"
        >
          DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN
        </span>

        <!-- Infaq Button -->
        <div class="flex items-center shrink-0">
          <router-link
            :to="{ name: 'infaq' }"
            class="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <span>Infaq</span>
          </router-link>
        </div>
      </div>
    </footer>

    <!-- Mobile Bottom Navigation Bar -->
    <nav
      v-if="route.name !== 'infaq'"
      class="flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-lg px-2 py-1.5 justify-around items-center pb-safe"
    >
      <router-link
        v-for="item in navTabs"
        :key="item.name"
        :to="{ name: item.route }"
        :class="[
          isTabActive(item)
            ? 'text-primary bg-primary/10 font-bold rounded-2xl'
            : 'text-muted-foreground hover:text-foreground font-medium',
          'flex-1 flex flex-col items-center justify-center py-1.5 px-1 transition text-center active:scale-95',
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            isTabActive(item)
              ? 'text-primary scale-110'
              : 'text-muted-foreground',
            'w-5 h-5 transition-transform mb-0.5',
          ]"
        />
        <span class="text-xs leading-tight">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Search Modal Popup & Mobile Bottom Sheet -->
    <SearchModal
      :is-open="isSearchOpen"
      @close="isSearchOpen = false"
      @select="handleSearchSelect"
    />

    <!-- Infaq Modal -->
    <div
      v-if="showInfaqModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showInfaqModal = false"
    >
      <div
        class="bg-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center border border-border animate-in fade-in zoom-in-[0.96] duration-250"
      >
        <div
          class="w-14 h-14 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner"
        >
          <QrCode class="w-7 h-7 text-primary" />
        </div>
        <h3 class="text-xl font-bold text-foreground mb-2">
          Infaq & Donasi KontaQ
        </h3>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          Salurkan infaq terbaik Anda untuk mendukung dakwah & kegiatan
          Komunitas Tadabbur Al-Qur'an (KontaQ).
        </p>
        <div
          class="bg-muted/50 p-4 rounded-2xl border border-border mb-6 text-left space-y-2 text-sm text-foreground"
        >
          <div class="flex justify-between items-center">
            <span class="font-semibold">Bank Syariah Indonesia (BSI)</span>
          </div>
          <p class="font-mono text-lg font-bold text-primary tracking-wider">
            777-888-9990
          </p>
          <p class="text-xs text-muted-foreground">
            a.n. Komunitas Tadabbur Al-Qur'an
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="
              showInfaqModal = false;
              showQrisModal = true;
            "
            class="flex-1 py-2.5 px-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold rounded-full transition-all duration-150 cursor-pointer text-sm"
          >
            Scan QRIS
          </button>
          <button
            @click="showInfaqModal = false"
            class="flex-1 py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow transition-all duration-150 cursor-pointer text-sm"
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
      <div
        class="bg-card rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-border animate-in fade-in zoom-in-[0.96] duration-250 relative overflow-hidden"
      >
        <!-- QRIS Brand Header -->
        <div
          class="flex items-center justify-center gap-2 mb-4 pb-3 border-b border-border"
        >
          <span
            class="font-extrabold tracking-widest text-red-600 text-xl font-mono"
            >QRIS</span
          >
          <span
            class="text-xs text-muted-foreground font-semibold leading-tight text-left"
          >
            NATIONAL<br />STANDARD
          </span>
        </div>

        <!-- Merchant Info -->
        <h3 class="text-base font-bold text-foreground mb-0.5">
          Komunitas Tadabbur Al-Qur'an
        </h3>
        <p class="text-xs text-primary font-semibold mb-4">KontaQ Indonesia</p>

        <!-- QR Code Visual Card -->
        <div
          class="bg-card p-4 rounded-2xl border-2 border-border shadow-inner flex flex-col items-center justify-center mx-auto mb-4 w-56 h-56 relative"
        >
          <svg
            class="w-48 h-48 text-foreground"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <rect
              x="5"
              y="5"
              width="25"
              height="25"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            />
            <rect x="10" y="10" width="15" height="15" />
            <rect
              x="70"
              y="5"
              width="25"
              height="25"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            />
            <rect x="75" y="10" width="15" height="15" />
            <rect
              x="5"
              y="70"
              width="25"
              height="25"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
            />
            <rect x="10" y="75" width="15" height="15" />
            <rect x="35" y="5" width="8" height="8" />
            <rect x="48" y="5" width="8" height="8" />
            <rect x="5" y="35" width="8" height="8" />
            <rect x="18" y="35" width="8" height="8" />
            <rect x="35" y="20" width="12" height="8" />
            <rect x="50" y="18" width="8" height="12" />
            <rect
              x="35"
              y="35"
              width="30"
              height="30"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
            />
            <rect x="42" y="42" width="16" height="16" />
            <rect x="70" y="35" width="8" height="18" />
            <rect x="83" y="35" width="12" height="8" />
            <rect x="70" y="58" width="25" height="8" />
            <rect x="35" y="70" width="8" height="25" />
            <rect x="48" y="70" width="18" height="8" />
            <rect x="70" y="70" width="12" height="12" />
            <rect x="85" y="85" width="10" height="10" />
          </svg>
          <div
            class="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              class="bg-card px-2 py-0.5 rounded border border-border shadow-xs text-xs font-bold text-foreground"
            >
              KontaQ
            </div>
          </div>
        </div>

        <!-- NMID & Instructions -->
        <p class="text-xs font-mono text-muted-foreground mb-1">
          NMID: ID1023948576201
        </p>
        <p class="text-xs text-muted-foreground mb-5 leading-relaxed">
          Dapat di-scan menggunakan seluruh aplikasi m-Banking & E-Wallet (BSI,
          BCA, Mandiri, GoPay, OVO, Dana, LinkAja, dll).
        </p>

        <button
          @click="showQrisModal = false"
          class="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full shadow transition-all duration-150 cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  BookOpen,
  ClipboardList,
  ClipboardCheck,
  FileSpreadsheet,
  QrCode,
  Pin,
  ChevronDown,
  MessageSquare,
  Award,
  HelpCircle,
  Globe,
  ExternalLink,
} from 'lucide-vue-next';
import NotificationDrawer from '@/components/NotificationDrawer.vue';
import SearchModal from '@/components/SearchModal.vue';
import authStore from '@/store/auth';
import { getUser, listAnnouncements } from '@/api';
import { relativeDate, stripTags } from '@/utils';
import defaultAvatar from '@/assets/images/default-avatar.jpg';

function handleGlobalKeydown(e) {
  const isInputTarget =
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) ||
    document.activeElement?.isContentEditable;
  if (
    (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
    (e.key === '/' && !isInputTarget)
  ) {
    e.preventDefault();
    isSearchOpen.value = !isSearchOpen.value;
  }
}

const route = useRoute();
const router = useRouter();

if (authStore.isLoggedIn && !authStore.user) {
  getUser();
}

const isSearchOpen = ref(false);
const isPushedState = ref(false);

function onPopState() {
  if (isSearchOpen.value) {
    isPushedState.value = false;
    isSearchOpen.value = false;
  }
}
const isNotificationOpen = ref(false);
const isNotificationPushedState = ref(false);

function onNotificationPopState() {
  if (isNotificationOpen.value) {
    isNotificationPushedState.value = false;
    isNotificationOpen.value = false;
  }
}
const isUserMenuOpen = ref(false);
const notificationMenuRef = ref(null);
const userMenuRef = ref(null);

onClickOutside(userMenuRef, () => {
  isUserMenuOpen.value = false;
});

onClickOutside(notificationMenuRef, () => {
  isNotificationOpen.value = false;
});

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) {
    isNotificationOpen.value = false;
  }
}

function toggleNotification() {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (isNotificationOpen.value) {
    isUserMenuOpen.value = false;
  }
}

const showInfaqModal = ref(false);
const showQrisModal = ref(false);

function handleSearchSelect() {
  isPushedState.value = false;
  isSearchOpen.value = false;
}

watch(isSearchOpen, (open) => {
  if (open) {
    isUserMenuOpen.value = false;
    isNotificationOpen.value = false;
    if (typeof window !== 'undefined') {
      window.history.pushState({ searchModal: true }, '');
      isPushedState.value = true;
      window.addEventListener('popstate', onPopState);
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
    }
  } else {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', onPopState);
      if (isPushedState.value) {
        isPushedState.value = false;
        window.history.back();
      }
    }
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('popstate', onNotificationPopState);
    window.removeEventListener('keydown', handleGlobalKeydown);
  }
});

const navTabs = [
  { name: 'Tadabbur', route: 'tadabbur', icon: BookOpen },
  { name: 'Kuis', route: 'quizzes', icon: ClipboardList },
  { name: 'Evaluasi', route: 'evaluations', icon: ClipboardCheck },
  { name: 'Rapor', route: 'reports', icon: FileSpreadsheet },
];

function isTabActive(item) {
  if (!route.name) return false;
  if (item.route === 'tadabbur') {
    return (
      route.name === 'tadabbur' ||
      route.name.startsWith('materials') ||
      route.name.startsWith('quran')
    );
  }
  return route.name.startsWith(item.route);
}

const announcements = ref([]);

onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleGlobalKeydown);
  }
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
    action: item.action,
    route: { name: 'announcements.show', params: { id: item.id } },
  }));
});

function clickNotification(notif) {
  isNotificationPushedState.value = false;
  isNotificationOpen.value = false;
  if (notif.action === 'infaq') {
    router.push({ name: 'infaq' });
  } else if (notif.route) {
    router.push(notif.route);
  }
}
</script>

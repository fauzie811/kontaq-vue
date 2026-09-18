<template>
  <div
    class="min-h-screen bg-background flex flex-col font-sans text-foreground relative pb-32 sm:pb-24"
  >
    <!-- Top Header -->
    <header
      v-if="!isProfile"
      class="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-30 p-4 sm:px-8 transition-all"
    >
      <div class="max-w-6xl mx-auto flex items-center justify-between relative">
        <!-- Brand Logo (centered on desktop for the tadabbur page, per mockup) -->
        <div
          :class="[
            route.name === 'tadabbur' ? 'sm:absolute sm:left-1/2 sm:-translate-x-1/2' : '',
            'flex items-center gap-3',
          ]"
        >
          <router-link
            :to="{ name: 'home' }"
            class="flex items-center gap-2 group"
          >
            <img
              src="@/assets/kontaq-logo-with-text.svg"
              alt="KontaQ"
              class="h-11 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </router-link>
        </div>

        <!-- Desktop header slot (e.g. quiz/evaluation running text) -->
        <div id="header-marquee" class="hidden sm:block flex-1 min-w-0 mx-6 lg:mx-10"></div>

        <!-- Right Header Icons (Search, Notification, User Profile) -->
        <div class="flex items-center gap-2 sm:gap-3 ml-auto">
          <!-- Search Icon Button with keyboard shortcut badge -->
          <button
            @click="isSearchOpen = true"
            title="Cari Surah, ayat, tadabbur, bantuan (Ctrl+K)"
            aria-label="Cari"
            class="w-11 h-11 rounded-full bg-secondary hover:bg-primary/10 text-primary flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Search class="w-6 h-6 stroke-[1.6]" />
          </button>

          <!-- Notification Bell Button -->
          <div ref="notificationMenuRef" class="relative">
            <button
              @click="toggleNotification"
              title="Notifikasi"
              aria-label="Notifikasi"
              class="relative w-11 h-11 rounded-full bg-secondary hover:bg-primary/10 text-primary flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <Bell class="w-6 h-6 stroke-[1.6]" />
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
              aria-label="Menu Pengguna"
              :aria-expanded="isUserMenuOpen"
              class="w-11 h-11 rounded-full bg-secondary hover:bg-primary/10 text-primary flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <CircleUser class="w-6 h-6 stroke-[1.6]" />
            </button>

            <!-- User Menu Dropdown Panel -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-56 max-w-[calc(100vw-2rem)] bg-card rounded-2xl border border-border z-50 animate-in fade-in zoom-in-[0.97] duration-250 overflow-hidden"
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
                  <ForumIcon class="w-4 h-4 text-primary" />
                  Forum Ukhuwah
                </router-link>

                <router-link
                  :to="{ name: 'certificates' }"
                  @click="isUserMenuOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition"
                >
                  <CertificatesIcon class="w-4 h-4 text-primary" />
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
                  <HelpIcon class="w-4 h-4 text-primary" />
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
      v-if="showMainMenu && !isProfile"
      class="hidden sm:block max-w-6xl mx-auto px-4 mt-4 sm:mt-6 w-full"
    >
      <div
        class="bg-muted rounded-[2.5rem] px-4 py-2.5"
      >
          <div class="max-w-4xl mx-auto flex items-start justify-around gap-2">
        <router-link
          v-for="item in navTabs"
          :key="item.name"
          :to="{ name: item.route }"
          class="flex-1 flex flex-col items-center gap-2 group"
        >
          <img
            :src="item.image"
            alt=""
            :class="[
              isTabActive(item) ? 'ring-4 ring-primary/30' : '',
              'w-12 h-12 lg:w-14 lg:h-14 rounded-full transition-transform duration-200 group-hover:scale-105',
            ]"
          />
          <span
            :class="[
              isTabActive(item) ? 'font-bold' : 'font-semibold',
              'text-primary text-xs lg:text-sm leading-tight tracking-wide',
            ]"
          >{{ item.name }}</span>
        </router-link>
          </div>
      </div>
    </section>

    <!-- Main Content Slot -->
    <main
      :class="[isProfile ? '' : 'mt-6 sm:mt-8', 'max-w-6xl mx-auto px-4 w-full flex-1']"
    >
      <slot />
    </main>

    <!-- Fixed bottom stack: full-width infaq banner, then mobile nav -->
    <div v-if="!isProfile" class="fixed bottom-0 inset-x-0 z-40 flex flex-col">
      <!-- Mint Green Banner (DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN) -->
      <footer
        class="w-full bg-linear-90 from-[#E5FCF3] to-[#B1F6DA] dark:bg-secondary border-t border-primary/20 px-4 sm:px-8 py-2 sm:py-2.5"
      >
        <div class="max-w-6xl mx-auto flex items-center justify-between sm:justify-center gap-3 sm:gap-10">
          <!-- Banner Text -->
          <span
            class="font-medium text-primary text-xs sm:text-lg lg:text-xl tracking-tight uppercase text-left"
          >
            DUKUNG PROGRAM TADABBUR 1 HARI 1 HALAMAN
          </span>

          <!-- Infaq Button -->
          <div class="flex items-center shrink-0">
            <router-link
              :to="{ name: 'infaq' }"
              class="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-1.5 rounded-full font-medium text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
            >
              <span>Infaq</span>
            </router-link>
          </div>
        </div>
      </footer>

      <!-- Mobile Bottom Navigation Bar -->
      <nav
        v-if="showMainMenu"
        class="flex sm:hidden bg-card/95 backdrop-blur-md border-t border-border px-2 py-1.5 justify-around items-center pb-safe"
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
          <img
            :src="item.image"
            alt=""
            :class="[
              isTabActive(item) ? 'scale-110' : '',
              'w-7 h-7 rounded-full transition-transform mb-0.5',
            ]"
          />
          <span class="text-xs leading-tight">{{ item.name }}</span>
        </router-link>
      </nav>
    </div>

    <!-- Search Modal Popup & Mobile Bottom Sheet -->
    <SearchModal
      :is-open="isSearchOpen"
      @close="isSearchOpen = false"
      @select="handleSearchSelect"
    />
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
  Pin,
  CircleUser,
  Globe,
  ExternalLink,
} from 'lucide-vue-next';
import { FEATURES } from '@/constants/features';
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

// Feature icons rendered directly in the template (user menu).
const ForumIcon = FEATURES.forum.icon;
const CertificatesIcon = FEATURES.certificates.icon;
const HelpIcon = FEATURES.help.icon;

// Pages with their own navigation hide the tab menu and mobile bottom nav.
const showMainMenu = computed(() => !['infaq', 'quran.show', 'quizzes', 'quizzes.show', 'evaluations', 'evaluations.show', 'reports'].includes(route.name));

// Profile page renders its own header (avatar, hadith, feature nav) per mockup.
const isProfile = computed(() => route.name === 'profile');

const navTabs = [
  { name: 'Tadabbur', route: 'tadabbur', image: FEATURES.tadabbur.image },
  { name: 'Kuis', route: 'quizzes', image: FEATURES.quizzes.image },
  { name: 'Evaluasi', route: 'evaluations', image: FEATURES.evaluations.image },
  { name: 'Rapor', route: 'reports', image: FEATURES.reports.image },
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

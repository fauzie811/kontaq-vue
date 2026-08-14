<template>
  <main class="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-12 bg-background font-sans">
    <!-- Left Hero Section ("The Quranic Sanctuary" - Fixed/Sticky 100vh on Desktop) -->
    <div class="relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 lg:col-span-7 bg-[#1c442d] overflow-hidden text-center py-8 sm:py-10 lg:h-screen lg:sticky lg:top-0 select-none">
      <!-- Background Image & Layered Ambient Gradient -->
      <img class="absolute inset-0 object-cover w-full h-full opacity-40 mix-blend-overlay" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1c442d]/95 via-[#40835c]/90 to-[#12301f]/95"></div>

      <!-- Decorative Subtle Ambient Radial Glow -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg w-full px-2">
        <!-- Profile Avatar Circle -->
        <div class="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/80 shrink-0 group bg-card mb-4 sm:mb-6 transition-all duration-300 hover:ring-amber-300/80">
          <img
            :src="userAvatar"
            alt="Profile"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <!-- Edit Profile Button Overlay -->
          <router-link
            to="/profile"
            class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs sm:text-xs font-semibold rounded-full border border-white/30 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Pencil class="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] text-amber-300" />
            <span>Edit Profil</span>
          </router-link>
        </div>

        <!-- User Welcome Greeting -->
        <div v-if="userName" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold mb-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Ahlan wa Sahlan, {{ userName }}</span>
        </div>

        <!-- Quranic Verse Calligraphy with Dual-Language Line Height -->
        <div class="mb-3 sm:mb-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-300 font-quran leading-[2] sm:leading-[2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] tracking-wide">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-1 text-white text-sm sm:text-base lg:text-lg drop-shadow-sm max-w-md">
          <p class="font-medium leading-relaxed italic text-white/95">"Maka tidakkah mereka mentadaburi Al-Qur'an?"</p>
          <p class="text-amber-200/90 font-semibold text-xs sm:text-sm tracking-wider uppercase">(QS. An-Nisaa' : 82)</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Content Container (Slot - Scrollable on Desktop) -->
    <div class="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 lg:p-10 lg:col-span-5 bg-background justify-center items-center lg:h-screen lg:overflow-y-auto">
      <div class="flex justify-center gap-2 lg:hidden mb-2 sm:mb-3">
        <a href="/" class="flex items-center">
          <img class="w-auto h-12 sm:h-14 object-contain" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </a>
      </div>
      <div class="flex items-center justify-center flex-1 w-full my-auto">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Pencil } from 'lucide-vue-next';
import authStore from '@/store/auth';
import { getUser } from '@/api';
import defaultAvatar from '@/assets/images/default-avatar.jpg';

onMounted(async () => {
  if (authStore.isLoggedIn && !authStore.user) {
    try {
      await getUser();
    } catch (e) {
      console.error(e);
    }
  }
});

const userName = computed(() => {
  return authStore.user?.name || authStore.user?.username || '';
});

const userAvatar = computed(() => {
  return authStore.user?.avatar_url || authStore.user?.avatar || authStore.user?.photo || defaultAvatar;
});
</script>

<template>
  <main class="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-12 bg-background font-sans">
    <!-- Left Hero Section ("The Quranic Sanctuary" - Fixed/Sticky 100vh on Desktop) -->
    <div
      class="relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 lg:col-span-7 bg-[#ebece8] dark:bg-muted border-b lg:border-b-0 lg:border-r border-border overflow-hidden text-center py-8 sm:py-10 lg:h-screen lg:sticky lg:top-0 select-none">
      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg w-full px-2">
        <!-- Profile Avatar Circle -->
        <div
          class="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 rounded-full overflow-hidden ring-4 ring-card shrink-0 group bg-card mb-4 sm:mb-6 transition-all duration-300 hover:ring-accent/60">
          <img :src="userAvatar" alt="Profile"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <!-- Edit Profile Button Overlay -->
          <router-link to="/profile"
            class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs sm:text-xs font-semibold rounded-full border border-white/30 transition-all duration-200 hover:scale-105 active:scale-95">
            <Pencil class="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] text-amber-300" />
            <span>Edit Profil</span>
          </router-link>
        </div>

        <!-- Quranic Verse Calligraphy with Dual-Language Line Height -->
        <div
          class="mb-3 sm:mb-5 text-3xl sm:text-4xl font-bold text-accent font-quran leading-[2] sm:leading-[2] tracking-wide">
          اَفَلَا يَتَدَبَّرُوْنَ الْقُرْاٰنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-1 text-foreground text-sm sm:text-base lg:text-lg">
          <p class="text-lg sm:text-xl font-bold text-primary">"Maka tidakkah mereka mentadaburi Al-Qur'an?"</p>
          <p class="text-primary font-bold">(QS. An-Nisaa' : 82)
          </p>
        </div>
      </div>
    </div>

    <!-- Right Side: Content Container (Slot - Scrollable on Desktop) -->
    <div
      class="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 lg:p-10 lg:col-span-5 bg-card justify-center items-center lg:h-screen lg:overflow-y-auto">

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

const userAvatar = computed(() => {
  return authStore.user?.avatar_url || authStore.user?.avatar || authStore.user?.photo || defaultAvatar;
});
</script>

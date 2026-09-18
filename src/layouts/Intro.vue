<template>
  <main class="grid min-h-svh lg:h-screen lg:overflow-hidden lg:grid-cols-12 bg-background font-sans">
    <!-- Left Hero Section ("The Quranic Sanctuary" - Fixed/Sticky 100vh on Desktop) -->
    <div
      class="relative flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 lg:col-span-7 bg-maingray dark:bg-muted border-b lg:border-b-0 lg:border-r border-border overflow-hidden text-center py-8 sm:py-10 lg:h-screen lg:sticky lg:top-0 select-none">
      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg w-full px-2">
        <!-- Profile Avatar Circle (same look as AvatarUpload on the profile page) -->
        <router-link to="/profile" title="Edit profil"
          class="relative block w-28 h-28 sm:w-36 sm:h-36 lg:w-52 lg:h-52 rounded-full overflow-hidden bg-secondary shrink-0 group mb-4 sm:mb-6">
          <img :src="userAvatar" alt="Profile" class="w-full h-full object-cover grayscale" />
          <span
            class="absolute inset-x-0 bottom-0 pb-3 sm:pb-4 lg:pb-6 pt-6 lg:pt-10 flex items-center justify-center gap-1 bg-gradient-to-t from-black/50 to-transparent text-white text-xs lg:text-sm font-light group-hover:from-black/70 transition-colors">
            <Pencil class="w-3.5 h-3.5" />
            edit profil
          </span>
        </router-link>

        <!-- Quranic Verse Calligraphy with Dual-Language Line Height -->
        <div
          class="mb-3 sm:mb-5 text-3xl sm:text-4xl font-bold text-accent font-quran leading-[2] sm:leading-[2] tracking-wide">
          اَفَلَا يَتَدَبَّرُوْنَ الْقُرْاٰنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-1 text-foreground text-sm sm:text-base lg:text-lg">
          <p class="text-lg sm:text-xl font-bold text-primary">Tidakkah mereka mentadaburi Al-Qur'an?</p>
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

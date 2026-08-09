<template>
  <main class="grid min-h-svh lg:grid-cols-12 font-sans">
    <!-- Left Hero Section -->
    <div class="relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 lg:col-span-7 bg-[#ebece8] overflow-hidden text-center py-6 sm:py-8 lg:min-h-svh">
      <!-- Background Image & Gradient Overlay -->
      <img class="absolute inset-0 object-cover w-full h-full" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-linear-to-br from-primary-1 to-primary-2 opacity-85"></div>

      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg">
        <!-- Profile Avatar Circle -->
        <div class="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/90 shrink-0 group bg-gray-200 mb-3 sm:mb-6">
          <img
            :src="userAvatar"
            alt="Profile"
            class="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
          />
          <!-- Edit Profile Button Overlay -->
          <router-link
            to="/profile"
            class="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold rounded-full border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Pencil class="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span>edit profil</span>
          </router-link>
        </div>

        <!-- Arabic Calligraphy Verse -->
        <div class="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-5xl font-bold text-[#ffd900] font-arabic leading-normal drop-shadow-md">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-0.5 sm:space-y-1 text-white font-bold text-xs sm:text-base lg:text-xl drop-shadow-sm">
          <p>Tidakkah mereka mentadaburi Al-Qur'an?</p>
          <p class="text-white/90">(An-Nisaa' : 82)</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Content Container (Slot) -->
    <div class="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 lg:p-10 lg:col-span-5 bg-white justify-center items-center">
      <div class="flex justify-center gap-2 lg:hidden mb-1 sm:mb-2">
        <a href="/" class="flex items-center">
          <img class="w-auto h-10 sm:h-14" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </a>
      </div>
      <div class="flex items-center justify-center flex-1 w-full">
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

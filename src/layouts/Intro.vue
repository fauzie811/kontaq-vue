<template>
  <main class="grid min-h-svh lg:grid-cols-12 font-sans">
    <!-- Left Hero Section (Same background & gradient as AuthLayout, replacing logo/tagline with Profile Avatar & Verse) -->
    <div class="relative flex flex-col items-center justify-center p-8 lg:p-12 lg:col-span-7 bg-[#ebece8] overflow-hidden text-center min-h-[45vh] lg:min-h-svh">
      <!-- Background Image & Gradient Overlay -->
      <img class="absolute inset-0 object-cover w-full h-full" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-linear-to-br from-primary-1 to-primary-2 opacity-85"></div>

      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg">
        <!-- Profile Avatar Circle -->
        <div class="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/90 shrink-0 group bg-gray-200 mb-6">
          <img
            :src="userAvatar"
            alt="Profile"
            class="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
          />
          <!-- Edit Profile Button Overlay -->
          <router-link
            to="/profile"
            class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Pencil class="w-3.5 h-3.5 stroke-[2.5]" />
            <span>edit profil</span>
          </router-link>
        </div>

        <!-- Arabic Calligraphy Verse -->
        <div class="mb-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-[#ffd900] font-arabic leading-relaxed drop-shadow-md">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-1 text-white font-bold text-base sm:text-lg lg:text-xl drop-shadow-sm">
          <p>Tidakkah mereka mentadaburi Al-Qur'an?</p>
          <p class="text-white/90">(An-Nisaa' : 82)</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Content Container (Slot) -->
    <div class="flex flex-col gap-4 p-6 md:p-10 lg:col-span-5 bg-white justify-center items-center">
      <div class="flex justify-center gap-2 lg:hidden mb-2">
        <a href="/" class="flex items-center">
          <img class="w-auto h-16" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
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

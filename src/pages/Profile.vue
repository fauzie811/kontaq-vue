<script setup>
import { AvatarUpload, ProfileForm } from '@/components/profile';
import { FEATURES } from '@/constants/features';

const navItems = ['tadabbur', 'quizzes', 'evaluations', 'reports'].map((route) => ({
  route,
  label: FEATURES[route].label,
  image: FEATURES[route].image,
}));
</script>

<template>
  <div>
    <!-- Page header replaces the main layout header on this page (per mockup). Full-bleed. -->
    <header class="bg-muted mx-[calc(50%-50vw)] px-4 sm:px-8 py-4">
      <div class="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <AvatarUpload />

        <div class="flex-1 text-center min-w-0">
          <p dir="rtl" lang="ar" class="font-arabic text-accent text-2xl sm:text-3xl leading-relaxed">
            خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
          </p>
          <p class="mt-1 text-primary font-bold text-xs sm:text-sm leading-snug max-w-lg mx-auto">
            Sebaik-baik diantara kalian adalah yang mempelajari al-Quran dan mengajarkannya.
            <br />(HR. Bukhari)
          </p>
        </div>

        <nav class="hidden sm:flex items-start gap-6 lg:gap-10 lg:self-end">
          <router-link
            v-for="item in navItems"
            :key="item.route"
            :to="{ name: item.route }"
            class="flex flex-col items-center gap-1.5 group"
          >
            <img :src="item.image" alt="" class="w-10 h-10 lg:w-12 lg:h-12 rounded-full transition-transform group-hover:scale-105" />
            <span class="text-primary text-xs lg:text-sm font-semibold">{{ item.label }}</span>
          </router-link>
        </nav>
      </div>
    </header>

    <div class="max-w-4xl mx-auto">
    <h2 class="mt-8 sm:mt-10 text-xl sm:text-2xl font-medium tracking-tight uppercase">
      Data Pribadi <span class="text-primary">Sahabat KontaQ</span>
    </h2>

    <div class="mt-6 sm:mt-8">
      <ProfileForm />
    </div>
    </div>
  </div>
</template>

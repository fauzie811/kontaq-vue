<template>
  <div class="flex flex-col items-center w-full py-2 sm:py-4 text-center">
    <!-- Logo & Greetings (Slide 1 & 2 requirements) -->
    <div class="mb-6 lg:mb-10 flex flex-col items-center">
      <a
        href="https://kontaq.org"
        target="_blank"
        rel="noopener noreferrer"
        class="transition-transform hover:scale-105 active:scale-95 inline-block"
      >
        <img class="w-auto h-12 sm:h-14 object-contain" src="@/assets/kontaq-logo-with-text.svg" alt="KontaQ" />
      </a>
    </div>

    <!-- Main Navigation Module List -->
    <div class="w-full flex flex-col gap-2.5 sm:gap-3.5">
      <component
        v-for="item in menuItems"
        :key="item.title"
        :is="item.route ? 'router-link' : 'button'"
        :to="getRouteLocation(item)"
        @click="!item.route && navigateMenu(item)"
        class="group flex items-center justify-between w-full px-4 py-2.5 sm:px-6 sm:py-3.5 border border-primary bg-card hover:bg-primary/5 text-primary rounded-full transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-ring active:scale-[0.98] text-left"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <Sparkle class="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-accent fill-current stroke-0 transition-transform duration-200 group-hover:scale-110" />
          <span class="text-primary font-medium text-lg sm:text-xl tracking-wide">
            {{ item.title }}
          </span>
        </div>

        <!-- Right Chevron Indicator -->
        <ChevronRight class="w-5 h-5 text-primary group-hover:translate-x-1.5 transition-all duration-200 shrink-0 ml-2" />
      </component>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ChevronRight, Sparkle } from 'lucide-vue-next';

const router = useRouter();

const menuItems = [
  {
    title: 'Tadabbur',
    route: 'tadabbur',
  },
  {
    title: 'Kuis',
    route: 'quizzes',
  },
  {
    title: 'Evaluasi',
    route: 'evaluations',
  },
  {
    title: 'Rapor',
    route: 'reports',
  },
  {
    title: 'Infaq',
    route: 'infaq',
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

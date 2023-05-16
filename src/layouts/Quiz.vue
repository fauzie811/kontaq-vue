<template>
  <div class="min-h-full bg-gray-100">
    <div
      class="sticky top-0 z-40 flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm shrink-0 gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
      <img class="w-auto h-12" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />

      <div class="flex self-stretch flex-1 gap-x-4 lg:gap-x-6">
        <div class="flex-1"></div>
        <div class="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span class="sr-only">View notifications</span>
            <BellIcon class="w-6 h-6" aria-hidden="true" />
          </button>

          <!-- Separator -->
          <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          <UserMenu />
        </div>
      </div>
    </div>

    <main class="py-10">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import UserMenu from '@/components/UserMenu.vue';
import { BellIcon } from '@heroicons/vue/24/outline'
import authStore from '@/store/auth';
import { getUser } from '@/api';

if (authStore.isLoggedIn && !authStore.user) {
  getUser();
}
</script>
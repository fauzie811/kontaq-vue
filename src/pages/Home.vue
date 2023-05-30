<template>
  <div class="grid gap-5 lg:grid-cols-3">
    <div class="col-span-full">
      <section aria-labelledby="profile-overview-title">
        <div class="overflow-hidden bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5">
          <h2 class="sr-only" id="profile-overview-title">Profile Overview</h2>
          <div class="p-6 bg-white">
            <div class="sm:flex sm:items-center sm:justify-between">
              <div class="sm:flex sm:space-x-5">
                <div class="flex-shrink-0">
                  <img class="w-20 h-20 mx-auto rounded-full"
                    :src="'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + (authStore.user ? authStore.user.name : '')"
                    alt="" />
                </div>
                <div class="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                  <p class="text-sm font-medium text-gray-600">Assalamu'alaikum,</p>
                  <p class="text-xl font-bold text-gray-900 sm:text-2xl">{{ authStore.user ? authStore.user.name : '...'
                  }}
                  </p>
                  <p class="text-sm font-medium text-gray-500">{{ authStore.user ? authStore.user.username : '' }}</p>
                </div>
              </div>
              <div class="flex justify-center mt-5 sm:mt-0">
                <router-link to="/profile"
                  class="flex items-center justify-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Lihat
                  profil</router-link>
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-1 border-t border-gray-200 divide-y divide-gray-200 bg-gray-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div v-for="stat in stats" :key="stat.label" class="px-6 py-5 text-sm font-medium text-center">
              <span class="text-gray-900">{{ stat.value }}</span>
              {{ ' ' }}
              <span class="text-gray-600">{{ stat.label }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="col-span-full">
      <Announcements />
    </div>
  </div>
</template>

<script setup>
import authStore from '@/store/auth';
import Announcements from '@/widgets/Announcements.vue';

const stats = [
  // { label: 'Vacation days left', value: 12 },
  // { label: 'Sick days left', value: 4 },
  // { label: 'Personal days left', value: 2 },
]
</script>
<template>
  <div class="bg-gray-100">
    <div class="top-bar"></div>
    <header class="site-header">
      <div class="container relative z-10">
        <div class="flex items-start py-6">
          <router-link :to="{ name: 'home' }" class="mr-auto">
            <img class="w-auto h-24" src="../assets/logo.png" alt="">
          </router-link>

          <OnlineStatus class="mr-8" />

          <UserMenu />
        </div>
        <nav class="mt-1 mb-6 bg-[#333] border-b-[6px] border-[#ffd900]">
          <ul class="flex">
            <li class="flex-auto" v-for="item in navigation" :key="item.name">
              <router-link :to="{ name: item.route }"
                :class="[$route.name.startsWith(item.route) ? 'bg-[#222] text-[#ffd900]' : 'hover:bg-[#222] text-white hover:text-[#ffd900]', 'group text-center px-2 py-3 text-sm block font-medium transition']">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <main class="relative">
      <div class="container">
        <slot />
      </div>
    </main>
    <footer class="mt-8 bg-[#1b1b1b] py-6 text-gray-300 text-sm">
      <div class="container">
        <p>Copyright &copy; 2023 KontaQ. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import authStore from '@/store/auth';
import { getUser } from '@/api';
import UserMenu from '@/components/UserMenu.vue';
import OnlineStatus from '@/components/OnlineStatus.vue';

if (authStore.isLoggedIn && !authStore.user) {
  getUser();
}

const navigation = [
  { name: 'Beranda', route: 'home' },
  { name: 'Forum Ukhuwah', route: 'forum' },
  { name: 'Materi Tadabbur', route: 'materials' },
  { name: 'Kuis', route: 'quizzes' },
  { name: 'Evaluasi', route: 'evaluations' },
  { name: 'Rapor', route: 'reports' },
  { name: 'Sertifikat', route: 'certificates' },
  { name: 'Pengumuman', route: 'announcements' },
]

</script>

<style scoped>
.top-bar {
  background: url(../assets/images/top.png) repeat-x;
  height: 6px;
}

.site-header {
  background: url(../assets/images/bg.png) repeat-x;
  position: relative;
}

.site-header::before {
  background: url(../assets/images/top-left.png) no-repeat;
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 323px;
  height: 165px;
}

.site-header::after {
  background: url(../assets/images/top-right.png) no-repeat;
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 262px;
  height: 165px;
}
</style>
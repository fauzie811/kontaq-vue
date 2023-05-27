<template>
  <div class="flex items-center justify-center h-full">
    <p>Please wait...</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { logout } from '@/api';

const router = useRouter();

async function doLogout() {
  await logout();

  router.push('/login');
}
doLogout();
</script>
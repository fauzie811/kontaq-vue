<template>
  <div class="flex items-center gap-x-2">
    <div v-if="onlineUsers === null" class="relative flex flex-none w-2 h-2">
      <div class="absolute w-full h-full bg-gray-400 rounded-full opacity-75 animate-ping" />
      <div class="absolute w-2 h-2 bg-gray-500 rounded-full" />
    </div>
    <div v-else class="relative flex flex-none w-2 h-2">
      <div class="absolute w-full h-full rounded-full opacity-75 bg-emerald-400 animate-ping" />
      <div class="absolute w-2 h-2 rounded-full bg-emerald-500" />
    </div>
    <TextPlaceholder v-if="onlineUsers === null" class="text-xs leading-5" />
    <p v-else class="text-xs leading-5 text-gray-500">{{ onlineUsers }} user online</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getOnlineStatus } from '@/api';
import TextPlaceholder from './placeholders/TextPlaceholder.vue';

const onlineUsers = ref(null);

const loadData = async () => {
  const data = await getOnlineStatus();
  onlineUsers.value = data.data;
}
loadData();

setInterval(() => loadData(), 15000);
</script>
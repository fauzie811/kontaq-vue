<template>
  <div>
    <Breadcrumbs class="mb-4" :pages="breadcrumbs" />
    <PageHeader class="mb-8" page-title="Forum Perkenalan" />

    <div class="mb-4 overflow-hidden bg-white rounded-lg shadow">
      <div class="flex items-start px-4 py-5 space-x-4 sm:p-6">
        <div class="flex-shrink-0">
          <img class="inline-block w-10 h-10 rounded-full"
            :src="'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + (authStore.user ? authStore.user.name : '')"
            alt="" />
        </div>
        <div class="flex-1 min-w-0">
          <form @submit.prevent="sendPost" class="relative">
            <div
              class="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-600">
              <textarea v-model="newPost.message" rows="2" name="comment" id="comment"
                class="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Tuliskan pesan Anda di sini..." />

              <!-- Spacer element to match the height of the toolbar -->
              <div class="py-2" aria-hidden="true">
                <!-- Matches height of button in toolbar (1px border + 36px content height) -->
                <div class="py-px">
                  <div class="h-9" />
                </div>
              </div>
            </div>

            <div class="absolute inset-x-0 bottom-0 flex py-2 pl-3 pr-2">
              <div class="flex-shrink-0 ml-auto">
                <button type="submit"
                  class="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">Kirim
                  Pesan</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="overflow-hidden bg-white rounded-md shadow">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="forumPost in forumPosts.data" :key="forumPost.id" class="flex px-6 py-4">
          <div class="flex-shrink-0 mr-4">
            <img class="block w-10 h-10 rounded-full"
              :src="'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + (forumPost.user ? forumPost.user.name : '')"
              alt="" />
          </div>
          <div>
            <p class="text-sm font-semibold">{{ forumPost.user ? forumPost.user.name : '[user dihapus]' }}</p>
            <div class="mt-1 text-sm prose">
              <p>{{ forumPost.message }}</p>
            </div>
          </div>
        </li>
      </ul>
      <Pagination :meta="forumPosts" v-on:change="changePage" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import authStore from '@/store/auth';
import { listForumPosts, storeForumPost } from '@/api';
import { shortDate } from '@/utils';
import PageHeader from '../components/PageHeader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import Pagination from '@/components/Pagination.vue';

const breadcrumbs = ref([
  { name: 'Forum Perkenalan', route: '/forum', current: true },
]);
const page = ref(1);
const forumPosts = ref({ data: [] });
const newPost = ref({ message: null });

const loadData = async () => {
  const data = await listForumPosts({ page: page.value });
  forumPosts.value = data.data;
};
loadData();

const changePage = (p) => {
  page.value = p;
  loadData();
};

const sendPost = async () => {
  if (!newPost.value.message) return;
  const data = await storeForumPost({ message: newPost.value.message });
  forumPosts.value = {
    ...forumPosts.value,
    data: [
      data.data,
      ...forumPosts.value.data
    ]
  };
  newPost.value = { message: null };
};
</script>
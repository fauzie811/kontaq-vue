<template>
  <!-- Profile dropdown -->
  <Menu as="div" class="relative">
    <MenuButton class="-m-1.5 flex items-center p-1.5">
      <span class="sr-only">Open user menu</span>
      <img class="w-8 h-8 rounded-full bg-gray-50"
        :src="'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=' + (authStore.user ? authStore.user.name : '')"
        alt="" />
      <span class="hidden lg:flex lg:items-center">
        <span class="flex flex-col items-start justify-center ml-4">
          <span class="text-sm font-medium text-gray-900" aria-hidden="true">{{ authStore.user ?
            authStore.user.name : '...'
          }}</span>
          <span class="text-xs text-gray-500" aria-hidden="true">{{ authStore.user ?
            authStore.user.username : ''
          }}</span>
        </span>
        <ChevronDownIcon class="w-5 h-5 ml-2 text-gray-400" aria-hidden="true" />
      </span>
    </MenuButton>
    <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <MenuItems
        class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
        <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
        <div v-if="item.separator" class="w-full h-px my-1 bg-gray-200"></div>
        <a v-else :href="item.href"
          :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">{{ item.name
          }}</a>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import authStore from '@/store/auth';

const userNavigation = [
  { name: 'Profil saya', href: '#' },
  { separator: true },
  { name: 'Keluar', href: '#' },
]
</script>
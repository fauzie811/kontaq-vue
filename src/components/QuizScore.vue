<template>
  <div class="flex items-center justify-center">
    <Menu v-if="score === undefined || score === null || score === 'i' || score === 'n'" as="div"
      class="relative inline-block text-left">
      <div>
        <MenuButton class="flex items-center text-red-600">
          <XMarkIcon class="w-6 h-6" aria-hidden="true" />
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems
          class="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="py-1">
            <MenuItem v-if="score !== undefined && score !== null" v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Tidak
              ada kabar</a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
            <a href="#"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Izin</a>
            </MenuItem>
            <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">SK
              Baru</a>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    <span v-else>{{ score }}</span>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ score: undefined });
</script>
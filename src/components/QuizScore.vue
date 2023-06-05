<template>
  <div class="flex items-center justify-center">
    <Menu v-if="score === undefined || score === null || score === 'i' || score === 'n'" as="div"
      class="relative inline-block text-left">
      <div>
        <MenuButton class="flex items-center">
          <InformationCircleIcon title="Izin" v-if="score === 'i'" class="w-6 h-6 text-blue-600" aria-hidden="true" />
          <SparklesIcon title="SK Baru" v-else-if="score === 'n'" class="w-6 h-6 text-yellow-600" aria-hidden="true" />
          <XMarkIcon title="Tidak ada kabar" v-else class="w-6 h-6 text-red-600" aria-hidden="true" />
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems
          class="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div class="py-1">
            <MenuItem v-if="score !== undefined && score !== null" v-slot="{ active }">
            <button @click="() => emit('update-score', null)"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm']">Tidak
              ada kabar</button>
            </MenuItem>
            <MenuItem v-if="score != 'i'" v-slot="{ active }">
            <button @click="() => emit('update-score', 'i')"
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm']">Izin</button>
            </MenuItem>
            <MenuItem v-if="score != 'n'" v-slot="{ active }" @click="() => emit('update-score', 'n')">
            <button
              :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block w-full text-left px-4 py-2 text-sm']">SK
              Baru</button>
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
import { XMarkIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ score: undefined });
const emit = defineEmits(['update-score']);
</script>
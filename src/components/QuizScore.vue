<template>
  <div class="flex items-center justify-center">
    <Menu v-if="score === undefined || score === null || score === 'i' || score === 'n'" as="div"
      class="relative inline-block text-left">
      <div>
        <MenuButton
          class="flex items-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          :aria-label="menuAriaLabel">
          <InformationCircleIcon title="Izin" v-if="score === 'i'" class="w-6 h-6 text-blue-600" aria-hidden="true" />
          <SparklesIcon title="SK Baru" v-else-if="score === 'n'" class="w-6 h-6 text-warning-600" aria-hidden="true" />
          <XMarkIcon title="Tidak ada kabar" v-else class="w-6 h-6 text-danger-600" aria-hidden="true" />
        </MenuButton>
      </div>

      <transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <MenuItems
          class="absolute right-0 z-10 w-40 mt-2 origin-top-right rounded-xl border border-border bg-popover py-1 shadow-lg focus:outline-none">
          <div class="mx-1">
            <MenuItem v-if="score !== undefined && score !== null" v-slot="{ active }">
            <button @click="() => emit('update-score', null)"
              :class="[active ? 'bg-secondary text-secondary-foreground' : 'text-popover-foreground', 'block w-full rounded-lg text-left px-3 py-2 text-sm transition-colors cursor-pointer']">Tidak
              ada kabar</button>
            </MenuItem>
            <MenuItem v-if="score != 'i'" v-slot="{ active }">
            <button @click="() => emit('update-score', 'i')"
              :class="[active ? 'bg-secondary text-secondary-foreground' : 'text-popover-foreground', 'block w-full rounded-lg text-left px-3 py-2 text-sm transition-colors cursor-pointer']">Izin</button>
            </MenuItem>
            <MenuItem v-if="score != 'n'" v-slot="{ active }" @click="() => emit('update-score', 'n')">
            <button
              :class="[active ? 'bg-secondary text-secondary-foreground' : 'text-popover-foreground', 'block w-full rounded-lg text-left px-3 py-2 text-sm transition-colors cursor-pointer']">SK
              Baru</button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
    <span v-else :class="score == 100 ? 'font-bold text-success-600' : 'font-medium text-foreground'">{{ score }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { XMarkIcon, InformationCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const props = defineProps({ score: undefined });
const emit = defineEmits(['update-score']);

const menuAriaLabel = computed(() =>
  props.score === 'i' ? 'Izin' : props.score === 'n' ? 'SK Baru' : 'Tidak ada kabar');
</script>

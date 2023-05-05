<template>
  <div>
    <PageHeader page-title="Kuis" />

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="project in projects" :key="project.id" class="flex items-center justify-between py-4 gap-x-6">
        <div class="min-w-0">
          <div class="flex items-start gap-x-3">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ project.name }}</p>
            <p
              :class="[statuses[project.status], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
              {{ project.status }}</p>
          </div>
          <div class="flex items-center text-xs leading-5 text-gray-500 gap-x-2">
            <p class="whitespace-nowrap">
              {{ project.duration }} menit
            </p>
          </div>
        </div>
        <div class="flex items-center flex-none gap-x-4">
          <router-link :to="{ name: 'quizzes.show', params: { id: project.id } }"
            class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">Mulai</router-link>
          <Menu as="div" class="relative flex-none">
            <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
              <span class="sr-only">Open options</span>
              <EllipsisVerticalIcon class="w-5 h-5" aria-hidden="true" />
            </MenuButton>
            <transition enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <MenuItems
                class="absolute right-0 z-10 w-32 py-2 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                <a href="#"
                  :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Edit<span
                    class="sr-only">, {{ project.name }}</span></a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <a href="#"
                  :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Move<span
                    class="sr-only">, {{ project.name }}</span></a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                <a href="#"
                  :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">Delete<span
                    class="sr-only">, {{ project.name }}</span></a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import PageHeader from '../components/PageHeader.vue';

const statuses = {
  Complete: 'text-green-700 bg-green-50 ring-green-600/20',
  'In progress': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Archived: 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
}
const projects = [
  {
    id: 1,
    name: 'GraphQL API',
    href: '#',
    status: 'Complete',
    duration: 60,
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'In progress',
    duration: 60,
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Archived',
    duration: 60,
  },
]
</script>
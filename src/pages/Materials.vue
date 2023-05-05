<template>
  <div>
    <PageHeader page-title="Materi Tadabbur">
      <!-- <button type="button"
        class="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Edit</button>
      <button type="button"
        class="inline-flex items-center px-3 py-2 ml-3 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Publish</button> -->
    </PageHeader>

    <ul role="list" class="mt-8 divide-y divide-gray-100">
      <li v-for="project in projects" :key="project.id" class="flex items-center justify-between py-5 gap-x-6">
        <div class="min-w-0">
          <div class="flex items-start gap-x-3">
            <p class="text-sm font-semibold leading-6 text-gray-900">{{ project.name }}</p>
            <p
              :class="[statuses[project.status], 'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset']">
              {{ project.status }}</p>
          </div>
          <div class="flex items-center mt-1 text-xs leading-5 text-gray-500 gap-x-2">
            <p class="whitespace-nowrap">
              Due on <time :datetime="project.dueDateTime">{{ project.dueDate }}</time>
            </p>
            <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
              <circle cx="1" cy="1" r="1" />
            </svg>
            <p class="truncate">Created by {{ project.createdBy }}</p>
          </div>
        </div>
        <div class="flex items-center flex-none gap-x-4">
          <a :href="project.href"
            class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">View
            project<span class="sr-only">, {{ project.name }}</span></a>
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
    createdBy: 'Leslie Alexander',
    dueDate: 'March 17, 2023',
    dueDateTime: '2023-03-17T00:00Z',
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'In progress',
    createdBy: 'Leslie Alexander',
    dueDate: 'May 5, 2023',
    dueDateTime: '2023-05-05T00:00Z',
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'In progress',
    createdBy: 'Courtney Henry',
    dueDate: 'May 25, 2023',
    dueDateTime: '2023-05-25T00:00Z',
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'In progress',
    createdBy: 'Leonard Krasner',
    dueDate: 'June 7, 2023',
    dueDateTime: '2023-06-07T00:00Z',
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Archived',
    createdBy: 'Courtney Henry',
    dueDate: 'June 10, 2023',
    dueDateTime: '2023-06-10T00:00Z',
  },
]
</script>
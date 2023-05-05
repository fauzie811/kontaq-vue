<template>
  <div class="flex flex-col px-6 pb-4 overflow-y-auto bg-white grow gap-y-5">
    <div class="flex items-center h-16 shrink-0">
      <!-- <img class="w-auto h-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> -->
      <img class="w-auto h-12" src="../assets/logo.png" alt="Your Company" />
    </div>
    <nav class="flex flex-col flex-1">
      <ul role="list" class="flex flex-col flex-1 gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <router-link :to="{ name: item.route }"
                :class="[$route.name == item.route ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium']">
                <component :is="item.icon"
                  :class="[$route.name == item.route ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <!-- <li>
          <div class="text-xs font-medium leading-6 text-gray-400">Your teams</div>
          <ul role="list" class="mt-2 -mx-2 space-y-1">
            <li v-for="team in teams" :key="team.name">
              <a :href="team.href"
                :class="[team.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium']">
                <span
                  :class="[team.current ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white']">{{
                    team.initial }}</span>
                <span class="truncate">{{ team.name }}</span>
              </a>
            </li>
          </ul>
        </li> -->
        <li class="mt-auto">
          <a href="#"
            class="flex p-2 -mx-2 text-sm font-medium leading-6 text-gray-700 rounded-md group gap-x-3 hover:bg-gray-50 hover:text-indigo-600">
            <Cog6ToothIcon class="w-6 h-6 text-gray-400 shrink-0 group-hover:text-indigo-600" aria-hidden="true" />
            Settings
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  ChartBarSquareIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  InformationCircleIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Beranda', route: 'home', icon: HomeIcon },
  { name: 'Materi Tadabbur', route: 'materials', icon: FolderIcon },
  { name: 'Kuis', route: 'quizzes', icon: QuestionMarkCircleIcon },
  { name: 'Evaluasi', route: 'evaluations', icon: ClipboardDocumentCheckIcon },
  { name: 'Rapor', route: 'reports', icon: DocumentChartBarIcon },
  { name: 'Sertifikat', route: 'certificates', icon: DocumentCheckIcon },
  { name: 'Pengumuman', route: 'announcements', icon: MegaphoneIcon },
]
const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: false },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: false },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]
</script>
<template>
  <div class="flex flex-col overflow-y-auto bg-gradient-to-r from-primary-1 to-primary-2 grow">
    <div class="flex flex-col items-center py-4 text-center border-b border-white shadow-md shrink-0">
      <div class="px-6 py-3 bg-white rounded-full">
        <img class="w-auto h-14" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>
      <img class="w-auto h-8 mt-3 invert brightness-0" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
    </div>
    <nav class="flex flex-col flex-1 px-6 py-4">
      <ul role="list" class="flex flex-col flex-1 gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <router-link :to="{ name: item.route }"
                :class="[$route.name.startsWith(item.route) ? 'bg-lime-700 text-white' : 'text-white/80 hover:text-white hover:bg-lime-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition']">
                <component :is="item.icon"
                  :class="[$route.name == item.route ? 'text-white' : 'text-white/80 group-hover:text-white', 'h-6 w-6 shrink-0']"
                  aria-hidden="true" />
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </li>
        <!-- <li class="mt-auto">
          <a href="#"
            class="flex p-2 -mx-2 text-sm font-medium leading-6 rounded-md 80xt-white/50 group gap-x-3 hover:bg-lime-700 hover:text-white">
            <Cog6ToothIcon class="w-6 h-6 text-white/80 shrink-0 group-hover:text-white" aria-hidden="true" />
            Settings
          </a>
        </li> -->
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
  ChatBubbleLeftRightIcon,
} from '@heroicons/vue/24/outline'

const navigation = [
  { name: 'Beranda', route: 'home', icon: HomeIcon },
  { name: 'Forum Ukhuwah', route: 'forum', icon: ChatBubbleLeftRightIcon },
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
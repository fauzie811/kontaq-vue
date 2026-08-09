<template>
  <div class="flex flex-col overflow-y-auto bg-card border-r border-border grow">
    <div class="flex flex-col items-center py-4 text-center border-b border-border shadow-xs shrink-0">
      <div class="px-6 py-3 bg-muted rounded-full">
        <img class="w-auto h-14" src="@/assets/logo-kontaq.png" alt="Komunitas Tadabbur Al-Qur'an" />
      </div>
      <img class="w-auto h-8 mt-3 invert dark:invert-0 opacity-90" src="@/assets/tagline.png" alt="Komunitas Tadabbur Al-Qur'an" />
    </div>
    <nav class="flex flex-col flex-1 px-4 py-4">
      <ul role="list" class="flex flex-col flex-1 gap-y-7">
        <li>
          <ul role="list" class="space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <router-link :to="{ name: item.route }"
                :class="[$route.name.startsWith(item.route) ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground hover:bg-accent', 'group flex gap-x-3 rounded-xl p-2.5 text-sm leading-6 font-medium transition']">
                <component :is="item.icon"
                  :class="[$route.name.startsWith(item.route) ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground', 'h-5 w-5 shrink-0']"
                  aria-hidden="true" />
                {{ item.name }}
              </router-link>
            </li>
          </ul>
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
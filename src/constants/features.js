import {
  Award,
  BookOpen,
  Brain,
  ClipboardCheck,
  FileClock,
  FolderOpen,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Home,
  Megaphone,
  MessageSquare,
} from 'lucide-vue-next';
import menuTadabbur from '@/assets/menu-tadabbur.png';
import menuKuis from '@/assets/menu-kuis.png';
import menuEvaluasi from '@/assets/menu-evaluasi.png';
import menuRapor from '@/assets/menu-rapor.png';

/**
 * Single source of truth for how each feature is represented in the UI.
 *
 * Keyed by router route name. Every surface that points at a feature (home
 * menu, nav tabs, bottom bar, user menu, page headers, empty states, status
 * chips) must read its icon from here instead of importing a lucide icon
 * directly, so one feature never shows two different icons.
 *
 * `image` is the illustrated menu icon (PNG) for main-menu features.
 *
 * `accent` is the chip/avatar class set used when the icon sits inside a
 * colored container. Each feature owns a distinct hue.
 */
export const FEATURES = {
  home: {
    label: 'Beranda',
    icon: Home,
    accent: 'bg-primary/10 text-primary border border-primary/20',
  },
  tadabbur: {
    label: 'Tadabbur',
    image: menuTadabbur,
    icon: BookOpen,
    accent: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60',
  },
  materials: {
    label: 'Materi Tadabbur',
    icon: FolderOpen,
    accent: 'bg-cyan-100 text-cyan-700 border border-cyan-200/60',
  },
  quizzes: {
    label: 'Kuis',
    image: menuKuis,
    icon: Brain,
    accent: 'bg-amber-100 text-amber-700 border border-amber-200/60',
  },
  evaluations: {
    label: 'Evaluasi',
    image: menuEvaluasi,
    icon: ClipboardCheck,
    accent: 'bg-teal-100 text-teal-700 border border-teal-200/60',
  },
  reports: {
    label: 'Rapor',
    image: menuRapor,
    icon: GraduationCap,
    accent: 'bg-indigo-100 text-indigo-700 border border-indigo-200/60',
  },
  certificates: {
    label: 'Sertifikat',
    icon: Award,
    accent: 'bg-yellow-100 text-yellow-700 border border-yellow-200/60',
  },
  forum: {
    label: 'Forum Ukhuwah',
    icon: MessageSquare,
    accent: 'bg-sky-100 text-sky-700 border border-sky-200/60',
  },
  infaq: {
    label: 'Infaq',
    icon: HeartHandshake,
    accent: 'bg-rose-100 text-rose-700 border border-rose-200/60',
  },
  announcements: {
    label: 'Pengumuman',
    icon: Megaphone,
    accent: 'bg-orange-100 text-orange-700 border border-orange-200/60',
  },
  'late-permissions': {
    label: 'Izin Telat',
    icon: FileClock,
    accent: 'bg-slate-100 text-slate-700 border border-slate-200/60',
  },
  help: {
    label: 'Pusat Bantuan',
    icon: HelpCircle,
    accent: 'bg-violet-100 text-violet-700 border border-violet-200/60',
  },
};

/** Icon component for a feature route name. */
export function featureIcon(route) {
  return FEATURES[route]?.icon;
}

/** Accent chip classes for a feature route name. */
export function featureAccent(route) {
  return FEATURES[route]?.accent;
}

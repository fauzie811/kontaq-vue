# Intro Mobile Optimization & Menu Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Intro page layout mobile friendly so it fits cleanly on single mobile viewports without vertical overflow, and update menu item icons to color-accented Lucide icons.

**Architecture:** Update `src/layouts/Intro.vue` responsive styles for mobile devices (avatar size, verse calligraphy size, vertical padding, logo size) and modify `src/pages/Home.vue` button layout and Lucide icon components with color-accented background pills.

**Tech Stack:** Vue 3, Tailwind CSS v4, Lucide Vue Next (`lucide-vue-next`), Vite.

## Global Constraints

- Retain desktop (`lg:col-span-7` / `lg:col-span-5`) 7:5 split layout without breaking desktop viewports.
- Maintain dark emerald (`#144227` / `#1b4332`) primary brand styling.
- All icons must use `lucide-vue-next`.

---

### Task 1: Responsive Layout Adjustments in `Intro.vue`

**Files:**
- Modify: `src/layouts/Intro.vue`

**Interfaces:**
- Consumes: User avatar from `authStore` or `defaultAvatar`
- Produces: Responsive `<IntroLayout>` wrapper for `/` route

- [ ] **Step 1: Inspect `src/layouts/Intro.vue` mobile styles**

Check current avatar dimensions (`w-40 h-40`), hero min-height (`min-h-[45vh]`), verse font size (`text-3xl`), and content padding (`p-6 md:p-10`).

- [ ] **Step 2: Update `Intro.vue` template with responsive utility classes**

Update `src/layouts/Intro.vue`:
```vue
<template>
  <main class="grid min-h-svh lg:grid-cols-12 font-sans">
    <!-- Left Hero Section -->
    <div class="relative flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 lg:col-span-7 bg-[#ebece8] overflow-hidden text-center py-6 sm:py-8 lg:min-h-svh">
      <!-- Background Image & Gradient Overlay -->
      <img class="absolute inset-0 object-cover w-full h-full" src="@/assets/bg-auth.jpg" alt="" />
      <div class="absolute inset-0 w-full h-full bg-linear-to-br from-primary-1 to-primary-2 opacity-85"></div>

      <!-- Profile & Verse Content -->
      <div class="relative z-10 flex flex-col items-center max-w-lg">
        <!-- Profile Avatar Circle -->
        <div class="relative w-24 h-24 sm:w-36 sm:h-36 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/90 shrink-0 group bg-gray-200 mb-3 sm:mb-6">
          <img
            :src="userAvatar"
            alt="Profile"
            class="w-full h-full object-cover filter grayscale contrast-105 group-hover:grayscale-0 transition-all duration-300"
          />
          <!-- Edit Profile Button Overlay -->
          <router-link
            to="/profile"
            class="absolute bottom-1.5 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold rounded-full border border-white/40 shadow-md transition-all duration-200 hover:scale-105"
          >
            <Pencil class="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
            <span>edit profil</span>
          </router-link>
        </div>

        <!-- Arabic Calligraphy Verse -->
        <div class="mb-2 sm:mb-3 text-2xl sm:text-3xl lg:text-5xl font-bold text-[#ffd900] font-arabic leading-normal drop-shadow-md">
          أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
        </div>

        <!-- Verse Translation & Reference -->
        <div class="space-y-0.5 sm:space-y-1 text-white font-bold text-xs sm:text-base lg:text-xl drop-shadow-sm">
          <p>Tidakkah mereka mentadaburi Al-Qur'an?</p>
          <p class="text-white/90">(An-Nisaa' : 82)</p>
        </div>
      </div>
    </div>

    <!-- Right Side: Content Container (Slot) -->
    <div class="flex flex-col gap-2 sm:gap-4 p-4 sm:p-6 lg:p-10 lg:col-span-5 bg-white justify-center items-center">
      <div class="flex justify-center gap-2 lg:hidden mb-1 sm:mb-2">
        <a href="/" class="flex items-center">
          <img class="w-auto h-10 sm:h-14" src="@/assets/logo.png" alt="Komunitas Tadabbur Al-Qur'an" />
        </a>
      </div>
      <div class="flex items-center justify-center flex-1 w-full">
        <div class="w-full max-w-md">
          <slot />
        </div>
      </div>
    </div>
  </main>
</template>
```

- [ ] **Step 3: Commit `src/layouts/Intro.vue` changes**

```bash
git add src/layouts/Intro.vue
git commit -m "style: optimize Intro layout responsiveness for mobile devices"
```

---

### Task 2: Update Menu Items & Icons in `Home.vue`

**Files:**
- Modify: `src/pages/Home.vue`

**Interfaces:**
- Consumes: Lucide icons `BookOpen`, `Brain`, `ClipboardCheck`, `GraduationCap`, `HeartHandshake`, `ChevronRight`
- Produces: Home page menu with color-accented pill icons and compact button paddings

- [ ] **Step 1: Define icon mapping in `Home.vue`**

Import Lucide icons in `<script setup>`:
```javascript
import {
  BookOpen,
  Brain,
  ClipboardCheck,
  GraduationCap,
  HeartHandshake,
  ChevronRight,
  QrCode,
} from 'lucide-vue-next';

const menuItems = [
  {
    title: 'Tadabbur',
    route: 'tadabbur',
    icon: BookOpen,
    iconBg: 'bg-emerald-100 text-emerald-700 border border-emerald-200/60',
  },
  {
    title: 'Kuis',
    route: 'quizzes',
    icon: Brain,
    iconBg: 'bg-amber-100 text-amber-700 border border-amber-200/60',
  },
  {
    title: 'Evaluasi',
    route: 'evaluations',
    icon: ClipboardCheck,
    iconBg: 'bg-teal-100 text-teal-700 border border-teal-200/60',
  },
  {
    title: 'Rapor',
    route: 'reports',
    icon: GraduationCap,
    iconBg: 'bg-indigo-100 text-indigo-700 border border-indigo-200/60',
  },
  {
    title: 'Infaq',
    route: 'infaq',
    icon: HeartHandshake,
    iconBg: 'bg-rose-100 text-rose-700 border border-rose-200/60',
  },
];
```

- [ ] **Step 2: Update template of `Home.vue`**

```vue
<template>
  <div class="flex flex-col items-center w-full py-2 sm:py-4 text-center">
    <!-- Menu Navigation Items -->
    <div class="w-full flex flex-col gap-2.5 sm:gap-3.5">
      <component
        v-for="item in menuItems"
        :key="item.title"
        :is="item.route ? 'router-link' : 'button'"
        :to="item.route ? { name: item.route } : undefined"
        @click="!item.route && navigateMenu(item)"
        class="group flex items-center justify-between w-full px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full border-2 border-[#1b4332] hover:border-[#0f291e] bg-white hover:bg-emerald-50/60 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-700/30 text-left"
      >
        <div class="flex items-center gap-3 sm:gap-4">
          <!-- Color Accented Icon Container -->
          <div :class="['w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-110', item.iconBg]">
            <component :is="item.icon" class="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </div>
          <span class="text-[#144227] font-bold text-base sm:text-lg tracking-wide">
            {{ item.title }}
          </span>
        </div>
        <!-- Dark Green Right Chevron -->
        <ChevronRight class="w-5 h-5 text-[#144227] group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
      </component>
    </div>

    <!-- Modals remain unchanged ... -->
```

- [ ] **Step 3: Commit `src/pages/Home.vue` changes**

```bash
git add src/pages/Home.vue
git commit -m "feat: replace generic menu star icon with color-accented Lucide icons and adjust menu padding"
```

---

### Task 3: Build Verification & Testing

**Files:**
- None (Build & run verification)

- [ ] **Step 1: Run Vite build to verify compilation**

Run: `npm run build`
Expected: Clean build output with zero errors.

- [ ] **Step 2: Commit any final plan updates**

```bash
git add .
git commit -m "chore: completed mobile intro page optimization and menu icon update"
```

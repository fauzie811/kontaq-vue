# Mobile Notification Bottom Sheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a responsive mobile bottom sheet drawer and desktop dropdown popover component for notifications in Kontaq Vue.

**Architecture:** Create a standalone Vue component `src/components/NotificationDrawer.vue` that encapsulates the responsive UI. On mobile screens (`< sm`), it teleports to `body` as a fixed bottom sheet with backdrop overlay, drag handle, rounded top corners, and body scroll lock. On desktop screens (`sm:`), it renders an anchored dropdown popover below the bell icon in `src/layouts/Main.vue`.

**Tech Stack:** Vue 3, Tailwind CSS v3, Lucide Vue Next icons (`Bell`, `Pin`, `X`), Vue Router (`router-link`), `@vueuse/core` (`onClickOutside`).

## Global Constraints

- Retain exact route names and navigation actions (`announcements.show`, `announcements`, `infaq`).
- Maintain existing emerald theme tokens (`emerald-50`, `emerald-100`, `emerald-600`, `emerald-700`, `emerald-800`).
- Ensure full accessibility and backdrop light-dismiss on mobile viewports.

---

### Task 1: Create `NotificationDrawer.vue` Component

**Files:**
- Create: `src/components/NotificationDrawer.vue`

**Interfaces:**
- Consumes:
  - Props: `isOpen` (Boolean), `notifications` (Array of NotificationItem)
  - Icons from `lucide-vue-next`: `Bell`, `Pin`, `X`
- Produces:
  - `@close` event when backdrop, close button, or items are tapped.
  - `@select` event when a notification item is tapped.

- [ ] **Step 1: Write `src/components/NotificationDrawer.vue`**

```vue
<template>
  <div>
    <!-- Desktop Dropdown (sm: breakpoint and up) -->
    <div
      v-if="isOpen"
      class="hidden sm:block absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
    >
      <div class="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h4 class="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <Bell class="w-4 h-4 text-emerald-600" />
          Notifikasi & Pengumuman
        </h4>
        <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
          {{ notifications.length }} Baru
        </span>
      </div>

      <!-- Notifications List -->
      <div class="divide-y divide-gray-50 max-h-80 overflow-y-auto text-sm">
        <div v-if="notifications.length === 0" class="p-6 text-center text-xs text-gray-500">
          Tidak ada pengumuman baru.
        </div>
        <div
          v-for="(notif, idx) in notifications"
          :key="notif.id || idx"
          @click="onSelect(notif)"
          class="p-3.5 hover:bg-emerald-50/50 transition cursor-pointer flex gap-3 items-start"
        >
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Pin v-if="notif.isSticky" class="w-4 h-4 text-emerald-700" />
            <Bell v-else class="w-4 h-4 text-emerald-700" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-semibold text-gray-800 text-xs sm:text-sm truncate">{{ notif.title }}</p>
            <p class="text-xs text-gray-500 mt-0.5 leading-snug line-clamp-2">{{ notif.desc }}</p>
            <span class="text-[10px] text-emerald-600 font-medium mt-1 block">{{ notif.time }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Link -->
      <router-link
        :to="{ name: 'announcements' }"
        @click="emit('close')"
        class="block text-center py-2.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border-t border-emerald-100"
      >
        Lihat Semua Pengumuman &rarr;
      </router-link>
    </div>

    <!-- Mobile Bottom Sheet (Teleported to Body for < sm breakpoint) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
          @click="emit('close')"
        ></div>
      </Transition>

      <Transition
        enter-active-class="transition duration-300 ease-out transform"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition duration-200 ease-in transform"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div
          v-if="isOpen"
          class="sm:hidden fixed bottom-0 inset-x-0 bg-white rounded-t-3xl border-t border-gray-100 shadow-2xl z-50 max-h-[85vh] flex flex-col overflow-hidden"
        >
          <!-- Grab Handle -->
          <div class="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing" @click="emit('close')">
            <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Sheet Header -->
          <div class="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Bell class="w-4 h-4" />
              </div>
              <div>
                <h3 class="font-bold text-gray-900 text-base leading-tight">Notifikasi</h3>
                <p class="text-xs text-gray-500 font-medium">Pengumuman & informasi terbaru</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
                {{ notifications.length }} Baru
              </span>
              <button
                @click="emit('close')"
                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Notifications List -->
          <div class="divide-y divide-gray-100 max-h-[55vh] overflow-y-auto px-4 py-2 text-sm">
            <div v-if="notifications.length === 0" class="py-10 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
              <Bell class="w-8 h-8 text-gray-300" />
              <span>Tidak ada pengumuman baru.</span>
            </div>
            <div
              v-for="(notif, idx) in notifications"
              :key="notif.id || idx"
              @click="onSelect(notif)"
              class="py-3 px-2 hover:bg-emerald-50/50 rounded-xl transition cursor-pointer flex gap-3 items-start my-1"
            >
              <div class="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Pin v-if="notif.isSticky" class="w-4.5 h-4.5 text-emerald-700" />
                <Bell v-else class="w-4.5 h-4.5 text-emerald-700" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-gray-900 text-sm leading-snug">{{ notif.title }}</p>
                <p class="text-xs text-gray-600 mt-1 leading-normal line-clamp-2">{{ notif.desc }}</p>
                <span class="text-[11px] text-emerald-600 font-semibold mt-1.5 block">{{ notif.time }}</span>
              </div>
            </div>
          </div>

          <!-- Footer Link -->
          <router-link
            :to="{ name: 'announcements' }"
            @click="emit('close')"
            class="block text-center py-3.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition border-t border-emerald-100 mt-auto"
          >
            Lihat Semua Pengumuman &rarr;
          </router-link>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';
import { Bell, Pin, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'select']);

function onSelect(notif) {
  emit('select', notif);
  emit('close');
}

// Body scroll lock on mobile when sheet is open
watch(
  () => props.isOpen,
  (val) => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }
);

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = '';
  }
});
</script>
```

- [ ] **Step 2: Commit Task 1**

```bash
git add src/components/NotificationDrawer.vue
git commit -m "feat(notifications): add responsive NotificationDrawer component with mobile bottom sheet"
```

---

### Task 2: Integrate `NotificationDrawer.vue` in `src/layouts/Main.vue`

**Files:**
- Modify: `src/layouts/Main.vue`

**Interfaces:**
- Imports `NotificationDrawer` from `@/components/NotificationDrawer.vue`.
- Binds `:is-open="isNotificationOpen"`, `:notifications="notificationList"`, `@close="isNotificationOpen = false"`, `@select="clickNotification"`.

- [ ] **Step 1: Update `src/layouts/Main.vue` template & script**

Import `NotificationDrawer`:
```javascript
import NotificationDrawer from '@/components/NotificationDrawer.vue';
```

Replace the existing inline notification dropdown menu markup with `NotificationDrawer`:
```vue
<!-- Notification Bell Button -->
<div ref="notificationMenuRef" class="relative">
  <button
    @click="toggleNotification"
    title="Notifikasi"
    class="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition shadow-sm border border-emerald-100 relative cursor-pointer"
  >
    <Bell class="w-5 h-5 stroke-[2.2]" />
    <span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white"></span>
  </button>

  <NotificationDrawer
    :is-open="isNotificationOpen"
    :notifications="notificationList"
    @close="isNotificationOpen = false"
    @select="clickNotification"
  />
</div>
```

- [ ] **Step 2: Verify `npm run build` passes cleanly**

Run: `npm run build`
Expected: Successful vite production build output without errors.

- [ ] **Step 3: Commit Task 2**

```bash
git add src/layouts/Main.vue
git commit -m "refactor(layout): integrate responsive NotificationDrawer in Main.vue"
```

---

### Task 3: Verification & Polish

**Files:**
- Verify: `src/components/NotificationDrawer.vue`, `src/layouts/Main.vue`

- [ ] **Step 1: Check production build assets**

Run: `npm run build`
Expected: Build succeeds with 0 lint or compilation errors.

- [ ] **Step 2: Final commit**

```bash
git add .
git commit -m "build: update dist after notification bottom sheet upgrade"
```

# Verse Actions Dropdown Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move verse header action buttons in `QuranVerseItem.vue` into a unified 3-dots dropdown menu.

**Architecture:** Use `@headlessui/vue` (`Menu`, `MenuButton`, `MenuItems`, `MenuItem`) to create an accessible floating menu button on `QuranVerseItem.vue` containing Putar/Jeda Audio, Catatan Kaki, and Salin Ayat.

**Tech Stack:** Vue 3, `@headlessui/vue`, `lucide-vue-next`, Tailwind CSS.

## Global Constraints
- Framework: Vue 3 SFC (`<script setup>`)
- Headless UI: `@headlessui/vue` Menu component
- Icons: `lucide-vue-next` (`MoreVertical`, `Volume2`, `Play`, `Pause`, `FileText`, `Copy`, `Check`)

---

### Task 1: Refactor `QuranVerseItem.vue` to use 3-dots dropdown menu

**Files:**
- Modify: `src/components/QuranVerseItem.vue`

**Interfaces:**
- Consumes:
  - Props: `verse` (Object), `chapterDetails` (Object), `isActive` (Boolean), `isPlaying` (Boolean), `isCopied` (Boolean)
  - Emits: `play-verse`, `copy-verse`
- Produces: Updated `QuranVerseItem.vue` with 3-dots dropdown menu header.

- [ ] **Step 1: Inspect and update imports in `src/components/QuranVerseItem.vue`**

Update the imports in `<script setup>`:
```javascript
import { ref, computed } from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
import { FileText, Volume2, Play, Pause, Copy, Check, MoreVertical } from 'lucide-vue-next';
```

- [ ] **Step 2: Update the template header in `src/components/QuranVerseItem.vue`**

Replace the action buttons block inside `<div class="flex items-center gap-1.5">` with `@headlessui/vue` `<Menu>` structure:

```html
<!-- Actions Dropdown (3-dots) -->
<Menu as="div" class="relative">
  <MenuButton
    title="Opsi Ayat"
    class="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition cursor-pointer min-w-[36px] min-h-[36px] inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
  >
    <MoreVertical class="w-4 h-4" />
  </MenuButton>

  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <MenuItems
      class="absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-gray-900/5 focus:outline-none space-y-0.5"
    >
      <!-- Play / Pause Audio -->
      <MenuItem v-slot="{ active }">
        <button
          @click="$emit('play-verse', verse)"
          :class="[
            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
            'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
          ]"
        >
          <Pause v-if="isActive && isPlaying" class="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <Play v-else-if="isActive" class="w-4 h-4 text-emerald-600 fill-emerald-600 ml-0.5" />
          <Volume2 v-else class="w-4 h-4 text-gray-500" />
          <span>{{ isActive && isPlaying ? 'Jeda Audio' : 'Putar Audio' }}</span>
        </button>
      </MenuItem>

      <!-- Toggle Footnote (If available) -->
      <MenuItem v-if="verse.footnotes" v-slot="{ active }">
        <button
          @click="showFootnotes = !showFootnotes"
          :class="[
            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
            'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
          ]"
        >
          <FileText class="w-4 h-4 text-emerald-600" />
          <span>{{ showFootnotes ? 'Sembunyikan Catatan' : 'Lihat Catatan Kaki' }}</span>
        </button>
      </MenuItem>

      <!-- Copy Verse -->
      <MenuItem v-slot="{ active }">
        <button
          @click="$emit('copy-verse', verse)"
          :class="[
            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-700',
            'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition cursor-pointer'
          ]"
        >
          <Check v-if="isCopied" class="w-4 h-4 text-emerald-600" />
          <Copy v-else class="w-4 h-4 text-gray-500" />
          <span>{{ isCopied ? 'Tersalin!' : 'Salin Ayat' }}</span>
        </button>
      </MenuItem>
    </MenuItems>
  </transition>
</Menu>
```

- [ ] **Step 3: Verify build / syntax compilation**

Run build or dev server to verify Vue template compiles cleanly without errors:
Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit changes**

```bash
git add src/components/QuranVerseItem.vue
git commit -m "feat(quran): move verse actions into 3-dots dropdown button"
```

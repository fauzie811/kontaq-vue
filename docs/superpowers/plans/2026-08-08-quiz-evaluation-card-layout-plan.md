# Quiz & Evaluation Card Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign Quiz and Evaluation index pages into responsive, modern card grid layouts with rich visual metadata, status badges, and hover animations.

**Architecture:** Replace single-container `divide-y` list structures with a responsive Tailwind grid (`grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6`) inside an expanded `max-w-5xl` container. Cards will feature status badges, duration with Lucide icons, full-width action buttons, and empty states.

**Tech Stack:** Vue 3 (Composition API `<script setup>`), Tailwind CSS v4, Lucide Vue Next icons (`Clock`, `CheckCircle2`, `PlayCircle`, `HelpCircle`, `Lock`, `FileText`, `Sparkles`), Vue Router.

## Global Constraints
- Target container max-width: `max-w-5xl`.
- Maintain all existing API calls, reactivity, pagination logic, and SweetAlert dialog behavior.
- Ensure strict responsive behavior on mobile, tablet, and desktop viewports.

---

### Task 1: Redesign `Quizzes.vue` into Responsive Grid Cards

**Files:**
- Modify: `src/pages/Quizzes.vue`

**Interfaces:**
- Consumes: `listMyQuizzes` API from `@/api`, `PageHeader`, `Pagination`, `CategoryPicker`, `swConfirm` utility.
- Produces: Responsive card grid UI for `/quizzes`.

- [ ] **Step 1: Inspect and prepare icon imports in `src/pages/Quizzes.vue`**

Add Lucide icons (`Clock`, `CheckCircle2`, `PlayCircle`, `HelpCircle`, `Sparkles`, `BookOpen`) to script section:
```javascript
import { Clock, CheckCircle2, PlayCircle, HelpCircle, Sparkles, BookOpen } from 'lucide-vue-next';
```

- [ ] **Step 2: Update `src/pages/Quizzes.vue` template layout**

Replace template in `src/pages/Quizzes.vue` with:
```html
<template>
  <div>
    <PageHeader class="mb-8" page-title="Kuis" />

    <div class="max-w-5xl">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-500">
            Menampilkan <strong class="text-gray-900">{{ quizzes.data?.length || 0 }}</strong> kuis
          </span>
        </div>
        <CategoryPicker show-all-option class="w-full sm:w-56" v-model="category"
          @update:modelValue="() => changePage(1)" />
      </div>

      <!-- Card Grid -->
      <div v-if="quizzes.data && quizzes.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div v-for="quiz in quizzes.data" :key="quiz.id"
          class="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 p-5 flex flex-col justify-between group h-full">
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 text-gray-600 text-xs font-medium">
                <Clock class="w-3.5 h-3.5 text-gray-500" />
                <span>{{ quiz.duration }} menit</span>
              </div>

              <div :class="[statuses[getStatus(quiz)].wrapper, 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset']">
                <component :is="statuses[getStatus(quiz)].icon" class="w-3.5 h-3.5" />
                <span>{{ getStatus(quiz) }}</span>
              </div>
            </div>

            <!-- Card Content: Title -->
            <h3 class="text-base font-bold text-gray-900 group-hover:text-[#144227] transition-colors line-clamp-2 mb-4 leading-snug">
              {{ quiz.title }}
            </h3>
          </div>

          <!-- Card Footer: Action Button -->
          <div class="pt-2">
            <button v-if="!quiz.material_read" @click.prevent="showAlert(quiz.material_id)"
              class="w-full bg-[#144227] hover:bg-[#0f321d] text-white font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer">
              <BookOpen class="w-4 h-4" />
              <span>{{ getButtonLabel(quiz) }}</span>
            </button>
            <router-link v-else :to="{ name: 'quizzes.show', params: { id: quiz.id } }"
              class="w-full bg-[#144227] hover:bg-[#0f321d] text-white font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center">
              <span>{{ getButtonLabel(quiz) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl border border-gray-200/80 p-12 text-center my-6">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <HelpCircle class="w-6 h-6" />
        </div>
        <h4 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Kuis</h4>
        <p class="text-sm text-gray-500">Kuis untuk kategori ini belum tersedia.</p>
      </div>

      <!-- Pagination -->
      <Pagination :meta="quizzes" v-on:change="changePage" />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Update `statuses` object mapping in script block**

```javascript
const statuses = {
  Selesai: {
    wrapper: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
    icon: CheckCircle2,
  },
  'Sedang dikerjakan': {
    wrapper: 'text-amber-800 bg-amber-50 ring-amber-600/20',
    icon: PlayCircle,
  },
  'Belum dikerjakan': {
    wrapper: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    icon: Sparkles,
  },
};
```

- [ ] **Step 4: Commit changes for Task 1**

```bash
git add src/pages/Quizzes.vue
git commit -m "feat(quizzes): redesign quiz index page into responsive grid cards"
```

---

### Task 2: Redesign `Evaluations.vue` into Responsive Grid Cards

**Files:**
- Modify: `src/pages/Evaluations.vue`

**Interfaces:**
- Consumes: `listMyEvaluations` API from `@/api`, `PageHeader`, `Pagination`, `CategoryPicker`.
- Produces: Responsive card grid UI for `/evaluations`.

- [ ] **Step 1: Inspect and add Lucide icon imports in `src/pages/Evaluations.vue`**

Add Lucide icons to script setup:
```javascript
import { Clock, CheckCircle2, PlayCircle, HelpCircle, Sparkles } from 'lucide-vue-next';
```

- [ ] **Step 2: Update `src/pages/Evaluations.vue` template layout**

Replace template in `src/pages/Evaluations.vue` with:
```html
<template>
  <div>
    <PageHeader class="mb-8" page-title="Evaluasi" />

    <div class="max-w-5xl">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-500">
            Menampilkan <strong class="text-gray-900">{{ evaluations.data?.length || 0 }}</strong> evaluasi
          </span>
        </div>
        <CategoryPicker show-all-option root-only class="w-full sm:w-56" v-model="category"
          @update:modelValue="() => changePage(1)" />
      </div>

      <!-- Card Grid -->
      <div v-if="evaluations.data && evaluations.data.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-6">
        <div v-for="evaluation in evaluations.data" :key="evaluation.id"
          class="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 p-5 flex flex-col justify-between group h-full">
          <div>
            <!-- Card Header: Duration & Status Badge -->
            <div class="flex items-center justify-between gap-2 mb-3">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 text-gray-600 text-xs font-medium">
                <Clock class="w-3.5 h-3.5 text-gray-500" />
                <span>{{ evaluation.duration }} menit</span>
              </div>

              <div :class="[statuses[getStatus(evaluation)].wrapper, 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset']">
                <component :is="statuses[getStatus(evaluation)].icon" class="w-3.5 h-3.5" />
                <span>{{ getStatus(evaluation) }}</span>
              </div>
            </div>

            <!-- Card Content: Title -->
            <h3 class="text-base font-bold text-gray-900 group-hover:text-[#144227] transition-colors line-clamp-2 mb-4 leading-snug">
              {{ evaluation.title }}
            </h3>
          </div>

          <!-- Card Footer: Action Button -->
          <div class="pt-2">
            <router-link :to="{ name: 'evaluations.show', params: { id: evaluation.id } }"
              class="w-full bg-[#144227] hover:bg-[#0f321d] text-white font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs text-center block">
              <span>{{ getButtonLabel(evaluation) }}</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-2xl border border-gray-200/80 p-12 text-center my-6">
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
          <HelpCircle class="w-6 h-6" />
        </div>
        <h4 class="text-base font-semibold text-gray-900 mb-1">Belum Ada Evaluasi</h4>
        <p class="text-sm text-gray-500">Evaluasi untuk kategori ini belum tersedia.</p>
      </div>

      <!-- Pagination -->
      <Pagination :meta="evaluations" v-on:change="changePage" />
    </div>
  </div>
</template>
```

- [ ] **Step 3: Update `statuses` object mapping in script block**

```javascript
const statuses = {
  Selesai: {
    wrapper: 'text-emerald-700 bg-emerald-50 ring-emerald-600/20',
    icon: CheckCircle2,
  },
  'Sedang dikerjakan': {
    wrapper: 'text-amber-800 bg-amber-50 ring-amber-600/20',
    icon: PlayCircle,
  },
  'Belum dikerjakan': {
    wrapper: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    icon: Sparkles,
  },
};
```

- [ ] **Step 4: Commit changes for Task 2**

```bash
git add src/pages/Evaluations.vue
git commit -m "feat(evaluations): redesign evaluation index page into responsive grid cards"
```

---

### Task 3: Build Verification & Final Sanity Check

**Files:**
- Build output & Vite compilation check

- [ ] **Step 1: Run Vite build command**

Run: `npm run build`
Expected: Zero build errors, clean asset bundling.

- [ ] **Step 2: Commit any final tweaks if needed**

```bash
git status
```

# Mobile-Friendly Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform KontaQ Vue into a fully mobile-friendly web app with a native bottom navigation bar on mobile screens, mobile-optimized search and popover modals, sticky horizontal table scrolling for Reports, and responsive typography for Quran verse reading.

**Architecture:** Use Vue 3 template conditional rendering and Tailwind CSS responsive media query breakpoints (`sm:`, `md:`, `lg:`) to deliver a desktop horizontal pill layout for `>= 640px` and a fixed glassmorphism bottom navigation bar for `< 640px`. Apply CSS sticky positioning for table columns on mobile.

**Tech Stack:** Vue 3, Vite, Tailwind CSS v4, Lucide Vue Next, Vue Router.

## Global Constraints
- Desktop/Tablet view (`>= 640px`) layout must remain functionally identical.
- Mobile bottom navigation bar visible only on `< 640px`.
- Reports table must preserve `table` element structure with `sticky left-0` on mobile.
- Build validation via `npm run build` must succeed without errors.

---

### Task 1: Mobile Navigation Bar & Layout Modifications in Main.vue

**Files:**
- Modify: `src/layouts/Main.vue:1-200`

**Interfaces:**
- Consumes: `navTabs` array from `Main.vue` (`{ name, route, icon }`).
- Produces: Responsive navigation header (desktop top tabs vs mobile bottom bar) and dynamic padding offset.

- [ ] **Step 1: Inspect Main.vue current layout structure**

Run: `node -e "console.log('Inspecting Main.vue tabs setup')"`
Expected: Clean understanding of `navTabs` array and main layout container.

- [ ] **Step 2: Update Main.vue template for dual navigation and responsive bottom banner**

Update `src/layouts/Main.vue`:
1. Hide top horizontal navigation pills container on mobile (`hidden sm:block` or `hidden sm:flex`).
2. Add fixed bottom navigation bar rendered on mobile screens (`flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-2 py-1.5 justify-around items-center`).
3. Set bottom banner position to `bottom-20 sm:bottom-5` so it stays clear of the bottom navigation bar on mobile devices.
4. Adjust root container bottom padding to `pb-32 sm:pb-24`.

- [ ] **Step 3: Run Vite build to verify template syntax**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 4: Commit changes**

```bash
git add src/layouts/Main.vue
git commit -m "feat(layout): add mobile bottom navigation bar and adjust responsive layout padding"
```

---

### Task 2: Mobile Search Modal & Dropdown Overlays in Main.vue

**Files:**
- Modify: `src/layouts/Main.vue:198-350`

**Interfaces:**
- Consumes: `isSearchOpen`, `isNotificationOpen`, `isUserMenuOpen` reactive refs.
- Produces: Bottom-sheet style modal container on mobile viewports.

- [ ] **Step 1: Update Search Modal container and filter shortcuts for mobile**

In `src/layouts/Main.vue`:
1. Modify search modal backdrop & dialog wrapper to align at bottom of viewport on mobile (`items-end sm:items-start pt-4 sm:pt-20 pb-0 sm:pb-4`).
2. Style modal container as full width rounded bottom sheet on mobile (`w-full rounded-t-3xl sm:rounded-3xl max-h-[90vh] sm:max-h-[85vh]`).
3. Wrap filter chips (`# Surah`, `@ Ayat`, `? Tadabbur`) and search input elements cleanly with flexible wrap classes (`flex-wrap gap-1.5 sm:gap-2`).
4. Constrain notification and user dropdown width (`w-[calc(100vw-2rem)] max-w-sm sm:w-96`).

- [ ] **Step 2: Run Vite build to verify compilation**

Run: `npm run build`
Expected: Build completes cleanly.

- [ ] **Step 3: Commit changes**

```bash
git add src/layouts/Main.vue
git commit -m "feat(layout): optimize search modal and dropdown overlays for mobile viewports"
```

---

### Task 3: Sticky Column Mobile Table in Reports.vue

**Files:**
- Modify: `src/pages/Reports.vue:1-60`

**Interfaces:**
- Consumes: `reports` data object containing `items`, `quizzes`, and `evaluations`.
- Produces: Horizontally scrollable table with sticky participant name columns on mobile screens.

- [ ] **Step 1: Update Reports.vue table wrapper and sticky column styling**

In `src/pages/Reports.vue`:
1. Ensure table container has `overflow-x-auto rounded-2xl border border-gray-200 shadow-sm`.
2. Add `sticky left-0 z-10 bg-white` (or `bg-gray-50` for header/footer) to `#` and `Nama Peserta` table header (`th`) and data cells (`td`).
3. Add subtle right border / shadow to sticky boundary (`border-r border-gray-200 shadow-xs`).
4. Apply compact cell padding on mobile viewports (`py-2.5 px-2.5 sm:py-4 sm:px-3 text-xs sm:text-sm`).

- [ ] **Step 2: Run Vite build to verify table compilation**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/pages/Reports.vue
git commit -m "feat(reports): add horizontal overflow scroll and sticky name column for mobile data table"
```

---

### Task 4: Responsive Surah Header & Quran Verse Reading in Quran/Show.vue

**Files:**
- Modify: `src/pages/Quran/Show.vue:1-135`

**Interfaces:**
- Consumes: `chapterDetails` and `verses` data.
- Produces: Responsive header banner and mobile-optimized verse typography.

- [ ] **Step 1: Update Quran/Show.vue layout for mobile responsiveness**

In `src/pages/Quran/Show.vue`:
1. Adjust Surah Header banner to stack items vertically on mobile (`flex-col sm:flex-row text-center sm:text-left gap-4 sm:gap-6`).
2. Make Surah Arabic title font responsive (`text-3xl sm:text-5xl`).
3. Make Bismillah banner font responsive (`text-lg sm:text-2xl lg:text-3xl`).
4. Adjust verse cards padding (`p-4 sm:p-7`) and action buttons touch target sizes (minimum `36px sm:36px` touch area).

- [ ] **Step 2: Run Vite build to verify Quran view compilation**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 3: Commit changes**

```bash
git add src/pages/Quran/Show.vue
git commit -m "feat(quran): make Surah banner and verse cards fully responsive for mobile readers"
```

---

### Task 5: End-to-End Build & Verification

**Files:**
- Check: All modified files in `src/`

- [ ] **Step 1: Execute full production build**

Run: `npm run build`
Expected: Production build completes successfully into `dist/`.

- [ ] **Step 2: Run git status check**

Run: `git status`
Expected: Working tree clean, all commits created.

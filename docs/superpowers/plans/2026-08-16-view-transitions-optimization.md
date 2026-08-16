# View Transitions Optimization & Fixed Element Isolation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate visual overlapping of fixed elements during page transitions and remove layout morphing artifacts by setting up named View Transition groups, a strict stacking context, and harmonized component scopes.

**Architecture:** Assign explicit `view-transition-name` tokens to persistent and fixed shell elements (`app-header`, `app-nav`, `app-bottom-nav`, `app-floating-banner`, `app-audio-player`). Isolate `page-content` under a strict `z-index: 1` with `overflow: clip`, and adjust layout slot wrappers across `Main.vue`, `Intro.vue`, `Auth.vue`, and `Quiz.vue` so that transitions only morph the dynamic content area.

**Tech Stack:** Vue 3, Vue Router 4, Tailwind CSS v4, Web View Transitions API.

## Global Constraints

- Never use `animation: none !important;` globally without respecting `prefers-reduced-motion`.
- Persistent shell elements (`app-header`, `app-nav`, `app-bottom-nav`) must have `animation: none;` on their old and new pseudo-elements to avoid flickering.
- `page-content` must stay clipped to prevent visual spill across fixed header/footer regions.
- Ensure backwards compatibility with browsers that do not support the View Transitions API.

---

### Task 1: CSS View Transition Groups, Layering & Motion Curves

**Files:**
- Modify: `src/assets/index.css:280-401`

**Interfaces:**
- Consumes: Tailwind CSS v4 tokens, standard CSS pseudo-elements `::view-transition-*`
- Produces: CSS classes `.view-transition-content`, `.view-transition-header`, `.view-transition-nav`, `.view-transition-bottom-nav`, `.view-transition-floating-banner`, `.view-transition-audio-player`, and `::view-transition-group(*)` stacking rules.

- [ ] **Step 1: Update `src/assets/index.css` with named transition classes and stacking rules**

Replace the View Transitions section in `src/assets/index.css` with:
```css
/* View Transitions */

.view-transition-content {
  view-transition-name: page-content;
}

.view-transition-header {
  view-transition-name: app-header;
}

.view-transition-nav {
  view-transition-name: app-nav;
}

.view-transition-bottom-nav {
  view-transition-name: app-bottom-nav;
}

.view-transition-floating-banner {
  view-transition-name: app-floating-banner;
}

.view-transition-audio-player {
  view-transition-name: app-audio-player;
}

/* Stacking Context for View Transition Groups */
::view-transition-group(root) {
  z-index: 0;
}

::view-transition-group(page-content) {
  z-index: 1;
  overflow: clip;
}

::view-transition-group(app-nav) {
  z-index: 10;
}

::view-transition-group(app-header) {
  z-index: 20;
}

::view-transition-group(app-bottom-nav) {
  z-index: 30;
}

::view-transition-group(app-floating-banner) {
  z-index: 35;
}

::view-transition-group(app-audio-player) {
  z-index: 40;
}

/* Page shell & persistent chrome: prevent flickering / morphing */
::view-transition-old(root),
::view-transition-new(root),
::view-transition-old(app-header),
::view-transition-new(app-header),
::view-transition-old(app-nav),
::view-transition-new(app-nav),
::view-transition-old(app-bottom-nav),
::view-transition-new(app-bottom-nav),
::view-transition-old(app-floating-banner),
::view-transition-new(app-floating-banner),
::view-transition-old(app-audio-player),
::view-transition-new(app-audio-player) {
  animation: none;
}

/* Keyframes for refined page transitions */
@keyframes vt-fade-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.99);
  }
}

@keyframes vt-fade-in {
  from {
    opacity: 0;
    transform: scale(0.99);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes vt-slide-to-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-16px);
    opacity: 0;
  }
}

@keyframes vt-slide-from-right {
  from {
    transform: translateX(16px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes vt-slide-to-right {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(16px);
    opacity: 0;
  }
}

@keyframes vt-slide-from-left {
  from {
    transform: translateX(-16px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

::view-transition-old(page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vt-fade-out;
}

::view-transition-new(page-content) {
  animation: 220ms cubic-bezier(0, 0, 0.2, 1) both vt-fade-in;
}

/* Directional transitions via active-view-transition-type pseudo class */
html:active-view-transition-type(forward)::view-transition-old(page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vt-slide-to-left;
}

html:active-view-transition-type(forward)::view-transition-new(page-content) {
  animation: 220ms cubic-bezier(0, 0, 0.2, 1) both vt-slide-from-right;
}

html:active-view-transition-type(backward)::view-transition-old(page-content) {
  animation: 180ms cubic-bezier(0.4, 0, 1, 1) both vt-slide-to-right;
}

html:active-view-transition-type(backward)::view-transition-new(page-content) {
  animation: 220ms cubic-bezier(0, 0, 0.2, 1) both vt-slide-from-left;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

- [ ] **Step 2: Commit CSS changes**

```bash
git add src/assets/index.css
git commit -m "style: add named view transition groups, stacking context, and motion curves"
```

---

### Task 2: Layout Component Scoping & View Transition Classes

**Files:**
- Modify: `src/layouts/Main.vue`
- Modify: `src/layouts/Intro.vue`
- Modify: `src/layouts/Auth.vue`
- Modify: `src/layouts/Quiz.vue`

**Interfaces:**
- Consumes: CSS classes defined in `src/assets/index.css`
- Produces: Correct markup with isolated `view-transition-*` classes attached to header, nav tabs, main content slot, floating banner, and bottom navigation.

- [ ] **Step 1: Update `src/layouts/Main.vue`**
  - Add `view-transition-header` to `<header class="...">`
  - Add `view-transition-nav` to `<section v-if="route.name !== 'infaq'" class="...">`
  - Ensure `<main class="view-transition-content ...">` retains `view-transition-content`
  - Add `view-transition-floating-banner` to `<footer v-if="isBannerVisible" class="...">`
  - Add `view-transition-bottom-nav` to `<nav v-if="route.name !== 'infaq'" class="...">`

- [ ] **Step 2: Update `src/layouts/Intro.vue`**
  - Remove `view-transition-content` from `<main class="grid min-h-svh ...">`
  - Add `view-transition-content` to the inner content wrapper `<div class="w-full max-w-md">` around `<slot />`

- [ ] **Step 3: Update `src/layouts/Auth.vue`**
  - Remove `view-transition-content` from `<main class="grid min-h-svh ...">`
  - Add `view-transition-content` to the inner content wrapper `<div class="w-full max-w-md lg:max-w-xl transition-all duration-300">` around `<slot />`

- [ ] **Step 4: Update `src/layouts/Quiz.vue`**
  - Add `view-transition-header` to the sticky header `<div class="sticky top-0 z-40 ...">`
  - Ensure `<main class="view-transition-content ...">` wraps the slot

- [ ] **Step 5: Commit Layout updates**

```bash
git add src/layouts/Main.vue src/layouts/Intro.vue src/layouts/Auth.vue src/layouts/Quiz.vue
git commit -m "refactor(layouts): isolate view transition scopes across layout components"
```

---

### Task 3: Persistent Audio Player View Transition Scoping

**Files:**
- Modify: `src/components/QuranAudioPlayer.vue:10-16`

**Interfaces:**
- Consumes: `.view-transition-audio-player` class from `src/assets/index.css`
- Produces: Audio player container isolated in `app-audio-player` view transition group.

- [ ] **Step 1: Add `view-transition-audio-player` to `src/components/QuranAudioPlayer.vue`**

In `src/components/QuranAudioPlayer.vue`, add `view-transition-audio-player` to the outer player container:
```html
<div
  v-if="quranAudio.currentVerseNumber"
  :class="[
    'view-transition-audio-player fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 bg-card/95 text-card-foreground backdrop-blur-md border border-border shadow-xl overflow-hidden transition-all duration-300 ease-in-out',
    isExpanded ? 'rounded-2xl p-3 sm:p-4' : 'rounded-3xl p-3 sm:px-5'
  ]"
>
```

- [ ] **Step 2: Commit QuranAudioPlayer update**

```bash
git add src/components/QuranAudioPlayer.vue
git commit -m "refactor(audio): add view-transition-audio-player to QuranAudioPlayer"
```

---

### Task 4: Router Resolution & Navigation Type Verification

**Files:**
- Modify: `src/router.js:157-200`

**Interfaces:**
- Consumes: Browser View Transitions API, `popstate` events, `prefers-reduced-motion` media query
- Produces: Smooth router navigation transitions with directional types (`forward` / `backward`).

- [ ] **Step 1: Check and refine router navigation direction logic**

Ensure `src/router.js` gracefully handles `startViewTransition` with fallback and resets `isBackNavigation`:
```javascript
let isBackNavigation = false;
if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    isBackNavigation = true;
  });
}

router.beforeResolve((to, from) => {
  if (
    typeof document === 'undefined' ||
    !document.startViewTransition ||
    to.path === from.path
  ) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion) {
    return;
  }

  const direction = isBackNavigation ? 'backward' : 'forward';
  isBackNavigation = false;

  return new Promise((resolve) => {
    try {
      document.startViewTransition({
        update: async () => {
          resolve();
          await nextTick();
        },
        types: [direction],
      });
    } catch (e) {
      document.startViewTransition(async () => {
        resolve();
        await nextTick();
      });
    }
  });
});
```

- [ ] **Step 2: Commit router verification**

```bash
git add src/router.js
git commit -m "fix(router): ensure robust view transition resolution and direction handling"
```

---

### Task 5: Build & End-to-End Verification

**Files:**
- Build artifacts: `dist/`

- [ ] **Step 1: Run project build**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 2: Verify git status is clean**

Run: `git status`
Expected: Working tree clean.

# Surah Name V4 Font Ligatures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the `Surah Name V4.woff2` font for displaying chapter name calligraphy across the application using OpenType font ligatures (`surah001` .. `surah114`).

**Architecture:** Register the `@font-face` for `Surah Names` and a utility class `.font-surah` in Tailwind CSS v4 `index.css`. Provide a helper function `getSurahLigature(chapterNumber)` in `constants/quran.js` and a reusable `<SurahName>` component in `components/SurahName.vue`. Then replace chapter calligraphy across `Quran/Show.vue`, `Tadabbur.vue`, and `SearchModal.vue`.

**Tech Stack:** Vue 3 (Composition API / `<script setup>`), Tailwind CSS v4, Vitest, @vue/test-utils.

## Global Constraints
- Target font file is `src/assets/fonts/Surah Name V4.woff2`.
- Ligature format must be `surah` prefixed with 3-digit padded number: `surah001` to `surah114`.
- Preserve all existing comments and docstrings.
- Maintain full test coverage with Vitest.

---

### Task 1: CSS `@font-face` & Ligature Configuration

**Files:**
- Modify: `src/assets/index.css`

**Interfaces:**
- Produces: CSS utility class `.font-surah` and theme variable `--font-surah`.

- [ ] **Step 1: Add `@font-face` and `.font-surah` utility in `src/assets/index.css`**

Add `--font-surah: 'Surah Names', serif;` to `@theme`, register `@font-face` for `Surah Names`, and add `.font-surah` utility with OpenType ligature support:

```css
@font-face {
  font-family: 'Surah Names';
  src: url('./fonts/Surah Name V4.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.font-surah {
  font-family: 'Surah Names', serif;
  letter-spacing: normal !important;
  font-variant-ligatures: normal;
  font-feature-settings: "liga" 1, "calt" 1;
  text-rendering: optimizeLegibility;
}
```

- [ ] **Step 2: Verify CSS builds without errors**

Run: `npm run build` or `npx vite build --dry-run` / test command
Expected: Build passes with no CSS syntax errors.

- [ ] **Step 3: Commit**

```bash
git add src/assets/index.css
git commit -m "style: register Surah Names font face and font-surah utility"
```

---

### Task 2: Ligature Helper Function & Unit Tests

**Files:**
- Modify: `src/constants/quran.js`
- Create: `src/constants/quran.test.js`

**Interfaces:**
- Produces: `getSurahLigature(chapterNumber: number | string): string`

- [ ] **Step 1: Write failing test in `src/constants/quran.test.js`**

```javascript
import { describe, it, expect } from 'vitest';
import { getSurahLigature, getChapterName } from './quran';

describe('quran constants & helpers', () => {
  it('formats chapter numbers into 3-digit surah ligatures', () => {
    expect(getSurahLigature(1)).toBe('surah001');
    expect(getSurahLigature(18)).toBe('surah018');
    expect(getSurahLigature(114)).toBe('surah114');
    expect(getSurahLigature('2')).toBe('surah002');
  });

  it('handles invalid or out-of-range chapter numbers gracefully', () => {
    expect(getSurahLigature(null)).toBe('');
    expect(getSurahLigature(undefined)).toBe('');
    expect(getSurahLigature(0)).toBe('');
    expect(getSurahLigature(115)).toBe('');
    expect(getSurahLigature('abc')).toBe('');
  });

  it('gets chapter name properly', () => {
    expect(getChapterName(1)).toBe('Al-Fatihah');
    expect(getChapterName(114)).toBe('An-Nas');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/constants/quran.test.js`
Expected: FAIL with "getSurahLigature is not a function"

- [ ] **Step 3: Implement `getSurahLigature` in `src/constants/quran.js`**

```javascript
export function getSurahLigature(chapterNumber) {
  if (!chapterNumber && chapterNumber !== 0) return '';
  const num = Number(chapterNumber);
  if (isNaN(num) || num < 1 || num > 114) return '';
  return `surah${String(num).padStart(3, '0')}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/constants/quran.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/constants/quran.js src/constants/quran.test.js
git commit -m "feat: add getSurahLigature helper with unit tests"
```

---

### Task 3: `<SurahName>` Component & Unit Tests

**Files:**
- Create: `src/components/SurahName.vue`
- Create: `src/components/SurahName.test.js`

**Interfaces:**
- Consumes: `getSurahLigature`, `CHAPTER_DETAILS` from `@/constants/quran`
- Produces: `<SurahName :chapter="chapterNumber" :customClass="classString" />`

- [ ] **Step 1: Write failing test in `src/components/SurahName.test.js`**

```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SurahName from './SurahName.vue';

describe('SurahName.vue', () => {
  it('renders surah ligature string with font-surah class', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: 1,
      },
    });

    expect(wrapper.text()).toBe('surah001');
    expect(wrapper.classes()).toContain('font-surah');
    expect(wrapper.attributes('title')).toBe('Surah Al-Fatihah');
    expect(wrapper.attributes('aria-label')).toBe('Surah Al-Fatihah');
  });

  it('applies customClass prop', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: 18,
        customClass: 'text-4xl text-primary',
      },
    });

    expect(wrapper.text()).toBe('surah018');
    expect(wrapper.classes()).toContain('text-4xl');
    expect(wrapper.classes()).toContain('text-primary');
    expect(wrapper.attributes('title')).toBe('Surah Al-Kahf');
  });

  it('renders empty span when chapter is invalid', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: null,
      },
    });

    expect(wrapper.text()).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/SurahName.test.js`
Expected: FAIL with component not found

- [ ] **Step 3: Implement `src/components/SurahName.vue`**

```vue
<template>
  <span
    v-if="ligature"
    class="font-surah select-none inline-block leading-none"
    :class="customClass"
    :title="title"
    :aria-label="title"
    >{{ ligature }}</span
  >
</template>

<script setup>
import { computed } from 'vue';
import { getSurahLigature, CHAPTER_DETAILS } from '@/constants/quran';

const props = defineProps({
  chapter: {
    type: [Number, String],
    required: true,
  },
  customClass: {
    type: String,
    default: '',
  },
});

const ligature = computed(() => getSurahLigature(props.chapter));

const title = computed(() => {
  const num = Number(props.chapter);
  const detail = CHAPTER_DETAILS[num];
  if (detail?.latin) {
    return `Surah ${detail.latin}`;
  }
  return `Surah ${props.chapter}`;
});
</script>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/SurahName.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SurahName.vue src/components/SurahName.test.js
git commit -m "feat: add SurahName component with unit tests"
```

---

### Task 4: Integrate `<SurahName>` into `Quran/Show.vue`, `Tadabbur.vue`, and `SearchModal.vue`

**Files:**
- Modify: `src/pages/Quran/Show.vue`
- Modify: `src/pages/Tadabbur.vue`
- Modify: `src/components/SearchModal.vue`
- Modify: `src/pages/Quran/Show.test.js`
- Modify: `src/components/SearchModal.test.js`

**Interfaces:**
- Consumes: `<SurahName>` from `@/components/SurahName.vue`

- [ ] **Step 1: Update `src/pages/Quran/Show.vue`**

Import `SurahName` component and replace traditional Arabic text with `<SurahName>` in the header watermark:
```html
<div class="absolute -right-8 -bottom-8 opacity-5 select-none pointer-events-none text-foreground">
  <SurahName :chapter="chapterDetails.number" customClass="text-9xl" />
</div>
```
And in the header title right side calligraphy:
```html
<SurahName
  :chapter="chapterDetails.number"
  customClass="text-4xl sm:text-6xl font-normal text-primary drop-shadow-xs"
/>
```

- [ ] **Step 2: Update `src/pages/Tadabbur.vue`**

Import `SurahName` component and update the right-side calligraphy in the Surah cards:
```html
<!-- Right: Surah Name Calligraphy -->
<SurahName
  :chapter="surah.number"
  customClass="text-3xl sm:text-4xl text-foreground shrink-0 ml-2 group-hover:text-primary group-hover:scale-105 transition-all"
/>
```

- [ ] **Step 3: Update `src/components/SearchModal.vue`**

Import `SurahName` component and replace Arabic text in:
1. Popular surahs quick jump:
```html
<SurahName
  :chapter="surah.number"
  customClass="text-2xl text-foreground/80 shrink-0"
/>
```
2. Chapter search results:
```html
<SurahName
  :chapter="surah.number"
  customClass="text-2xl sm:text-3xl text-foreground/90 ml-2 shrink-0"
/>
```

- [ ] **Step 4: Update test mocks if needed and run all tests**

Run: `npm test`
Expected: All tests pass (including `Quran/Show.test.js`, `SearchModal.test.js`, etc.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/Quran/Show.vue src/pages/Tadabbur.vue src/components/SearchModal.vue src/pages/Quran/Show.test.js src/components/SearchModal.test.js
git commit -m "feat: integrate SurahName ligature font in Quran, Tadabbur, and SearchModal"
```

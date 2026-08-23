# Design Spec: Surah Name V4 Font Ligatures for Chapter Names

## 1. Overview
Integrate the font `src/assets/fonts/Surah Name V4.woff2` to display stylized chapter name calligraphy across the application using OpenType font ligatures (`surah001`, `surah002`, ..., `surah114`).

## 2. Goals & Scope
- Register `@font-face` for `Surah Names` font pointing to `./fonts/Surah Name V4.woff2`.
- Define Tailwind CSS theme variable `--font-surah` and `.font-surah` utility class with ligature features enabled (`font-variant-ligatures: normal`, `font-feature-settings: "liga" 1, "calt" 1`).
- Provide a utility helper `getSurahLigature(chapterNumber)` in `src/constants/quran.js`.
- Create a dedicated, reusable Vue component `src/components/SurahName.vue` with unit tests.
- Replace traditional Arabic text with `<SurahName>` / ligature font in:
  - **`src/pages/Quran/Show.vue`**: Header calligraphy title and watermark background.
  - **`src/pages/Tadabbur.vue`**: Surah list cards (calligraphy icon on the right).
  - **`src/components/SearchModal.vue`**: Popular surahs quick-jump items and chapter search results.

## 3. Technical Architecture & Design

### 3.1 CSS & Font Configuration (`src/assets/index.css`)
```css
@theme {
  /* ... */
  --font-surah: 'Surah Names', serif;
}

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

### 3.2 Helper Function (`src/constants/quran.js`)
```javascript
export function getSurahLigature(chapterNumber) {
  if (!chapterNumber && chapterNumber !== 0) return '';
  const num = Number(chapterNumber);
  if (isNaN(num) || num < 1 || num > 114) return '';
  return `surah${String(num).padStart(3, '0')}`;
}
```

### 3.3 `<SurahName>` Component (`src/components/SurahName.vue`)
- **Props**:
  - `chapter`: `[Number, String]` (required)
  - `customClass`: `String` (optional)
- **Template**:
  - Renders `<span class="font-surah select-none leading-none inline-block" :class="customClass" :title="title" :aria-label="title">{{ ligature }}</span>`
  - Computed `ligature` using `getSurahLigature(props.chapter)`.
  - Accessible `title` and `aria-label` showing Latin and Arabic surah names (e.g., `Surah Al-Baqarah`).

### 3.4 Integration Points

1. **`src/pages/Quran/Show.vue`**:
   - Header banner calligraphy:
     ```html
     <SurahName
       :chapter="chapterDetails.number"
       customClass="text-4xl sm:text-6xl text-primary drop-shadow-xs"
     />
     ```
   - Header background watermark:
     ```html
     <div class="absolute -right-8 -bottom-8 opacity-5 select-none pointer-events-none text-foreground">
       <SurahName :chapter="chapterDetails.number" customClass="text-9xl" />
     </div>
     ```

2. **`src/pages/Tadabbur.vue`**:
   - Surah grid items right calligraphy:
     ```html
     <SurahName
       :chapter="surah.number"
       customClass="text-3xl sm:text-4xl text-foreground group-hover:text-primary group-hover:scale-105 transition-all ml-2 shrink-0"
     />
     ```

3. **`src/components/SearchModal.vue`**:
   - Popular surahs cards:
     ```html
     <SurahName
       :chapter="surah.number"
       customClass="text-2xl text-foreground/80 shrink-0"
     />
     ```
   - Chapter search results:
     ```html
     <SurahName
       :chapter="surah.number"
       customClass="text-2xl sm:text-3xl text-foreground/90 ml-2 shrink-0"
     />
     ```

## 4. Testing & Verification
- Unit test for `getSurahLigature` in `src/constants/quran.test.js` covering valid chapters (1..114), edge cases (strings, out of bounds, null).
- Unit test for `<SurahName>` component in `src/components/SurahName.test.js`.
- Run full test suite with `vitest` to ensure no regressions in existing tests.

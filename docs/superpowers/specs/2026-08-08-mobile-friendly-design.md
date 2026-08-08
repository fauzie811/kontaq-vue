# Mobile-Friendly Design Specification for KontaQ Vue

## Overview
This document specifies the technical design for upgrading the KontaQ Vue web application to be fully mobile-friendly. The updates focus on native-feeling mobile navigation, touch-optimized headers and modals, responsive reading views, and optimized data table horizontal scrolling.

## Design Details

### 1. Navigation Architecture (`src/layouts/Main.vue`)
- **Desktop/Tablet (`>= 640px`)**:
  - Retain the top navigation tab pills container (`navTabs`: Tadabbur, Materials, Evaluations, Reports).
  - Bottom navigation bar is hidden (`sm:hidden`).
- **Mobile (`< 640px`)**:
  - Top tab container is hidden (`hidden sm:flex`).
  - Render a fixed **Bottom Navigation Bar** (`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-lg px-2 py-1.5 flex justify-around items-center`).
  - Bottom bar items display clean icons, active state background/text styling (`text-emerald-700 bg-emerald-50`), and compact text labels.
  - Main page content container incorporates safe bottom padding (`pb-32 sm:pb-24`) to guarantee zero content clipping.
- **Floating Banner (`Infaq`)**:
  - Positioned at `bottom-20 sm:bottom-5` on mobile viewports so it rests right above the bottom nav bar without overlapping control buttons.
  - Fully dismissible via top-right close icon.

### 2. Modals & Overlays (`src/layouts/Main.vue`)
- **Search Modal**:
  - Full-width bottom-sheet dialog on mobile (`w-full rounded-t-3xl sm:rounded-3xl max-h-[90vh] sm:max-h-[85vh]`).
  - Search input, quick shortcuts (`# Surah`, `@ Ayat`, `? Tadabbur`), and search result cards formatted for single-hand tap interactions.
- **Notification & User Dropdown Menus**:
  - Dropdown cards sized with max-width bounding (`w-[calc(100vw-2rem)] max-w-sm sm:w-96`) to avoid overflow on small viewports.

### 3. Page & Component Adaptations
- **Reports Table (`src/pages/Reports.vue`)**:
  - Retain full `table` structure across all device sizes.
  - Enclose table inside a responsive overflow container (`overflow-x-auto shadow ring-1 ring-black/5 rounded-2xl`).
  - Freeze/Stick the `#` and `Nama Peserta` columns (`sticky left-0 bg-white z-10 shadow-r`) so user names remain visible while horizontally scrolling quiz and evaluation scores.
  - Apply compact cell padding on mobile (`py-2.5 px-2.5 text-xs sm:text-sm`) for maximum data visibility.
- **Quran Reader (`src/pages/Quran/Show.vue`)**:
  - Surah banner: Responsive flex layout stacking header info and Arabic calligraphic title vertically on mobile.
  - Verse list: Responsive text sizes for Arabic script (`text-2xl sm:text-3xl`), transliteration, and translation. Action buttons (copy, bookmark) expanded to touch target minimums (>= 40px).

## Verification & Testing Strategy
- Test responsiveness across mobile viewports (375px, 390px, 414px) and tablet/desktop viewports (> 640px, 1024px).
- Verify bottom navigation tab switching, active route highlighting, and scroll offset padding.
- Verify sticky column behavior in `Reports.vue` during horizontal swipe/scroll.
- Execute `npm run build` to ensure clean Vue compilation.

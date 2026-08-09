# Design Spec: Mobile Optimization for Intro Page & Menu Icons

**Date:** 2026-08-09
**Status:** Approved

## Goal
Optimize the Intro page layout (`/`) for mobile screens so that the entire top hero section, KontaQ logo, and all 5 menu items fit neatly within a standard mobile screen viewport (`100vh`/`100svh`) without requiring vertical scrolling. Update the menu items icons from generic orange star SVGs to distinct, color-accented Lucide icons.

---

## 1. Intro Layout Adjustments (`src/layouts/Intro.vue`)

- **Hero Banner (`<lg` screens)**:
  - Change fixed/large height (`min-h-[45vh]`) to responsive auto padding (`py-5 sm:py-8 lg:min-h-svh`).
  - Scale profile avatar down on mobile from `w-40 h-40` to `w-24 h-24 sm:w-36 sm:h-36 lg:w-56 lg:h-56`.
  - Adjust edit profile badge sizing for small avatar viewports (`px-2 py-0.5 text-[10px]` on mobile).
  - Scale Arabic verse calligraphy font size to `text-2xl sm:text-3xl lg:text-5xl` with tight line height.
  - Scale verse translation text size to `text-xs sm:text-base lg:text-xl`.
  - Reduce section bottom margin (`mb-3` to `mb-2 sm:mb-3`).

- **Right Content Container (`<lg` screens)**:
  - Reduce vertical container padding from `p-6 md:p-10` to `p-4 sm:p-6 lg:p-10`.
  - Scale KontaQ mobile logo height down from `h-16` to `h-10 sm:h-12`.

---

## 2. Menu Items & Icon System (`src/pages/Home.vue`)

- **Menu Container & Buttons**:
  - Reduce button list spacing on mobile from `gap-4` to `gap-2.5 sm:gap-3.5`.
  - Adjust menu button padding from `py-4 px-6` to `py-2.5 px-4 sm:py-3.5 sm:px-6`.
  - Typography: `text-base sm:text-lg font-bold text-[#144227]`.

- **Icon System**:
  - Replace star SVG with color-accented circular pill icons (`w-9 h-9 flex items-center justify-center rounded-full shrink-0`):
    - **Tadabbur**: Lucide `BookOpen` with `bg-emerald-100 text-emerald-700`
    - **Kuis**: Lucide `Brain` with `bg-amber-100 text-amber-700`
    - **Evaluasi**: Lucide `ClipboardCheck` with `bg-teal-100 text-teal-700`
    - **Rapor**: Lucide `GraduationCap` with `bg-indigo-100 text-indigo-700`
    - **Infaq**: Lucide `HeartHandshake` with `bg-rose-100 text-rose-700`
  - Right arrow indicator: Lucide `ChevronRight` with `w-5 h-5 text-[#144227]` and smooth translation effect on hover.

---

## 3. Verification & Testing

- **Mobile Viewport Test**: Verify on simulated 375px x 667px (iPhone SE) and 390px x 844px (iPhone 12/13/14) that the page displays cleanly without vertical overflow.
- **Desktop Viewport Test**: Ensure `lg:col-span-7` and `lg:col-span-5` full-height 7:5 layout remains unaffected on desktop viewports (`>=1024px`).
- **Build Verification**: Run `npm run build` to verify Vue template compilation and Tailwind CSS v4 syntax.

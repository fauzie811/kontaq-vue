# Design Specification: Quiz & Evaluation Index Card Layout

**Date:** 2026-08-08  
**Topic:** Improve Quiz and Evaluation Index Pages Layout using Cards  

---

## 1. Objective
Redesign the Quiz (`src/pages/Quizzes.vue`) and Evaluation (`src/pages/Evaluations.vue`) index pages in KontaQ Vue from a standard single-container divide-y list into a modern, responsive grid of interactive cards. The new layout enhances visual hierarchy, scannability, status visibility, and responsive behavior across mobile, tablet, and desktop viewports.

---

## 2. Architecture & Component Structure

### 2.1 Container & Layout Updates
- **Width Limit:** Expand container max-width from `max-w-3xl` to `max-w-5xl` for optimal multi-column grid presentation.
- **Top Control Bar:** Place an item count summary (e.g. "Total X Kuis" / "Total X Evaluasi") on the left and the `CategoryPicker` filter on the right.
- **Grid Layout:** Replace the list container with a responsive grid (`grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6`).

### 2.2 Card Design & Content Hierarchy
Each item (Quiz or Evaluation) is rendered as a standalone flex column card:
- **Card Wrapper:** `bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all duration-200 p-5 flex flex-col justify-between group h-full`
- **Header:**
  - Left side: Duration badge with Lucide `Clock` icon and text (e.g. `15 menit`).
  - Right side: Status badge with corresponding status color ring & pill text:
    - *Selesai:* Emerald badge (`bg-emerald-50 text-emerald-700 ring-emerald-600/20`) with check icon.
    - *Sedang dikerjakan:* Amber badge (`bg-amber-50 text-amber-700 ring-amber-600/20`) with clock/progress icon.
    - *Belum dikerjakan:* Slate/gray badge (`bg-gray-50 text-gray-600 ring-gray-500/10`) with pending icon.
- **Body:**
  - Title: `text-base font-bold text-gray-900 group-hover:text-[#144227] transition-colors line-clamp-2 my-3`
  - Meta/Subtext: Context info (e.g. requirement badge if material read is needed).
- **Footer / Action:**
  - Full-width button at the bottom of the card (`w-full bg-[#144227] hover:bg-[#0f321d] text-white font-semibold rounded-xl py-2.5 px-4 text-sm flex items-center justify-center gap-2 transition-all shadow-xs`).
  - Button text: "Mulai", "Lanjutkan", or "Lihat hasil".
  - Behavior: For locked quizzes (`material_read` false), clicking triggers alert modal prompting user to read the material first.

### 2.3 Empty State & Pagination
- **Empty State:** When no items are available for a selected category, display a rounded card with a search/document icon and friendly notice ("Belum ada kuis/evaluasi untuk kategori ini").
- **Pagination:** Render the `Pagination` component cleanly below the card grid.

---

## 3. Scope of File Modifications
- `src/pages/Quizzes.vue`: Update template to responsive card grid layout, import Lucide icons (`Clock`, `CheckCircle2`, `PlayCircle`, `HelpCircle`, `Lock`, `FileText`), update grid styling.
- `src/pages/Evaluations.vue`: Update template to responsive card grid layout, import Lucide icons, update grid styling.

---

## 4. Verification & Testing Plan
1. Test responsiveness across mobile (`<640px`), tablet (`640px - 1024px`), and desktop (`>1024px`).
2. Verify category filter updates card list properly.
3. Test button actions:
   - "Mulai" / "Lanjutkan" / "Lihat hasil" links navigate to correct show route.
   - Unread material quiz action triggers alert modal correctly.
4. Verify pagination functions cleanly below the grid.

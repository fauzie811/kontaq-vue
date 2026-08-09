# Mobile-Friendly Infaq Screen Design Specification

## Overview
This specification details the responsive design and user interaction enhancements for the Infaq & Shodaqoh screen (`src/pages/Infaq.vue`) in KontaQ Vue. The objective is to deliver a mobile-first experience with smooth category switching via horizontal scrollable chips, a dedicated Bank Account Card with one-tap copy functionality for E-Learning infaq, and clean responsive layout adjustments for mobile viewports.

## User Interface & Interaction Requirements

### 1. Category Selection & Navigation Header
* **Desktop / Tablet (`sm:flex` or `>= 640px`)**:
  * Retains top pill navigation bar (`bg-[#e6e8e3] rounded-full p-2 flex items-center justify-between gap-2`).
  * Displays `Beranda` router link, active `Infaq & Shodaqoh` pill, and category dropdown menu (`ChevronUp` / `ChevronDown`).
* **Mobile (`< 640px`)**:
  * Desktop top pill container hidden (`hidden sm:flex`).
  * Displays a horizontal scrollable category chip bar (`flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 mb-6`):
    * **Jum'at 10** (`cat.id === 'jumat10'`)
    * **Operasional Dakwah** (`cat.id === 'operasional'`)
    * **E-Learning** (`cat.id === 'elearning'`)
  * **Active Chip Style**: `bg-[#144227] text-white font-bold shadow-sm rounded-full px-4 py-2 text-xs text-nowrap transition-all`.
  * **Inactive Chip Style**: `bg-white text-gray-700 font-medium hover:bg-gray-100 border border-gray-200/80 rounded-full px-4 py-2 text-xs text-nowrap transition-all`.

### 2. Category Details & Dedicated Bank Transfer Card
* **Jum'at 10 & Operasional Dakwah Categories**:
  * Displays category text in a styled card (`bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 text-gray-800 text-base sm:text-lg leading-relaxed`).
* **E-Learning Category**:
  * Displays infaq guideline text ("Minimal 50.090 dan maksimal tanpa batas...").
  * **Dedicated Bank Account Card**:
    * Container: `bg-emerald-900/5 border border-emerald-800/10 rounded-2xl p-4 sm:p-5 space-y-3`.
    * Bank info: Bank Syariah Indonesia (BSI), Account Number `3779444390`, Account Name `a.n Meyrinda Rahmawaty Hilipito QQ KontaQ`.
    * **One-Tap Copy Button**:
      * Minimum 44px touch target.
      * Includes clipboard icon (`Copy` / `Check`).
      * Tapping copies `3779444390` using `navigator.clipboard.writeText` and toggles state to **"Tersalin!"** with a green checkmark icon for 2 seconds.
  * **Kode 90 Callout Box**:
    * Styled alert banner (`bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-amber-900`).
    * Clear instructions regarding adding "Kode 90" to transfer amounts.
* **WhatsApp Confirmation Action**:
  * Styled action link button (`bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between`).
  * Direct link: `https://wa.me/6285345147157`.
  * Text: `Konfirmasi Infaq: 0853-4514-7157`.

### 3. QRIS Display Card & Responsive Layout
* **Grid Layout**:
  * Mobile (`< 768px`): Stacks text card and QRIS card vertically (`flex flex-col gap-6`).
  * Desktop (`>= 768px`): 2-column grid (`grid grid-cols-12 gap-8 items-start`).
* **QRIS Card**:
  * Sized responsively (`max-w-xs sm:max-w-sm w-full mx-auto bg-white p-5 sm:p-7 rounded-3xl shadow-lg border border-gray-100`).
  * Clear QR SVG pattern, footer brand metadata (`SATU QRIS UNTUK SEMUA`), and corner accent.

## Files Modified
* `src/pages/Infaq.vue`: Main implementation file.

## Verification & Testing
* Test responsive viewports on mobile (375px, 390px, 414px) and desktop (> 640px).
* Verify horizontal chip scroll and active state switching on mobile.
* Verify "Salin No. Rekening" button copies account number `3779444390` and displays temporary copied feedback.
* Verify WhatsApp link functionality.
* Run `npm run build` to confirm Vue compilation.

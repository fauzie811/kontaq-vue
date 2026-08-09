# Mobile-Friendly Infaq Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Infaq screen (`src/pages/Infaq.vue`) mobile-friendly with responsive horizontal category chips, a dedicated bank account card with one-tap copy functionality, and an optimized mobile grid layout.

**Architecture:** Update `Infaq.vue` with responsive conditional view structures (`sm:hidden` / `hidden sm:flex`), horizontal scrollable category chips for mobile, reactive state for bank account copying with instant user feedback, and a responsive grid layout.

**Tech Stack:** Vue 3 Composition API (`<script setup>`), Tailwind CSS v4, Lucide Vue icons (`Copy`, `Check`, `ChevronUp`, `ChevronDown`), `@vueuse/core`.

## Global Constraints
- Desktop pill header navigation remains unchanged for screens `>= 640px`.
- Mobile screens (`< 640px`) render horizontal scrollable category chips.
- Bank Account Number: `3779444390`.
- WhatsApp contact link: `https://wa.me/6285345147157`.

---

### Task 1: Responsive Category Chips Header in `src/pages/Infaq.vue`

**Files:**
- Modify: [`src/pages/Infaq.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/pages/Infaq.vue)

**Interfaces:**
- Consumes: `categories` array (`jumat10`, `operasional`, `elearning`), `selectedCategory` reactive ref.
- Produces: `selectCategory(cat)` function, responsive horizontal scrollable chips template for mobile viewports `< 640px`.

- [ ] **Step 1: Update `src/pages/Infaq.vue` template for Mobile & Desktop headers**

```vue
<!-- Desktop Navigation Tabs Pill Header (>= 640px) -->
<div class="hidden sm:flex bg-[#e6e8e3] rounded-full p-2 items-center justify-between gap-2 shadow-inner border border-gray-200/60 max-w-3xl mx-auto mb-8 sm:mb-14">
  <router-link
    :to="{ name: 'home' }"
    class="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-[#144227] font-bold text-sm sm:text-base hover:bg-white/50 transition-colors cursor-pointer"
  >
    Beranda
  </router-link>

  <div class="px-6 py-2.5 sm:px-8 sm:py-3 bg-white rounded-full text-[#144227] font-extrabold text-sm sm:text-base shadow-sm border border-emerald-100/50">
    Infaq &amp; Shodaqoh
  </div>

  <div class="relative" ref="dropdownRef">
    <button
      @click="isDropdownOpen = !isDropdownOpen"
      class="bg-white px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-[#144227] font-bold text-sm sm:text-base shadow-sm border border-emerald-100/50 flex items-center gap-3 cursor-pointer hover:bg-emerald-50/50 transition-colors"
    >
      <span>{{ selectedCategory.label }}</span>
      <div class="flex flex-col text-[#144227] -space-y-1">
        <ChevronUp class="w-3.5 h-3.5 stroke-[2.5]" />
        <ChevronDown class="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
    </button>

    <div
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
    >
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat)"
        :class="[
          selectedCategory.id === cat.id ? 'text-[#144227] font-bold bg-emerald-50' : 'text-gray-700 hover:bg-gray-50',
          'w-full text-left px-5 py-3 text-sm sm:text-base transition-colors cursor-pointer'
        ]"
      >
        {{ cat.label }}
      </button>
    </div>
  </div>
</div>

<!-- Mobile Category Horizontal Chips (< 640px) -->
<div class="sm:hidden mb-6">
  <div class="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 -mx-2 px-2 no-scrollbar scroll-smooth">
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="selectCategory(cat)"
      :class="[
        selectedCategory.id === cat.id
          ? 'bg-[#144227] text-white font-bold shadow-md ring-2 ring-[#144227]/20'
          : 'bg-white text-gray-700 font-medium hover:bg-gray-100 border border-gray-200/80 shadow-2xs',
        'px-4 py-2.5 rounded-full text-xs text-nowrap transition-all flex-shrink-0 cursor-pointer'
      ]"
    >
      {{ cat.label }}
    </button>
  </div>
</div>
```

- [ ] **Step 2: Verify category switching reactivity**

Ensure clicking any chip updates `selectedCategory` and switches content appropriately.

- [ ] **Step 3: Commit Task 1**

```bash
git add src/pages/Infaq.vue
git commit -m "feat(infaq): add horizontal category scrollable chips for mobile viewports"
```

---

### Task 2: Dedicated Bank Account Copy Card & Details in `src/pages/Infaq.vue`

**Files:**
- Modify: [`src/pages/Infaq.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/pages/Infaq.vue)

**Interfaces:**
- Consumes: Lucide icons `Copy`, `Check`.
- Produces: `isCopied` ref, `copyAccount()` helper method.

- [ ] **Step 1: Add Lucide `Copy` and `Check` imports and copy handler function in `<script setup>`**

```javascript
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-vue-next';

const isCopied = ref(false);
const accountNumber = '3779444390';

async function copyAccount() {
  try {
    await navigator.clipboard.writeText(accountNumber);
    isCopied.value = true;
    setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  } catch (e) {
    console.error('Failed to copy account number:', e);
  }
}
```

- [ ] **Step 2: Update content card and E-Learning Bank Details view in `<template>`**

```vue
<!-- Text content for E-Learning with highlighted bank details -->
<div v-else class="space-y-4 text-gray-800 text-base sm:text-lg leading-relaxed">
  <p>
    Infaq dan shodaqoh minimal <strong>Rp 50.090</strong> dan maksimal tanpa batas, untuk pengembangan tadabbur online learning berbasis web.
  </p>

  <!-- Dedicated Bank Account Card -->
  <div class="bg-emerald-900/5 border border-emerald-800/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs">
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-[#144227] text-white font-black text-xs flex items-center justify-center shadow-2xs">
          BSI
        </div>
        <span class="font-semibold text-gray-900 text-sm sm:text-base">Bank Syariah Indonesia</span>
      </div>
      <button
        @click="copyAccount"
        :class="[
          isCopied ? 'bg-emerald-700 text-white' : 'bg-white text-[#144227] hover:bg-emerald-50 border border-emerald-200/80',
          'px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer min-h-[38px]'
        ]"
      >
        <Check v-if="isCopied" class="w-3.5 h-3.5 stroke-[3]" />
        <Copy v-else class="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{{ isCopied ? 'Tersalin!' : 'Salin No. Rekening' }}</span>
      </button>
    </div>

    <div>
      <div class="text-xl sm:text-2xl font-extrabold text-[#144227] font-mono tracking-wider">
        3779 444 390
      </div>
      <div class="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
        a.n Meyrinda Rahmawaty Hilipito QQ KontaQ
      </div>
    </div>
  </div>

  <!-- Kode 90 Alert Banner -->
  <div class="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs sm:text-sm text-amber-900 leading-normal flex items-start gap-2.5">
    <span class="text-base font-bold">💡</span>
    <p>
      Tambahkan <strong>'Kode 90'</strong> diakhir nominal transfer (contoh: Rp 50.090). Bagi yang tidak menambahkan kode tersebut, infaq akan dialokasikan untuk operasional dakwah lainnya.
    </p>
  </div>
</div>
```

- [ ] **Step 3: Test copy functionality and toast status feedback**

Verify clicking "Salin No. Rekening" copies `3779444390` and temporarily toggles button state to "Tersalin!" for 2 seconds.

- [ ] **Step 4: Commit Task 2**

```bash
git add src/pages/Infaq.vue
git commit -m "feat(infaq): add dedicated bank transfer card with one-tap copy functionality"
```

---

### Task 3: Layout Spacing, Mobile Optimization & Verification

**Files:**
- Modify: [`src/pages/Infaq.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/pages/Infaq.vue)

**Interfaces:**
- Layout optimization: Adjust grid spacing, touch target sizes, mobile margins.

- [ ] **Step 1: Update main layout container grid and spacing in `Infaq.vue`**

Ensure mobile grid stacks gracefully with `gap-6 sm:gap-8` and clean container padding `px-3 sm:px-4 py-2 sm:py-6`.

- [ ] **Step 2: Run production build verification**

Run: `npm run build`
Expected: Zero compilation errors.

- [ ] **Step 3: Commit Task 3**

```bash
git add src/pages/Infaq.vue
git commit -m "style(infaq): refine mobile responsive spacing and grid layout"
```

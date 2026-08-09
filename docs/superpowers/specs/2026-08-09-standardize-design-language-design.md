# Design Specification: Standardizing Design Language Across KontaQ Vue

**Date:** 2026-08-09  
**Status:** Approved  
**Topic:** App-wide Design Language Standardization

---

## 1. Overview & Goals

KontaQ Vue is a Vue 3 application built with Tailwind CSS v4, Radix Vue, and custom components. Over time, styling across pages has accumulated hardcoded hex codes (e.g. `#144227`, `#1b4332`), custom inline color classes, varying card border radii, and divergent header and button styles.

This project standardizes the entire application under a **Hybrid KontaQ Design System**. It establishes clean CSS design tokens in `index.css`, refactors core UI component primitives in `src/components/ui/`, and migrates all layout and page components to use a cohesive, responsive, and dark-mode ready design language.

---

## 2. Design Architecture & Token System

### 2.1 CSS Variables & Design Tokens (`src/assets/index.css`)
- **Brand Colors (KontaQ Emerald):**
  - `--primary`: `142.1 76.2% 36.3%` (Emerald brand color / `#144227` accents)
  - `--primary-foreground`: `0 0% 100%` (White text on primary background)
  - `--secondary`: `142.1 25% 95%` (Muted emerald container background)
  - `--secondary-foreground`: `142.1 76.2% 20%` (Dark green text on secondary background)
- **Surface & Background Tokens:**
  - `--background`: Light mode `0 0% 98%` (Gray-50/white surface), Dark mode `220 20% 10%`
  - `--card`: Light mode `0 0% 100%` (White), Dark mode `220 18% 13%`
  - `--card-foreground`: Light mode `240 10% 3.9%`, Dark mode `0 0% 95%`
  - `--muted`: Light mode `240 4.8% 95.9%`, Dark mode `220 15% 18%`
  - `--muted-foreground`: Light mode `240 3.8% 46.1%`, Dark mode `240 5% 65%`
  - `--border`: Light mode `240 5.9% 90%`, Dark mode `240 3.7% 18%`
  - `--input`: Light mode `240 5.9% 90%`, Dark mode `240 3.7% 18%`
  - `--ring`: `142.1 76.2% 36.3%`
- **Border Radii:**
  - Standard base radius: `--radius: 0.75rem` (12px)
  - Card surfaces & containers: `rounded-2xl` (16px) or `rounded-3xl` (24px) for modals and hero banners.

### 2.2 Typography Standards
- **Primary Sans:** `font-sans` (`Raleway, sans-serif`) with structured size scale (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`).
- **Quran & Arabic Fonts:** `font-quran` (`LPMQ Isep Misbah`) and `font-arabic` (`Scheherazade New`) with explicit line-height (`leading-loose` / `2em`), RTL direction (`dir-rtl`), and letter-spacing reset.

---

## 3. UI Component Primitives (`src/components/ui/`)

1. **Button (`Button.vue`):**
   - Standardized variants (`default` emerald filled, `secondary` emerald muted/light, `outline` bordered, `destructive` red, `ghost`).
   - Standardized size scale (`sm`, `default`, `lg`, `icon`).
   - Smooth hover/active scaling micro-animations (`hover:scale-[1.02] active:scale-[0.98] transition-all`).

2. **Card System (`Card.vue`, `CardHeader.vue`, `CardTitle.vue`, `CardContent.vue`, `CardFooter.vue`):**
   - Unified card container using `bg-card text-card-foreground border border-border rounded-2xl shadow-xs hover:shadow-sm transition-all`.

3. **Input & Form Controls (`Input.vue`, `TextInput.vue`):**
   - Standardized inputs with `bg-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 text-foreground`.

4. **Page Header (`PageHeader.vue`):**
   - Unified subpage navigation header (title, subtitle, back action, right slot).

5. **Modal / Overlay Containers (`NotificationDrawer.vue`, Infaq/QRIS modals):**
   - Standardized backdrop (`bg-black/50 backdrop-blur-sm`), container radius (`rounded-3xl`), elevation (`shadow-2xl`), and entrance animations (`animate-in fade-in zoom-in-95`).

---

## 4. Application-Wide View Migration Plan

1. **Layouts (`Main.vue`, `Auth.vue`, `Quiz.vue`):**
   - Standardize top header navigation bar, search button, bell button, profile menu dropdown, and sticky bottom navigation bar.

2. **Core Pages & Feature Components:**
   - **`Home.vue`:** Standardize menu cards, icon containers, and modal dialogs.
   - **`Quran/` & `QuranVerseItem.vue`, `QuranAudioPlayer.vue`:** Standardize surah/juz list cards, audio toolbar, and verse action controls.
   - **`Quizzes/`, `Evaluations/`, `QuizScore.vue`, `EvaluationScore.vue`:** Standardize quiz cards, score pill badges, countdown timers, and result summaries.
   - **`Infaq.vue`, `Forum.vue`, `Profile.vue`, `Announcements/`, `Certificates.vue`, `Materials/`, `Reports.vue`, `Tadabbur.vue`, `Auth/`:** Remove arbitrary inline hex colors (`#144227`, `#1b4332`, custom inline styles) and adopt semantic Tailwind tokens (`bg-primary`, `text-primary`, `bg-card`, `border-border`, `text-muted-foreground`).

---

## 5. Verification & Testing

- **Build Check:** Run `npm run build` to verify zero compilation errors, missing imports, or invalid CSS variables.
- **Visual Audit:** Verify layout integrity, hover interactions, typography alignment, and light/dark theme consistency across all pages.

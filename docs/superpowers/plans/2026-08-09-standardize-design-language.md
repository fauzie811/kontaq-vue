# App-Wide Design Language Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the design language across KontaQ Vue by unifying HSL design tokens in CSS, refactoring UI component primitives, and migrating all layouts and pages to semantic design tokens.

**Architecture:** Centralize theme variables in `src/assets/index.css`, encapsulate styles in reusable primitives (`src/components/ui/`), and replace hardcoded hex codes (`#144227`, `#1b4332`, custom inline styles) across views with semantic tokens (`bg-primary`, `text-primary`, `bg-card`, `border-border`).

**Tech Stack:** Vue 3 (Options/Composition API), Vite, Tailwind CSS v4, Radix Vue, Lucide Vue Next.

## Global Constraints

- **Design System:** Hybrid KontaQ palette (Emerald Brand `--primary: 142.1 76.2% 36.3%`).
- **Cards & Modals:** Standardized border radius (`rounded-2xl` / `rounded-3xl`), border (`border-border`), and background (`bg-card`).
- **Typography:** `font-sans` for main UI, `font-quran` (`LPMQ Isep Misbah`) and `font-arabic` (`Scheherazade New`) for Quranic texts with `dir-rtl`.
- **Theme Parity:** All modified components must render correctly in both light and dark mode.

---

### Task 1: Standardize Design Tokens & Theme Variables

**Files:**
- Modify: `src/assets/index.css:1-210`

**Interfaces:**
- Consumes: Tailwind v4 theme directives (`@theme`, `@layer base`, `@custom-variant dark`).
- Produces: Standardized HSL variables for `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`, `--radius`.

- [ ] **Step 1: Update HSL color tokens and radii in `src/assets/index.css`**

Add/update the HSL variables under `:root` and `.dark` layers:

```css
@layer base {
  :root {
    --background: 0 0% 98%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 0 0% 100%;

    --secondary: 142.1 25% 95%;
    --secondary-foreground: 142.1 76.2% 20%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --accent: 142.1 30% 94%;
    --accent-foreground: 142.1 76.2% 20%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 142.1 76.2% 36.3%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 220 20% 10%;
    --foreground: 0 0% 95%;

    --card: 220 18% 13%;
    --card-foreground: 0 0% 95%;

    --popover: 220 18% 13%;
    --popover-foreground: 0 0% 95%;

    --primary: 142.1 70.6% 45.3%;
    --primary-foreground: 0 0% 100%;

    --secondary: 142.1 20% 18%;
    --secondary-foreground: 142.1 50% 90%;

    --muted: 220 15% 18%;
    --muted-foreground: 240 5% 65%;

    --accent: 142.1 20% 18%;
    --accent-foreground: 142.1 50% 90%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 85.7% 97.3%;

    --border: 240 3.7% 18%;
    --input: 240 3.7% 18%;
    --ring: 142.4 71.8% 45.3%;
  }
}
```

- [ ] **Step 2: Verify Vite builds CSS correctly**

Run: `npm run build`
Expected: Build succeeds without CSS parsing errors.

- [ ] **Step 3: Commit design token changes**

```bash
git add src/assets/index.css
git commit -m "style: standardize HSL design tokens and radii in index.css"
```

---

### Task 2: Refactor UI Component Primitives

**Files:**
- Modify: `src/components/ui/button/Button.vue`
- Modify: `src/components/ui/button/index.js`
- Modify: `src/components/ui/card/Card.vue`
- Modify: `src/components/ui/input/Input.vue`
- Modify: `src/components/TextInput.vue`
- Modify: `src/components/PageHeader.vue`

**Interfaces:**
- Consumes: CVA (`class-variance-authority`), `cn` utility in `src/lib/utils.js`.
- Produces: Standardized `<Button />`, `<Card />`, `<Input />`, `<TextInput />`, and `<PageHeader />` components.

- [ ] **Step 1: Standardize `Button.vue` and button variants in `src/components/ui/button/index.js`**

Update button variants in `src/components/ui/button/index.js` to include micro-animations and brand tokens:

```javascript
export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-2xl px-6 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)
```

- [ ] **Step 2: Standardize `Card.vue` in `src/components/ui/card/Card.vue`**

Ensure `Card.vue` uses `bg-card text-card-foreground border border-border rounded-2xl shadow-xs transition-all duration-200`.

- [ ] **Step 3: Standardize `Input.vue` & `TextInput.vue`**

Ensure input components use `bg-background text-foreground border border-input rounded-xl focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground`.

- [ ] **Step 4: Standardize `PageHeader.vue`**

Ensure `PageHeader.vue` uses standardized typography (`text-foreground`, `text-muted-foreground`), back button styling (`bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full`), and spacing.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: Build succeeds cleanly.

- [ ] **Step 6: Commit UI primitives refactoring**

```bash
git add src/components/ui/ src/components/TextInput.vue src/components/PageHeader.vue
git commit -m "style: refactor UI primitives to use standardized design tokens"
```

---

### Task 3: Standardize Main Layout & Navigation Components

**Files:**
- Modify: `src/layouts/Main.vue`
- Modify: `src/components/Sidebar.vue`
- Modify: `src/components/NotificationDrawer.vue`
- Modify: `src/components/UserMenu.vue`

**Interfaces:**
- Consumes: `<router-link>`, Lucide icons, `authStore`.
- Produces: Standardized main header, drawer menus, and bottom mobile navigation bar.

- [ ] **Step 1: Refactor `src/layouts/Main.vue`**

Replace hardcoded `#144227` / `#1b4332` / `bg-emerald-*` with semantic tokens:
- Header background: `bg-card border-b border-border shadow-xs`
- Header icon buttons (Search, Notification, Profile): `w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition shadow-xs border border-border`
- Bottom Navigation Bar: `bg-card/95 backdrop-blur-md border-t border-border shadow-lg` with active indicators `text-primary bg-primary/10 rounded-2xl`.

- [ ] **Step 2: Refactor `NotificationDrawer.vue` & `UserMenu.vue`**

Standardize dropdown/drawer panels to use `bg-card border border-border rounded-2xl shadow-xl animate-in fade-in zoom-in-95`.

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS with 0 errors.

- [ ] **Step 4: Commit Layout changes**

```bash
git add src/layouts/Main.vue src/components/NotificationDrawer.vue src/components/UserMenu.vue src/components/Sidebar.vue
git commit -m "style: standardize Main layout and navigation components"
```

---

### Task 4: Standardize Home Page & Modals

**Files:**
- Modify: `src/pages/Home.vue`

**Interfaces:**
- Consumes: Menu routes, Infaq & QRIS modal states.
- Produces: Standardized Home navigation list and modal popups.

- [ ] **Step 1: Refactor `src/pages/Home.vue`**

- Menu list items: replace `border-[#1b4332] text-[#144227]` with `border-2 border-primary/20 bg-card hover:bg-secondary/50 text-foreground hover:border-primary/40 rounded-full shadow-xs transition-all duration-200`.
- Infaq & QRIS Modals: update modal container to `bg-card rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200`.
- Primary actions: use `bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full`.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 3: Commit Home page changes**

```bash
git add src/pages/Home.vue
git commit -m "style: standardize Home page menu cards and modal popups"
```

---

### Task 5: Standardize Quran Pages & Components

**Files:**
- Modify: `src/pages/Quran/Show.vue`
- Modify: `src/components/QuranVerseItem.vue`
- Modify: `src/components/QuranAudioPlayer.vue`

**Interfaces:**
- Consumes: `surah` data, `audioPlayerStore`, `font-quran`, `font-arabic`.
- Produces: Standardized Quran surah view, verse items, and sticky audio player toolbar.

- [ ] **Step 1: Refactor `src/components/QuranVerseItem.vue`**

- Card container: `bg-card text-card-foreground border border-border/70 rounded-2xl p-4 sm:p-6 shadow-xs hover:border-primary/30 transition-all`.
- Verse number badge: `w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-bold flex items-center justify-center`.
- Verse actions dropdown & action buttons: `bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg`.

- [ ] **Step 2: Refactor `src/components/QuranAudioPlayer.vue`**

- Player floating toolbar: `bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-2xl sm:rounded-full p-3 sm:px-6`.
- Controls & progress slider: standard emerald active indicators (`bg-primary text-primary-foreground`).

- [ ] **Step 3: Refactor `src/pages/Quran/Show.vue`**

- Header banner & search filter inputs: `bg-card border border-border rounded-2xl p-4 sm:p-6`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Commit Quran components changes**

```bash
git add src/pages/Quran/Show.vue src/components/QuranVerseItem.vue src/components/QuranAudioPlayer.vue
git commit -m "style: standardize Quran views, verse items, and audio player player toolbar"
```

---

### Task 6: Standardize Quizzes, Evaluations, Infaq, Forum & Supporting Pages

**Files:**
- Modify: `src/pages/Quizzes.vue`
- Modify: `src/pages/Evaluations.vue`
- Modify: `src/pages/Infaq.vue`
- Modify: `src/pages/Forum.vue`
- Modify: `src/pages/Profile.vue`
- Modify: `src/pages/Announcements.vue`
- Modify: `src/pages/Certificates.vue`
- Modify: `src/pages/Materials.vue`
- Modify: `src/pages/Reports.vue`
- Modify: `src/pages/Tadabbur.vue`
- Modify: `src/components/CategoryPicker.vue`
- Modify: `src/components/SortPicker.vue`
- Modify: `src/components/Pagination.vue`

**Interfaces:**
- Consumes: Router pages, filter pickers, pagination controls.
- Produces: Cohesive styling across all remaining application pages.

- [ ] **Step 1: Refactor filter pickers & pagination**

- `CategoryPicker.vue` / `SortPicker.vue` / `PartPicker.vue`: active state `bg-primary text-primary-foreground rounded-xl`, inactive state `bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-xl`.
- `Pagination.vue`: active page `bg-primary text-primary-foreground rounded-lg`, inactive `bg-secondary text-secondary-foreground hover:bg-secondary/80`.

- [ ] **Step 2: Refactor Quizzes, Evaluations, Infaq, Forum, Profile & Subpages**

Replace custom inline hex colors and raw emerald/gray classes across card containers, form fields, tab headers, and button triggers with semantic tokens (`bg-card`, `border-border`, `bg-primary`, `bg-secondary`, `text-muted-foreground`).

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Commit page standardization changes**

```bash
git add src/pages/ src/components/
git commit -m "style: standardize Quizzes, Infaq, Forum, Profile, and utility components"
```

---

### Task 7: Full Application Build Verification & Quality Check

**Files:**
- Inspect: build output and git status

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with 0 errors.

- [ ] **Step 2: Run git status check**

Run: `git status`
Expected: Working tree clean.

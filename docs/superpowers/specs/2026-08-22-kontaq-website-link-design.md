# Design Specification: Main KontaQ Website Link Integration

## Overview
Add direct, accessible, and context-aware links to the main KontaQ organizational website (`https://kontaq.org`) across key touchpoints in the application for both authenticated members and guest visitors.

## Target Placements

### 1. User Profile Menu Dropdown (`src/layouts/Main.vue` & `src/components/UserMenu.vue`)
- **Location**: Inside the user profile dropdown panel in the top header, positioned after "Pusat Bantuan / FAQ" and before the divider prior to "Keluar".
- **Visual Design**:
  - Left Icon: `Globe` icon (`lucide-vue-next`).
  - Label: `Website Resmi (kontaq.org)`.
  - Right Icon: `ExternalLink` indicator icon (subtle, muted foreground).
  - Hover & Active States: Consistent with existing menu items (`hover:bg-secondary hover:text-primary`).
- **Behavior**:
  - Opens `https://kontaq.org` in a new browser tab (`target="_blank" rel="noopener noreferrer"`).
  - Automatically closes the user dropdown menu when clicked.

### 2. Help & FAQ Page (`src/pages/Help.vue`)
- **Location**: In the bottom support callout card ("Masih butuh bantuan lain?").
- **Visual Design**:
  - Secondary action button: `Kunjungi kontaq.org` with `Globe` / `ExternalLink` icon.
  - Placed side-by-side with the existing `Tanya di Forum Ukhuwah` button on desktop, stacked appropriately on mobile.
- **Behavior**:
  - Opens `https://kontaq.org` in a new tab (`target="_blank" rel="noopener noreferrer"`).

### 3. Auth Layout (`src/layouts/Auth.vue`)
- **Location**:
  - **Desktop**: In the left hero panel footer alongside the copyright notice.
  - **Mobile**: In the bottom footer beneath the login / register forms.
- **Visual Design**:
  - Text format: `&copy; Komunitas Tadabbur Al-Qur'an (KontaQ) · <a href="https://kontaq.org" ...>kontaq.org</a>`.
  - Styling: Underlined or subtle link color matching the theme with hover transitions (`hover:text-white` on desktop hero, `hover:text-primary` on mobile).
- **Behavior**:
  - Opens `https://kontaq.org` in a new tab (`target="_blank" rel="noopener noreferrer"`).

## Non-Functional Requirements & Polish
- Valid HTML semantics (`<a>` with `target="_blank"` and `rel="noopener noreferrer"`).
- Accessible touch targets (minimum 44px where applicable).
- Responsive layout across mobile, tablet, and desktop viewports.
- All unit tests and Vitest suite pass without regressions.

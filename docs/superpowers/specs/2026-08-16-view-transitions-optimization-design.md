# View Transitions Optimization & Fixed Element Isolation Design Spec

## Overview
This specification details the architecture and styling updates required to optimize the Single Page Application (SPA) View Transitions in KontaQ Vue, preventing visual overlapping of fixed/sticky elements (header, desktop nav tabs, mobile bottom navigation, floating infaq banner, persistent audio player) and eliminating layout distortion across layout switches.

---

## Architecture & Stacking Context

### View Transition Groups Hierarchy
All persistent and fixed interface components are assigned explicit `view-transition-name` identifiers to separate them from the general `root` snapshot. A strict `z-index` stacking order is established on the pseudo-element tree:

| Element | View Transition Name | Stacking Layer (`z-index`) | Behavior |
| :--- | :--- | :--- | :--- |
| Background / Page Shell | `root` | 0 | Static snapshot (`animation: none`) |
| Dynamic Route Slot | `page-content` | 1 | Animated (fade/slide, `overflow: clip`) |
| Desktop Nav Pill Container | `app-nav` | 10 | Static / cross-layout persistent |
| Sticky Top Header | `app-header` | 20 | Static / pinned top |
| Mobile Bottom Navigation | `app-bottom-nav` | 30 | Static / pinned bottom |
| Floating Infaq Banner | `app-floating-banner` | 35 | Fixed / floating above bottom nav |
| Persistent Quran Audio Player | `app-audio-player` | 40 | Highest priority pinned layer |

---

## Layout & Component Scoping

### 1. `src/layouts/Main.vue`
- Apply `view-transition-header` (`view-transition-name: app-header`) to `<header>`.
- Apply `view-transition-nav` (`view-transition-name: app-nav`) to `<section v-if="route.name !== 'infaq'">`.
- Maintain `view-transition-content` (`view-transition-name: page-content`) on `<main>`.
- Apply `view-transition-floating-banner` (`view-transition-name: app-floating-banner`) to `<footer v-if="isBannerVisible">`.
- Apply `view-transition-bottom-nav` (`view-transition-name: app-bottom-nav`) to `<nav v-if="route.name !== 'infaq'">`.

### 2. `src/layouts/Intro.vue` & `src/layouts/Auth.vue`
- Remove `.view-transition-content` from the outer `<main>` layout grid.
- Apply `.view-transition-content` specifically to the dynamic `<slot />` container. This ensures that `page-content` bounding boxes remain consistent when navigating between Intro/Auth views and Main layout views.

### 3. `src/layouts/Quiz.vue`
- Apply `view-transition-header` (`view-transition-name: app-header`) to the sticky top bar.
- Maintain `view-transition-content` on the main slot wrapper.

### 4. `src/components/QuranAudioPlayer.vue`
- Apply `view-transition-audio-player` (`view-transition-name: app-audio-player`) to the floating audio container.

---

## CSS Rules & Motion Curves

### 1. Animation Parameters in `src/assets/index.css`
- **Slide Distance**: `16px` for subtle, fluid transitions without layout distortion.
- **Timing Functions**:
  - Outgoing animation (`::view-transition-old(page-content)`): `180ms cubic-bezier(0.4, 0, 1, 1)`
  - Incoming animation (`::view-transition-new(page-content)`): `220ms cubic-bezier(0, 0, 0.2, 1)`
- **Clipping**:
  ```css
  ::view-transition-group(page-content) {
    z-index: 1;
    overflow: clip;
  }
  ```

### 2. Directional Keyframes
- **Default (Non-directional / standard)**: Subtle scale (`0.99` to `1`) and opacity fade.
- **Forward Navigation** (`:active-view-transition-type(forward)`):
  - Old page: `transform: translateX(-16px); opacity: 0;`
  - New page: `transform: translateX(16px)` to `translateX(0); opacity: 1;`
- **Backward Navigation** (`:active-view-transition-type(backward)`):
  - Old page: `transform: translateX(16px); opacity: 0;`
  - New page: `transform: translateX(-16px)` to `translateX(0); opacity: 1;`

### 3. Accessibility & Reduced Motion
- Disable all animations across all named transition groups (`root`, `page-content`, `app-header`, `app-nav`, `app-bottom-nav`, `app-floating-banner`, `app-audio-player`) when `prefers-reduced-motion: reduce` is detected.

---

## Verification Plan

1. **Build & Lint Verification**:
   - Run `npm run build` to verify clean compilation of CSS and Vue components.
2. **Navigation Flow Testing**:
   - Main -> Detail (Forward transition): Verify content slides smoothly beneath the sticky header and bottom nav without painting over them.
   - Detail -> Main (Backward transition): Verify content slides smoothly in reverse.
   - Intro / Home -> Main (Layout switch): Verify content transitions smoothly without full-screen box warping.
   - Audio Player active: Verify audio player remains pinned and uninterrupted during route changes.
3. **Accessibility**:
   - Test with `prefers-reduced-motion` enabled to confirm animations gracefully deactivate.

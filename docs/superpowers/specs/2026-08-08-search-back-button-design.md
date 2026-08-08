# Design Spec: Search Sheet/Dialog Back Button Dismissal

**Date**: 2026-08-08  
**Status**: Approved  
**Target File**: [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue)

---

## 1. Objective
Ensure that pressing the browser back button or triggering a mobile back gesture while the search sheet/dialog is open closes the search overlay instead of navigating away from the current page.

---

## 2. Background
In `src/layouts/Main.vue`, opening the search sheet/dialog updates the reactive `isSearchOpen` state to `true`. Currently, opening the search modal does not push an entry to browser history. As a result, when a user triggers back navigation (mobile gesture or browser back button), the application navigates to the previous page instead of dismissing the search overlay.

---

## 3. Detailed Architecture & Design

### 3.1 Reactive State & Listeners
- **`isPushedState` (`ref(false)`)**: Tracks whether a dummy history state entry (`{ searchModal: true }`) has been pushed to the browser history stack for the search overlay.
- **`onPopState` Listener**: Handles `popstate` window events. When triggered while `isSearchOpen` is `true`, it resets `isPushedState.value = false` and sets `isSearchOpen.value = false` without navigating back in application history.

### 3.2 Watcher Logic on `isSearchOpen`
When `isSearchOpen` changes:
- **`open === true`**:
  1. Lock body scrolling (mobile `< sm`).
  2. Push history state: `window.history.pushState({ searchModal: true }, '')`.
  3. Set `isPushedState.value = true`.
  4. Attach event listener: `window.addEventListener('popstate', onPopState)`.
- **`open === false`**:
  1. Restore body scrolling.
  2. Detach event listener: `window.removeEventListener('popstate', onPopState)`.
  3. If `isPushedState.value === true` (indicating search was closed manually via UI controls, escape key, or backdrop click rather than history popstate):
     - Reset `isPushedState.value = false`.
     - Execute `window.history.back()` to pop the temporary search history entry.

### 3.3 Search Result Navigation Handlers
In `selectSurah`, `selectVerse`, and `selectMaterial`:
1. Set `isPushedState.value = false` prior to closing search.
2. Set `isSearchOpen.value = false` and clear `searchQuery`.
3. Call `router.push(...)` to navigate to the selected item.
*Note*: By setting `isPushedState.value = false` before closing `isSearchOpen`, the watcher does not trigger `window.history.back()`, allowing `router.push` to overwrite/replace the history stack entry cleanly (`[CurrentPage] -> [SelectedItemPage]`).

### 3.4 Component Lifecycle Cleanup
In `onUnmounted`:
- Detach `popstate` event listener if active.
- Clean up history state if unmounted while `isPushedState` is `true`.

---

## 4. Behavior Matrix

| Action | Result | Browser History Stack |
| :--- | :--- | :--- |
| **Open Search** | Search drawer/dialog opens | Entry `{ searchModal: true }` pushed |
| **Press Back Button** | Search closes | Dummy state popped; user stays on current page |
| **Click Backdrop / X / Esc** | Search closes | Dummy state popped via `history.back()`; user stays on current page |
| **Select Search Result** | Search closes & navigates to item | Entry replaced with target route (`[PageA] -> [PageB]`) |

---

## 5. Verification Plan
1. Open search modal on desktop/mobile viewport. Press Esc key or click Backdrop -> verify search closes and back history is preserved.
2. Open search modal, click browser back button -> verify search closes and page remains unchanged.
3. Open search modal, select a search result (Surah/Verse) -> verify app navigates to target page, and pressing back button from target page returns to original page.

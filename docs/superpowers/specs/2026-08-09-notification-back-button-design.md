# Design Spec: Notification Sheet/Drawer Back Button Dismissal

**Date**: 2026-08-09  
**Status**: Approved  
**Target File**: [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue)

---

## 1. Objective
Ensure that pressing the browser back button or triggering a mobile back gesture while the notification sheet/drawer is open closes the notification overlay instead of navigating away from the current page.

---

## 2. Background
In `src/layouts/Main.vue`, opening notifications toggles `isNotificationOpen` to `true`. Previously, opening notifications did not add a entry to browser history, causing back gestures or back button clicks to navigate to the preceding page rather than dismissing the drawer.

---

## 3. Detailed Architecture & Design

### 3.1 Reactive State & Handlers
- **`isNotificationPushedState` (`ref(false)`)**: Tracks whether a dummy history state entry (`{ notificationModal: true }`) was pushed for the notification overlay.
- **`onNotificationPopState` Event Handler**: Handles `popstate` events. When fired while `isNotificationOpen` is `true`, it sets `isNotificationPushedState.value = false` and `isNotificationOpen.value = false`.

### 3.2 Watcher Logic on `isNotificationOpen`
When `isNotificationOpen` changes:
- **`open === true`**:
  1. Close user menu if open (`isUserMenuOpen.value = false`).
  2. Push history state: `window.history.pushState({ notificationModal: true }, '')`.
  3. Set `isNotificationPushedState.value = true`.
  4. Attach event listener: `window.addEventListener('popstate', onNotificationPopState)`.
- **`open === false`**:
  1. Detach event listener: `window.removeEventListener('popstate', onNotificationPopState)`.
  2. If `isNotificationPushedState.value === true` (indicating notification drawer was closed manually via close button, backdrop click, or click outside):
     - Reset `isNotificationPushedState.value = false`.
     - Execute `window.history.back()` to pop the temporary history entry.

### 3.3 Navigation Handlers
In `clickNotification(notif)`:
1. Set `isNotificationPushedState.value = false` prior to setting `isNotificationOpen.value = false`.
2. Perform route navigation (`router.push(...)`).

### 3.4 Lifecycle Cleanup
In `onUnmounted`:
- Detach `onNotificationPopState` event listener if active.

---

## 4. Verification Plan
1. Open notification drawer on mobile/desktop viewport, click backdrop or close button -> verify drawer closes and browser history remains consistent.
2. Open notification drawer, press browser back button or swipe back -> verify drawer closes and page remains unchanged.
3. Open notification drawer, click a notification item -> verify app navigates to announcement page and history navigation behaves normally.

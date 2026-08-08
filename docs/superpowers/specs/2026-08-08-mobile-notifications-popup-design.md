# Design Spec: Mobile Notification Bottom Sheet & Desktop Dropdown

Date: 2026-08-08  
Status: Approved  

## Overview
This document specifies the design for upgrading the notification popover in Kontaq Vue from a basic desktop-style dropdown into a responsive dual-mode notification drawer:
- **Mobile (`< sm` screen width)**: A touch-friendly Mobile Bottom Sheet drawer with semi-transparent backdrop, grab handle, rounded top corners, smooth slide-up animation, body scroll locking, and light-dismiss backdrop control.
- **Desktop (`sm:` screen width and up)**: An absolute-positioned anchored dropdown under the bell button in the top navigation bar.

## Component Architecture

A new component `src/components/NotificationDrawer.vue` will encapsulate notification drawer state and rendering logic.

### Properties & Interfaces
- **`isOpen`** (Boolean, required): Indicates whether the notification container is visible.
- **`notifications`** (Array, default: `[]`): Formatted notification objects:
  ```ts
  interface NotificationItem {
    id: number | string;
    isSticky: boolean;
    title: string;
    desc: string;
    time: string;
    route?: object;
    action?: string;
  }
  ```

### Events
- **`@close`**: Emitted when the user taps backdrop, clicks the close button, or navigates away.
- **`@select`**: Emitted when a notification item is tapped, passing `(notif: NotificationItem)`.

## Mobile Bottom Sheet Specifications (`< sm` viewports)

1. **Teleport & Backdrop**:
   - Teleports to `body` when rendered on mobile screens (`< sm`).
   - Dark translucent backdrop (`bg-black/40 backdrop-blur-xs`) overlay covering the entire viewport (`fixed inset-0 z-50`).
   - Tapping the backdrop or pressing `Esc` emits `@close`.

2. **Sheet Card**:
   - Container fixed to the bottom edge (`fixed bottom-0 inset-x-0 bg-white rounded-t-3xl border-t border-gray-100 shadow-2xl z-50 max-h-[85vh] flex flex-col overflow-hidden`).
   - Slide-up animation using CSS transitions / Vue `<Transition name="slide-up">`.

3. **Grab Handle & Header**:
   - Visual grab handle (`w-12 h-1.5 bg-gray-300 rounded-full my-2.5 mx-auto`) at the top of the sheet.
   - Header with notification title, bell icon, "X Baru" emerald badge, and an explicit close icon button (`X`) for accessibility.

4. **Notification List**:
   - Scrollable area (`overflow-y-auto max-h-[55vh] px-4 py-2 divide-y divide-gray-100 text-sm`).
   - Pin icon for sticky items, Bell icon for normal items.
   - Empty state illustration/message when `notifications` array is empty.

5. **Footer**:
   - Direct link to all announcements route (`router-link :to="{ name: 'announcements' }"`).
   - High-contrast emerald hover/active state (`bg-emerald-50 text-emerald-800 font-bold py-3 text-center block border-t border-emerald-100`).

6. **Body Scroll Lock**:
   - When opened on mobile viewports, `document.body.style.overflow = 'hidden'` is applied to prevent background scroll leaking.
   - Restores normal scrolling when closed or component unmounts.

## Desktop Dropdown Specifications (`sm:` viewports)

1. Anchored under the bell menu button container in `src/layouts/Main.vue`.
2. Standard popover panel (`absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50`).
3. Uses `@click-outside` handle on parent container to automatically dismiss when clicking off the dropdown.

## Verification & Testing Plan

1. **Mobile Viewport Verification**:
   - Test on screen sizes `< 640px` (e.g. 375px / 390px / 412px).
   - Verify sheet slides up from bottom and backdrop fills full screen.
   - Confirm tapping backdrop or close icon closes the bottom sheet.
   - Confirm body scrolling is locked while bottom sheet is open.
   - Confirm selecting a notification navigates properly and closes sheet.

2. **Desktop Viewport Verification**:
   - Test on screen sizes `>= 640px`.
   - Verify notification menu opens as dropdown aligned right under bell icon.
   - Confirm clicking outside menu closes the dropdown.

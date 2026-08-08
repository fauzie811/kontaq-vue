# Notification Sheet/Drawer Back Button Dismissal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the notification sheet/drawer when pressing the browser back button or triggering a back gesture, preserving current page state.

**Architecture:** Integrate browser `history.pushState` and `popstate` event listening for `isNotificationOpen` state in `src/layouts/Main.vue`.

**Tech Stack:** Vue 3 (Composition API), Vue Router 4, Browser History API.

## Global Constraints
- Target file: `src/layouts/Main.vue`
- Preserve existing notification toggle and selection behaviors.
- Ensure no broken navigation or dangling state when selecting notification items or closing manually.

---

### Task 1: Implement Notification History State & Back Button Handling

**Files:**
- Modify: [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue)

**Interfaces:**
- Consumes: Vue 3 `ref`, `watch`, `onUnmounted`
- Produces: `isNotificationPushedState` ref, `onNotificationPopState` event handler, `watch(isNotificationOpen)`, updated `clickNotification`, updated `onUnmounted`.

- [ ] **Step 1: Add `isNotificationPushedState` ref & `onNotificationPopState` handler**

Near line 680 in [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue), define `isNotificationPushedState` and `onNotificationPopState`:

```javascript
const isNotificationOpen = ref(false);
const isNotificationPushedState = ref(false);

function onNotificationPopState() {
  if (isNotificationOpen.value) {
    isNotificationPushedState.value = false;
    isNotificationOpen.value = false;
  }
}
```

- [ ] **Step 2: Add `watch(isNotificationOpen)` for history state & listener management**

Below `onNotificationPopState` in [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue), add the watcher:

```javascript
watch(isNotificationOpen, (open) => {
  if (open) {
    isUserMenuOpen.value = false;
    if (typeof window !== 'undefined') {
      window.history.pushState({ notificationModal: true }, '');
      isNotificationPushedState.value = true;
      window.addEventListener('popstate', onNotificationPopState);
    }
  } else {
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', onNotificationPopState);
      if (isNotificationPushedState.value) {
        isNotificationPushedState.value = false;
        window.history.back();
      }
    }
  }
});
```

- [ ] **Step 3: Update `clickNotification` and `onUnmounted` cleanup**

Update `clickNotification` and `onUnmounted` in [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue):

```javascript
function clickNotification(notif) {
  isNotificationPushedState.value = false;
  isNotificationOpen.value = false;
  if (notif.action === 'infaq') {
    router.push({ name: 'infaq' });
  } else if (notif.route) {
    router.push(notif.route);
  }
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', onPopState);
    window.removeEventListener('popstate', onNotificationPopState);
  }
});
```

- [ ] **Step 4: Verify build**

Run: `npm run build` to confirm zero syntax or build errors.

- [ ] **Step 5: Commit changes**

```bash
git add src/layouts/Main.vue
git commit -m "feat: close notification modal/sheet on back button click"
```

# Search Sheet/Dialog Back Button Dismissal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the search sheet/dialog when pressing the back button or triggering a back gesture, keeping history clean and preserving the current page.

**Architecture:** Integrate browser `history.pushState` and `popstate` event listening inside `src/layouts/Main.vue` state lifecycle when `isSearchOpen` opens and closes.

**Tech Stack:** Vue 3 (Composition API), Vue Router 4, Browser History API.

## Global Constraints
- Target file: `src/layouts/Main.vue`
- Preserve existing search input focus and body scroll lock behaviors.
- Ensure no broken navigation or dangling state when selecting search results or closing manually.

---

### Task 1: Implement Search History State & Back Button Handling

**Files:**
- Modify: [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue)

**Interfaces:**
- Consumes: Vue 3 `ref`, `watch`, `nextTick`, `onUnmounted`
- Produces: `isPushedState` ref, `onPopState` event listener, updated `isSearchOpen` watcher, and result selection handlers.

- [ ] **Step 1: Update Vue imports in `Main.vue`**

Add `onUnmounted` to the Vue imports at line 642 of [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue):

```javascript
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
```

- [ ] **Step 2: Add `isPushedState` ref and `onPopState` handler**

Near line 671 of [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue), define `isPushedState` and `onPopState`:

```javascript
const isSearchOpen = ref(false);
const isPushedState = ref(false);

function onPopState() {
  if (isSearchOpen.value) {
    isPushedState.value = false;
    isSearchOpen.value = false;
  }
}
```

- [ ] **Step 3: Update `watch(isSearchOpen)` to manage history state & popstate listener**

Replace lines 710-729 in [`src/layouts/Main.vue`](file:///Users/fauzie/Projects/kontaq-vue/src/layouts/Main.vue) with:

```javascript
watch(isSearchOpen, (open) => {
  if (open) {
    isUserMenuOpen.value = false;
    isNotificationOpen.value = false;
    if (typeof window !== 'undefined') {
      window.history.pushState({ searchModal: true }, '');
      isPushedState.value = true;
      window.addEventListener('popstate', onPopState);
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
    }
    nextTick(() => {
      if (typeof window !== 'undefined' && window.innerWidth < 640 && mobileSearchInputRef.value) {
        mobileSearchInputRef.value.focus();
      } else if (searchInputRef.value) {
        searchInputRef.value.focus();
      }
    });
  } else {
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
      window.removeEventListener('popstate', onPopState);
      if (isPushedState.value) {
        isPushedState.value = false;
        window.history.back();
      }
    }
  }
});
```

- [ ] **Step 4: Update selection handlers & add `onUnmounted` hook**

Update `selectSurah`, `selectVerse`, and `selectMaterial` (lines 773-789) to reset `isPushedState.value = false` before closing search so `router.push` cleanly navigates. Add `onUnmounted` hook:

```javascript
function selectSurah(surah) {
  isPushedState.value = false;
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'quran.show', params: { chapter: surah.number } });
}

function selectVerse(verse) {
  isPushedState.value = false;
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'quran.show', params: { chapter: verse.chapter } });
}

function selectMaterial(material) {
  isPushedState.value = false;
  isSearchOpen.value = false;
  searchQuery.value = '';
  router.push({ name: 'materials.show', params: { id: material.id } });
}

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('popstate', onPopState);
  }
});
```

- [ ] **Step 5: Verify build / check for syntax errors**

Run: `npm run build` or dev check to confirm no linting/build errors.

- [ ] **Step 6: Commit changes**

```bash
git add src/layouts/Main.vue
git commit -m "feat: close search modal/sheet on back button click"
```

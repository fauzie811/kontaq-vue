# KontaQ Main Website Link Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add direct, accessible, and context-aware external links to the main KontaQ website (`https://kontaq.org`) across the User Profile Menu (`Main.vue` / `UserMenu.vue`), Help & FAQ page (`Help.vue`), and Auth layout (`Auth.vue`).

**Architecture:** Integrate external anchor elements (`<a href="https://kontaq.org" target="_blank" rel="noopener noreferrer">`) with Lucide icons (`Globe`, `ExternalLink`) styled consistently using existing Tailwind CSS utility classes and design tokens.

**Tech Stack:** Vue 3, Vite, Tailwind CSS v4, Lucide Icons, Vitest, Vue Test Utils.

## Global Constraints

- URL: `https://kontaq.org`
- Target: `_blank` with `rel="noopener noreferrer"`
- Accessibility: Valid HTML semantics, accessible touch targets (min 44px where applicable)
- Styling: Responsive across mobile, tablet, and desktop viewports, using existing brand colors and theme tokens

---

### Task 1: Add Main Website Link to User Profile Menu Dropdown

**Files:**
- Modify: `src/layouts/Main.vue`
- Modify: `src/components/UserMenu.vue`
- Create: `src/layouts/Main.test.js`

**Interfaces:**
- Consumes: `Globe`, `ExternalLink` from `lucide-vue-next`
- Produces: Navigation link to `https://kontaq.org` inside user profile dropdown menu

- [ ] **Step 1: Write the failing test for Main layout user dropdown**

Create `src/layouts/Main.test.js`:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Main from '@/layouts/Main.vue';
import authStore from '@/store/auth';

vi.mock('@/api', () => ({
  getUser: vi.fn().mockResolvedValue({}),
  listAnnouncements: vi.fn().mockResolvedValue({ data: [] }),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'home' }),
  useRouter: () => ({ push: vi.fn() }),
}));

describe('Main.vue - User Menu Dropdown', () => {
  beforeEach(() => {
    authStore.user = { name: 'Ahmad', username: 'ahmad' };
    authStore.isLoggedIn = true;
  });

  it('contains an external link to kontaq.org with target _blank and rel noopener noreferrer in user dropdown', async () => {
    const wrapper = mount(Main, {
      global: {
        stubs: {
          RouterLink: true,
          NotificationDrawer: true,
          SearchModal: true,
        },
      },
    });

    // Open user menu
    const userMenuButton = wrapper.find('button[title="Menu Pengguna"]');
    await userMenuButton.trigger('click');

    const websiteLink = wrapper.find('a[href="https://kontaq.org"]');
    expect(websiteLink.exists()).toBe(true);
    expect(websiteLink.attributes('target')).toBe('_blank');
    expect(websiteLink.attributes('rel')).toContain('noopener');
    expect(websiteLink.text()).toContain('Website Resmi');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/layouts/Main.test.js`
Expected: FAIL (link not found or file not yet passing)

- [ ] **Step 3: Modify `src/layouts/Main.vue` and `src/components/UserMenu.vue`**

In `src/layouts/Main.vue`:
1. Import `Globe` and `ExternalLink` from `'lucide-vue-next'`.
2. In the user dropdown panel (between `help` router-link and the divider before `logout`), add:
```html
<a
  href="https://kontaq.org"
  target="_blank"
  rel="noopener noreferrer"
  @click="isUserMenuOpen = false"
  class="flex items-center justify-between px-4 py-2 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary hover:text-primary transition group"
>
  <div class="flex items-center gap-2.5">
    <Globe class="w-4 h-4 text-primary" />
    <span>Website Resmi</span>
  </div>
  <ExternalLink class="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
</a>
```

In `src/components/UserMenu.vue`:
Update `userNavigation` to include the external website link and support `external: true` items.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/layouts/Main.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Main.vue src/components/UserMenu.vue src/layouts/Main.test.js
git commit -m "feat(layout): add kontaq.org main website link to user menu dropdown"
```

---

### Task 2: Add Main Website Link to Help & FAQ Page

**Files:**
- Modify: `src/pages/Help.vue`
- Modify: `src/pages/Help.test.js`

**Interfaces:**
- Consumes: `Globe`, `ExternalLink` from `lucide-vue-next`
- Produces: Action button link to `https://kontaq.org` in the support footer card

- [ ] **Step 1: Update `src/pages/Help.test.js` with failing test**

Add to `src/pages/Help.test.js`:
```javascript
it('renders link to official website kontaq.org in support section', async () => {
  const wrapper = mountPage();
  await flushPromises();

  const websiteLink = wrapper.find('a[href="https://kontaq.org"]');
  expect(websiteLink.exists()).toBe(true);
  expect(websiteLink.attributes('target')).toBe('_blank');
  expect(websiteLink.attributes('rel')).toContain('noopener');
  expect(websiteLink.text()).toContain('Website Resmi');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/Help.test.js`
Expected: FAIL

- [ ] **Step 3: Modify `src/pages/Help.vue`**

In `src/pages/Help.vue`:
1. Import `Globe` and `ExternalLink` from `'lucide-vue-next'`.
2. Update the bottom support card actions:
```html
<div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-center sm:justify-end">
  <a
    href="https://kontaq.org"
    target="_blank"
    rel="noopener noreferrer"
    class="px-4 py-2.5 bg-card hover:bg-secondary text-foreground text-xs sm:text-sm font-semibold rounded-full border border-border shadow-2xs transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
  >
    <Globe class="w-4 h-4 text-primary" />
    <span>Website Resmi</span>
    <ExternalLink class="w-3 h-3 text-muted-foreground" />
  </a>
  <router-link
    :to="{ name: 'forum' }"
    class="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold rounded-full shadow-xs transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
  >
    Tanya di Forum Ukhuwah
  </router-link>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/Help.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Help.vue src/pages/Help.test.js
git commit -m "feat(help): add kontaq.org link to help and support card"
```

---

### Task 3: Add Main Website Link to Auth Layout

**Files:**
- Modify: `src/layouts/Auth.vue`
- Create: `src/layouts/Auth.test.js`

**Interfaces:**
- Consumes: External link `https://kontaq.org`
- Produces: Clickable website link in both desktop hero and mobile footers of Auth layout

- [ ] **Step 1: Write the failing test for Auth layout**

Create `src/layouts/Auth.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Auth from '@/layouts/Auth.vue';

describe('Auth.vue Layout', () => {
  it('renders external links to kontaq.org in desktop and mobile footer areas', () => {
    const wrapper = mount(Auth, {
      slots: {
        default: '<div id="login-form">Login Form</div>',
      },
    });

    const links = wrapper.findAll('a[href="https://kontaq.org"]');
    expect(links.length).toBeGreaterThanOrEqual(2);

    links.forEach((link) => {
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toContain('noopener');
      expect(link.text()).toContain('kontaq.org');
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/layouts/Auth.test.js`
Expected: FAIL

- [ ] **Step 3: Modify `src/layouts/Auth.vue`**

In `src/layouts/Auth.vue`:
1. In desktop hero footer (line 21):
```html
<div class="relative z-10 text-xs text-white/70 text-center">
  &copy; Komunitas Tadabbur Al-Qur'an (KontaQ). All rights reserved. &middot;
  <a
    href="https://kontaq.org"
    target="_blank"
    rel="noopener noreferrer"
    class="underline underline-offset-2 hover:text-white transition-colors"
  >kontaq.org</a>
</div>
```
2. In mobile footer (line 40):
```html
<div class="text-xs text-center text-muted-foreground/60 pt-4 lg:hidden">
  &copy; Komunitas Tadabbur Al-Qur'an (KontaQ) &middot;
  <a
    href="https://kontaq.org"
    target="_blank"
    rel="noopener noreferrer"
    class="underline underline-offset-2 hover:text-primary transition-colors"
  >kontaq.org</a>
</div>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/layouts/Auth.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Auth.vue src/layouts/Auth.test.js
git commit -m "feat(auth): add kontaq.org links to desktop and mobile footers"
```

---

### Task 4: Full Verification & Regression Testing

**Files:**
- Run full test suite & production build verification

- [ ] **Step 1: Run full test suite**

Run: `npm test`
Expected: All 22+ test files pass

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds without errors

- [ ] **Step 3: Final commit if any tweaks needed**

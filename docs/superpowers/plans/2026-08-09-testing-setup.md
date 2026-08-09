# Unit and Component Testing Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Setup Vitest, happy-dom, and Vue Test Utils for unit and component testing in kontaq-vue, with baseline test coverage for utils, api helpers, and UI components.

**Architecture:** Integrate Vitest directly into `vite.config.js` with co-located `*.test.js` test files under `src/`.

**Tech Stack:** Vitest, happy-dom, @vue/test-utils v2, Vue 3, Vite 6.

## Global Constraints

- Use npm for package management.
- Co-locate test files alongside source code under `src/`.
- All tests must pass cleanly when running `npm run test`.

---

### Task 1: Install Testing Dependencies & Configure Vitest

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`
- Create: `src/test-setup.js`

**Interfaces:**
- Consumes: Existing Vite 6 build configuration in `vite.config.js`
- Produces: Test runner environment callable via `npm run test` and `npm run test:watch`

- [ ] **Step 1: Install devDependencies (`vitest`, `@vue/test-utils`, `happy-dom`)**

Run command:
```bash
npm install -D vitest @vue/test-utils happy-dom
```

- [ ] **Step 2: Create global test setup file `src/test-setup.js`**

Create `src/test-setup.js` with basic setup:
```javascript
// src/test-setup.js
// Setup global mocks and test utilities if needed
```

- [ ] **Step 3: Update `vite.config.js` to configure Vitest**

Modify `vite.config.js` to add the `test` block in `defineConfig`:
```javascript
import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.js'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') !== -1) {
            const basic = id.toString().split('node_modules/')[1];
            const sub1 = basic.split('/')[0];
            if (sub1 !== '.pnpm') {
              return sub1.toString();
            }
            const name2 = basic.split('/')[1];
            return name2.split('@')[name2[0] === '@' ? 1 : 0].toString();
          }
        },
      },
    },
  },
});
```

- [ ] **Step 4: Add npm test scripts to `package.json`**

Update `package.json` `scripts` object to add:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

- [ ] **Step 5: Verify setup with a basic Vitest run**

Run: `npx vitest run`
Expected: "No test files found" or 0 tests passed cleanly.

- [ ] **Step 6: Commit Task 1**

```bash
git add package.json package-lock.json vite.config.js src/test-setup.js
git commit -m "chore: setup vitest, happy-dom, and vue test utils"
```

---

### Task 2: Implement Utility Unit Tests (`src/utils.test.js`)

**Files:**
- Create: `src/utils.test.js`
- Consumes: Utility functions from `src/utils.js` (`stripTags`, `shortDate`, `relativeDate`)

- [ ] **Step 1: Write unit tests for `stripTags`, `shortDate`, and `relativeDate`**

Create `src/utils.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { stripTags, shortDate, relativeDate } from './utils';

describe('stripTags', () => {
  it('should remove HTML tags from a string', () => {
    const input = '<p>Hello <strong>World</strong>!</p>';
    expect(stripTags(input)).toBe('Hello World!');
  });

  it('should return empty string when input has only HTML tags', () => {
    expect(stripTags('<div><span></span></div>')).toBe('');
  });

  it('should return unchanged text if no HTML tags are present', () => {
    expect(stripTags('Plain text content')).toBe('Plain text content');
  });
});

describe('shortDate', () => {
  it('should format ISO date strings into Indonesian short date format', () => {
    const formatted = shortDate('2026-08-09T12:00:00Z');
    expect(formatted).toBe('9 Agst 2026');
  });
});

describe('relativeDate', () => {
  it('should return a non-empty relative date string', () => {
    const result = relativeDate(new Date().toISOString());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run src/utils.test.js`
Expected: PASS (All 5 tests pass)

- [ ] **Step 3: Commit Task 2**

```bash
git add src/utils.test.js
git commit -m "test: add unit tests for utility functions"
```

---

### Task 3: Implement API Helper Unit Tests (`src/api.test.js`)

**Files:**
- Create: `src/api.test.js`
- Consumes: API methods and axios instance behavior in `src/api.js`

- [ ] **Step 1: Write unit tests for API helper functions**

Create `src/api.test.js`:
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import authStore from '@/store/auth';
import { getOnlineStatus, listAnnouncements } from './api';

vi.mock('axios');

describe('API Helper Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getOnlineStatus', () => {
    it('should fetch online status successfully', async () => {
      const mockData = { online: 42 };
      axios.get.mockResolvedValueOnce({ data: mockData });

      const res = await getOnlineStatus();
      expect(axios.get).toHaveBeenCalledWith('online-status');
      expect(res).toEqual(mockData);
    });

    it('should throw error when request fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getOnlineStatus()).rejects.toThrow('Network error');
    });
  });

  describe('listAnnouncements', () => {
    it('should fetch announcements with pagination parameter', async () => {
      const mockAnnouncements = { data: [{ id: 1, title: 'Notice' }] };
      axios.get.mockResolvedValueOnce({ data: mockAnnouncements });

      const res = await listAnnouncements(2);
      expect(axios.get).toHaveBeenCalledWith('announcements', {
        params: { page: 2 },
      });
      expect(res).toEqual(mockAnnouncements);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run src/api.test.js`
Expected: PASS (All 3 tests pass)

- [ ] **Step 3: Commit Task 3**

```bash
git add src/api.test.js
git commit -m "test: add unit tests for API helper functions"
```

---

### Task 4: Implement UI Component Test (`src/components/ui/button/Button.test.js`)

**Files:**
- Create: `src/components/ui/button/Button.test.js`
- Consumes: `src/components/ui/button/Button.vue`

- [ ] **Step 1: Write component test for Button.vue**

Create `src/components/ui/button/Button.test.js`:
```javascript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from './Button.vue';

describe('Button.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click Me',
      },
    });
    expect(wrapper.text()).toContain('Click Me');
  });

  it('applies destructive variant classes when variant prop is passed', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'destructive',
      },
      slots: {
        default: 'Delete',
      },
    });
    expect(wrapper.classes()).toContain('bg-destructive');
  });

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Submit',
      },
    });
    await wrapper.trigger('click');
    expect(wrapper.emitted()).toHaveProperty('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run test to verify component test passes**

Run: `npx vitest run src/components/ui/button/Button.test.js`
Expected: PASS (All 3 tests pass)

- [ ] **Step 3: Run full test suite to verify everything passes**

Run: `npm run test`
Expected: PASS (All 3 test files pass cleanly)

- [ ] **Step 4: Commit Task 4**

```bash
git add src/components/ui/button/Button.test.js
git commit -m "test: add component test for Button component"
```

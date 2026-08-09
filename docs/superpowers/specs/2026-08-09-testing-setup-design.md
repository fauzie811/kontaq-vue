# Unit and Component Testing Setup Design for kontaq-vue

Date: 2026-08-09  
Status: Approved  

## Overview
This document outlines the architecture, configuration, and baseline test suite for adding Unit and Component testing to `kontaq-vue` using Vitest, `@vue/test-utils`, and `happy-dom`.

---

## 1. Testing Framework & Architecture

- **Test Runner**: [Vitest](https://vitest.dev/) (Vite-native, fast execution using ES modules)
- **DOM Environment**: `happy-dom` (Lightweight, fast browser DOM implementation)
- **Vue Test Utilities**: `@vue/test-utils` v2 (Official Vue 3 component mounting library)
- **Test File Organization**: Co-located with source files (`*.test.js` or `*.spec.js` inside `src/`)

---

## 2. Dependencies & Configuration

### Dependencies to Install (devDependencies)
- `vitest`
- `@vue/test-utils`
- `happy-dom`

### Configuration Changes

1. **`vite.config.js`**:
   Add `test` options within `defineConfig`:
   ```javascript
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
   });
   ```

2. **`src/test-setup.js`**:
   - Provide global environment setup for DOM tests.

3. **`package.json` Scripts**:
   - `"test": "vitest run"`
   - `"test:watch": "vitest"`
   - `"test:coverage": "vitest run --coverage"`

---

## 3. Initial Baseline Test Suite

1. **`src/utils.test.js`**:
   - `stripTags()`: Verifies HTML tag stripping from text strings.
   - `shortDate()`: Verifies Indonesian localized date formatting (`d MMM yyyy`).
   - `relativeDate()`: Verifies relative date string calculation.

2. **`src/api.test.js`**:
   - Verifies Axios instance configuration (`baseURL`, headers).
   - Verifies API request interceptor behavior.

3. **`src/components/ui/button/Button.test.js`**:
   - Verifies slot content rendering.
   - Verifies component variants (default, destructive, outline, etc.) and size props.
   - Verifies user interaction (click event triggering).

---

## 4. Verification Plan

1. Run `npm run test` and verify all tests pass synchronously.
2. Run `npm run test:watch` to verify watch mode works.
3. Validate that build commands (`npm run build`) remain unaffected.

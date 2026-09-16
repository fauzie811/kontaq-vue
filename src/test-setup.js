// src/test-setup.js
// Setup global mocks and test utilities if needed

/**
 * Web Storage polyfill for the test environment.
 *
 * Node >= 22 exposes `globalThis.localStorage` and `globalThis.sessionStorage`
 * as getter-only accessors that resolve to `undefined` unless the process is
 * started with `--localstorage-file`. Because those properties have no setter,
 * Vitest's happy-dom environment cannot replace them, so `localStorage` stays
 * `undefined` inside tests.
 *
 * Any module that touches web storage at import time then throws
 * "Cannot read properties of undefined (reading 'getItem')" — for example
 * `src/store/auth.js`, which reads the auth token at module scope.
 *
 * The accessors are `configurable`, so `Object.defineProperty` can shadow them
 * with a real implementation: happy-dom's `Storage` when available, otherwise a
 * minimal in-memory shim (so this also holds up under `environment: 'node'`).
 */
function createStorage() {
  if (typeof Storage === 'function') {
    try {
      return new Storage();
    } catch {
      // Not constructible in this environment; use the shim below.
    }
  }

  const entries = new Map();

  return {
    get length() {
      return entries.size;
    },
    key(index) {
      return [...entries.keys()][index] ?? null;
    },
    getItem(key) {
      return entries.has(String(key)) ? entries.get(String(key)) : null;
    },
    setItem(key, value) {
      entries.set(String(key), String(value));
    },
    removeItem(key) {
      entries.delete(String(key));
    },
    clear() {
      entries.clear();
    },
  };
}

for (const name of ['localStorage', 'sessionStorage']) {
  // Inspect the descriptor rather than reading the property: merely *touching*
  // Node's accessor emits an ExperimentalWarning on every worker.
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  const existing = descriptor && 'value' in descriptor ? descriptor.value : undefined;

  // Leave a working implementation alone; replace anything else (including
  // Node's getter-only accessor). An in-memory store is preferable in tests
  // anyway, since it never persists to disk between runs.
  if (existing && typeof existing.getItem === 'function') continue;

  Object.defineProperty(globalThis, name, {
    value: createStorage(),
    configurable: true,
    writable: true,
  });
}

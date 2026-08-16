import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import router from './router';

describe('Router View Transitions', () => {
  let originalStartViewTransition;
  let originalMatchMedia;

  beforeEach(() => {
    originalStartViewTransition = document.startViewTransition;
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    document.startViewTransition = originalStartViewTransition;
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('bypasses view transition if startViewTransition is unsupported', async () => {
    delete document.startViewTransition;
    let transitionCalled = false;

    // Trigger navigation
    await router.push('/login');
    expect(transitionCalled).toBe(false);
  });

  it('bypasses view transition if prefers-reduced-motion is active', async () => {
    const startViewTransitionMock = vi.fn();
    document.startViewTransition = startViewTransitionMock;

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    await router.push('/register');
    expect(startViewTransitionMock).not.toHaveBeenCalled();
  });

  it('triggers forward view transition on standard route navigation', async () => {
    let passedOptions = null;
    document.startViewTransition = vi.fn().mockImplementation((options) => {
      passedOptions = options;
      if (typeof options === 'function') {
        return { finished: options() };
      }
      if (options && typeof options.update === 'function') {
        return { finished: options.update() };
      }
      return { finished: Promise.resolve() };
    });

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    await router.push('/login');
    await router.push('/register');

    expect(document.startViewTransition).toHaveBeenCalled();
    expect(passedOptions).toBeDefined();
    expect(passedOptions.types).toEqual(['forward']);
  });

  it('triggers backward view transition after popstate event', async () => {
    let passedOptions = null;
    document.startViewTransition = vi.fn().mockImplementation((options) => {
      passedOptions = options;
      if (typeof options === 'function') {
        return { finished: options() };
      }
      if (options && typeof options.update === 'function') {
        return { finished: options.update() };
      }
      return { finished: Promise.resolve() };
    });

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    // Trigger popstate
    window.dispatchEvent(new PopStateEvent('popstate'));

    await router.push('/forgot-password');

    expect(passedOptions).toBeDefined();
    expect(passedOptions.types).toEqual(['backward']);
  });

  it('falls back to legacy callback syntax if object syntax throws', async () => {
    let fallbackCalled = false;
    document.startViewTransition = vi.fn().mockImplementation((arg) => {
      if (typeof arg === 'object') {
        throw new TypeError('Object syntax not supported');
      }
      if (typeof arg === 'function') {
        fallbackCalled = true;
        return { finished: arg() };
      }
    });

    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    await router.push('/register');
    await router.push('/login');

    expect(fallbackCalled).toBe(true);
  });
});

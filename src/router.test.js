import { describe, it, expect, beforeEach } from 'vitest';
import router from './router';
import authStore from './store/auth';

describe('Router Navigation & Guards', () => {
  beforeEach(async () => {
    authStore.clearToken();
    await router.push('/login');
  });

  it('allows access to public auth routes when unauthenticated', async () => {
    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('login');

    await router.push('/register');
    expect(router.currentRoute.value.name).toBe('register');
  });

  it('redirects to login when navigating to protected route while unauthenticated', async () => {
    await router.push('/');
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('allows access to protected routes when authenticated', async () => {
    authStore.setToken('test-token');
    await router.push('/');
    expect(router.currentRoute.value.name).toBe('home');
  });

  it('redirects from login to home when authenticated', async () => {
    await router.push('/register');
    authStore.setToken('test-token');
    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('home');
  });
});

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
    expect(userMenuButton.exists()).toBe(true);
    await userMenuButton.trigger('click');

    const websiteLink = wrapper.find('a[href="https://kontaq.org"]');
    expect(websiteLink.exists()).toBe(true);
    expect(websiteLink.attributes('target')).toBe('_blank');
    expect(websiteLink.attributes('rel')).toContain('noopener');
    expect(websiteLink.text()).toContain('Website Resmi');
  });
});

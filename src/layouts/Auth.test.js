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

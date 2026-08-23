import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SurahName from './SurahName.vue';

describe('SurahName.vue', () => {
  it('renders surah ligature string with font-surah class', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: 1,
      },
    });

    expect(wrapper.text()).toBe('surah001');
    expect(wrapper.classes()).toContain('font-surah');
    expect(wrapper.attributes('title')).toBe('Surah Al-Fatihah');
    expect(wrapper.attributes('aria-label')).toBe('Surah Al-Fatihah');
  });

  it('applies customClass prop', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: 18,
        customClass: 'text-4xl text-primary',
      },
    });

    expect(wrapper.text()).toBe('surah018');
    expect(wrapper.classes()).toContain('text-4xl');
    expect(wrapper.classes()).toContain('text-primary');
    expect(wrapper.attributes('title')).toBe('Surah Al-Kahf');
  });

  it('renders empty span when chapter is invalid', () => {
    const wrapper = mount(SurahName, {
      props: {
        chapter: null,
      },
    });

    expect(wrapper.text()).toBe('');
  });
});

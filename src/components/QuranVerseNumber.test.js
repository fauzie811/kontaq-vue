import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QuranVerseNumber from '@/components/QuranVerseNumber.vue';

describe('QuranVerseNumber.vue', () => {
  it('renders single-digit verse with Unicode U+06DD and Arabic digit', () => {
    const wrapper = mount(QuranVerseNumber, {
      props: {
        number: 1,
      },
    });

    expect(wrapper.text()).toBe('\u06DD\u0661');
    expect(wrapper.attributes('title')).toBe('Ayat 1');
  });

  it('renders double-digit verse with Unicode U+06DD and Arabic digits', () => {
    const wrapper = mount(QuranVerseNumber, {
      props: {
        number: 28,
      },
    });

    expect(wrapper.text()).toBe('\u06DD\u0662\u0668');
    expect(wrapper.attributes('title')).toBe('Ayat 28');
  });

  it('renders three-digit verse with Unicode U+06DD and Arabic digits', () => {
    const wrapper = mount(QuranVerseNumber, {
      props: {
        number: 286,
      },
    });

    expect(wrapper.text()).toBe('\u06DD\u0662\u0668\u0666');
    expect(wrapper.attributes('title')).toBe('Ayat 286');
  });

  it('applies customClass prop', () => {
    const wrapper = mount(QuranVerseNumber, {
      props: {
        number: 5,
        customClass: 'text-primary text-2xl',
      },
    });

    expect(wrapper.classes()).toContain('text-primary');
    expect(wrapper.classes()).toContain('text-2xl');
  });
});

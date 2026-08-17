import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import QuestionCard from '@/components/QuestionCard.vue';

describe('QuestionCard.vue', () => {
  it('renders multiple choice options by default', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        index: 0,
        question: {
          id: 1,
          type: 'multiple',
          content: '<p>Multiple choice question?</p>',
          details: {
            option_a: 'Option A text',
            option_b: 'Option B text',
            option_c: 'Option C text',
            option_d: 'Option D text',
          },
        },
        modelValue: '',
      },
    });

    expect(wrapper.text()).toContain('Option A text');
    expect(wrapper.text()).toContain('Option D text');
    expect(wrapper.text()).toContain('a.');
  });

  it('renders side-by-side Benar and Salah options for true_false questions', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        index: 0,
        question: {
          id: 2,
          type: 'true_false',
          content: '<p>Pernyataan Benar atau Salah?</p>',
          details: null,
        },
        modelValue: '',
      },
    });

    expect(wrapper.text()).toContain('Benar');
    expect(wrapper.text()).toContain('Salah');
    expect(wrapper.text()).not.toContain('a.');
  });

  it('emits update:modelValue with "true" or "false" when selected', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        index: 0,
        question: {
          id: 2,
          type: 'true_false',
          content: '<p>Pernyataan Benar atau Salah?</p>',
          details: null,
        },
        modelValue: '',
      },
    });

    // Find and click the Benar button/option
    const buttons = wrapper.findAll('.cursor-pointer');
    await buttons[0].trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['true']);
  });

  it('renders 4 multiple choice options when option_e is not present', () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: {
          id: 1,
          type: 'multiple',
          content: 'Multiple choice question?',
          details: {
            option_a: 'Option A text',
            option_b: 'Option B text',
            option_c: 'Option C text',
            option_d: 'Option D text',
          },
          point: 1,
        },
        index: 0,
        modelValue: '',
      },
    });

    expect(wrapper.text()).toContain('Option A text');
    expect(wrapper.text()).toContain('Option D text');
    expect(wrapper.text()).not.toContain('e.');
  });

  it('renders 5 multiple choice options when option_e is present', async () => {
    const wrapper = mount(QuestionCard, {
      props: {
        question: {
          id: 2,
          type: 'multiple',
          content: '5 choices question?',
          details: {
            option_a: 'Option A text',
            option_b: 'Option B text',
            option_c: 'Option C text',
            option_d: 'Option D text',
            option_e: 'Option E text',
          },
          point: 1,
        },
        index: 0,
        modelValue: '',
      },
    });

    expect(wrapper.text()).toContain('Option E text');
    expect(wrapper.text()).toContain('e.');

    // Click option E
    const optionCards = wrapper.findAll('.cursor-pointer');
    const optionE = optionCards[4];
    await optionE.trigger('click');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['e']);
  });
});


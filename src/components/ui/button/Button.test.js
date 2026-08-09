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

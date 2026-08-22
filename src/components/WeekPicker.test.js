import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import WeekPicker from '@/components/WeekPicker.vue';

describe('WeekPicker.vue', () => {
  it('renders default maxWeeks options when weeks prop is not provided', async () => {
    const wrapper = mount(WeekPicker, {
      props: {
        modelValue: null,
        showAllOption: true,
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.text()).toContain('Semua Pekan');
    expect(wrapper.text()).toContain('Pekan 1');
    expect(wrapper.text()).toContain('Pekan 30');
    expect(wrapper.text()).not.toContain('Pekan 31');
  });

  it('renders specific weeks when weeks prop is provided', async () => {
    const wrapper = mount(WeekPicker, {
      props: {
        modelValue: null,
        showAllOption: true,
        weeks: [1, 26, 27, 87],
      },
    });

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.text()).toContain('Semua Pekan');
    expect(wrapper.text()).toContain('Pekan 1');
    expect(wrapper.text()).toContain('Pekan 26');
    expect(wrapper.text()).toContain('Pekan 27');
    expect(wrapper.text()).toContain('Pekan 87');
    expect(wrapper.text()).not.toContain('Pekan 2\n');
    expect(wrapper.text()).not.toContain('Pekan 25');
    expect(wrapper.text()).not.toContain('Pekan 30');
  });

  it('displays the selected week in the button', () => {
    const wrapper = mount(WeekPicker, {
      props: {
        modelValue: 87,
        weeks: [1, 87],
      },
    });

    expect(wrapper.find('button').text()).toContain('Pekan 87');
  });
});

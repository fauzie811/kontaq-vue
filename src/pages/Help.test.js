import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Help from '@/pages/Help.vue';
import * as api from '@/api';

vi.mock('@/api', () => ({
  listFaqs: vi.fn(),
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockFaqs = [
  {
    id: 1,
    question: 'Apa itu KontaQ?',
    answer: 'Komunitas Tadabbur Al-Qur\'an 1 Hari 1 Halaman.',
    category: 'Program Tadabbur',
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    question: 'Bagaimana cara konfirmasi infaq?',
    answer: 'Transfer ke BSI 777-888-9990.',
    category: 'Infaq & Donasi',
    order: 2,
    is_active: true,
  },
];

function mountPage(faqs = mockFaqs) {
  api.listFaqs.mockResolvedValue({
    success: true,
    data: faqs,
  });

  return mount(Help, {
    global: {
      stubs: {
        PageHeader: true,
        RouterLink: true,
      },
    },
  });
}

describe('Help.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders FAQ list with categories and questions', async () => {
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.text()).toContain('Apa itu KontaQ?');
    expect(wrapper.text()).toContain('Bagaimana cara konfirmasi infaq?');
    expect(wrapper.text()).toContain('Program Tadabbur');
    expect(wrapper.text()).toContain('Infaq & Donasi');
  });

  it('expands FAQ answer when question is clicked', async () => {
    const wrapper = mountPage();
    await flushPromises();

    // Initially, answers might be collapsed or first item opened
    const buttons = wrapper.findAll('button[aria-expanded]');
    expect(buttons.length).toBeGreaterThan(0);

    // Click the second question button
    await buttons[1].trigger('click');
    expect(wrapper.text()).toContain('Transfer ke BSI 777-888-9990.');
  });

  it('filters FAQs by search query input', async () => {
    const wrapper = mountPage();
    await flushPromises();

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue('infaq');

    expect(wrapper.text()).toContain('Bagaimana cara konfirmasi infaq?');
    expect(wrapper.text()).not.toContain('Apa itu KontaQ?');
  });

  it('filters FAQs by category button', async () => {
    const wrapper = mountPage();
    await flushPromises();

    const categoryButtons = wrapper.findAll('.flex.items-center.gap-2.overflow-x-auto button');
    const infaqCatBtn = categoryButtons.find((btn) => btn.text().includes('Infaq & Donasi'));

    if (infaqCatBtn) {
      await infaqCatBtn.trigger('click');
      expect(wrapper.text()).toContain('Bagaimana cara konfirmasi infaq?');
      expect(wrapper.text()).not.toContain('Apa itu KontaQ?');
    }
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Show from '@/pages/Materials/Show.vue';
import * as api from '@/api';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '2' },
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/api', () => ({
  getMyMaterial: vi.fn(),
  updateMyMaterial: vi.fn(),
}));

describe('Materials/Show.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders material content and related verses card when verses exist', async () => {
    api.getMyMaterial.mockResolvedValue({
      success: true,
      data: {
        id: 2,
        title: 'Tadabbur QS An-Najm: 48-49',
        content: '<p>Penjelasan materi tadabbur...</p>',
        quran_verses: [
          {
            id: 4832,
            chapter: 53,
            verse: 48,
            juz: 27,
            text: 'وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ',
            transliteration: 'Wa annahū huwa agnā wa aqnā.',
            translation: 'bahwa sesungguhnya Dialah yang menganugerahkan kekayaan dan kecukupan,',
          },
        ],
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          PageHeader: true,
          TextPlaceholder: true,
        },
      },
    });

    await flushPromises();

    // Verify material content is rendered
    expect(wrapper.html()).toContain('Penjelasan materi tadabbur...');

    // Verify related verses card is rendered
    expect(wrapper.text()).toContain('Ayat Terkait');
    expect(wrapper.text()).toContain('QS. An-Najm: 48');
    expect(wrapper.text()).toContain('وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ');
    expect(wrapper.text()).toContain('Wa annahū huwa agnā wa aqnā.');
  });

  it('does not render related verses card when material has no verses', async () => {
    api.getMyMaterial.mockResolvedValue({
      success: true,
      data: {
        id: 3,
        title: 'Materi Tanpa Ayat',
        content: '<p>Hanya teks materi biasa.</p>',
        quran_verses: [],
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          PageHeader: true,
          TextPlaceholder: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.html()).toContain('Hanya teks materi biasa.');
    expect(wrapper.text()).not.toContain('Ayat Terkait');
  });
});

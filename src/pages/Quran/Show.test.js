import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import Show from '@/pages/Quran/Show.vue';
import * as api from '@/api';

const mockPush = vi.fn();
let mockRoute = {
  params: { chapter: '2' },
  query: {},
  hash: '',
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/api', () => ({
  getQuranChapterVerses: vi.fn(),
}));

describe('Quran/Show.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute = {
      params: { chapter: '2' },
      query: {},
      hash: '',
    };
    // Mock Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('renders chapter details and page 1 verses when no verse query is present', async () => {
    api.getQuranChapterVerses.mockResolvedValueOnce({
      success: true,
      chapter: {
        number: 2,
        latin: 'Al-Baqarah',
        arabic: 'البقرة',
        meaning: 'Sapi Betina',
        ayat: 286,
        revelation_type: 'Madaniyah',
      },
      data: {
        current_page: 1,
        last_page: 15,
        data: [
          { id: 1, chapter: 2, verse: 1, text: 'الم', translation: 'Alif Lam Mim.' },
          { id: 2, chapter: 2, verse: 2, text: 'ذَٰلِكَ الْكِتَابُ', translation: 'Kitab ini...' },
        ],
      },
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          QuranAudioPlayer: true,
          QuranVerseItem: false,
        },
      },
    });

    await flushPromises();

    expect(api.getQuranChapterVerses).toHaveBeenCalledWith(2, 1);
    expect(wrapper.text()).toContain('Al-Baqarah');
    expect(wrapper.text()).toContain('Sapi Betina');
    expect(wrapper.text()).toContain('Alif Lam Mim.');
  });

  it('loads multiple pages up to target verse and marks target verse as targeted when verse query is present', async () => {
    mockRoute.query = { verse: '25' };

    // Page 1 (verses 1..20)
    api.getQuranChapterVerses.mockImplementation(async (chapter, page) => {
      if (page === 1) {
        return {
          success: true,
          chapter: {
            number: 2,
            latin: 'Al-Baqarah',
            arabic: 'البقرة',
            meaning: 'Sapi Betina',
            ayat: 286,
          },
          data: {
            current_page: 1,
            last_page: 15,
            data: Array.from({ length: 20 }, (_, i) => ({
              id: i + 1,
              chapter: 2,
              verse: i + 1,
              text: `Text ${i + 1}`,
              translation: `Translation ${i + 1}`,
            })),
          },
        };
      }
      if (page === 2) {
        return {
          success: true,
          chapter: {
            number: 2,
            latin: 'Al-Baqarah',
            arabic: 'البقرة',
            meaning: 'Sapi Betina',
            ayat: 286,
          },
          data: {
            current_page: 2,
            last_page: 15,
            data: Array.from({ length: 20 }, (_, i) => ({
              id: 20 + i + 1,
              chapter: 2,
              verse: 20 + i + 1,
              text: `Text ${20 + i + 1}`,
              translation: `Translation ${20 + i + 1}`,
            })),
          },
        };
      }
      return { success: false };
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          QuranAudioPlayer: true,
          QuranVerseItem: false,
        },
      },
    });

    await flushPromises();

    // Verify it called for page 1 and page 2
    expect(api.getQuranChapterVerses).toHaveBeenCalledWith(2, 1);
    expect(api.getQuranChapterVerses).toHaveBeenCalledWith(2, 2);

    // Verify verse 25 is rendered in the list
    expect(wrapper.text()).toContain('QS Al-Baqarah: 25');

    // Verify verse 25 has targeted styling or is highlighted
    const verse25El = wrapper.find('#verse-25');
    expect(verse25El.exists()).toBe(true);
    expect(verse25El.classes()).toContain('border-primary/60');
  });

  it('renders error state and handles retry button', async () => {
    api.getQuranChapterVerses.mockResolvedValueOnce({
      success: false,
      message: 'Surah tidak ditemukan.',
    });

    const wrapper = mount(Show, {
      global: {
        stubs: {
          QuranAudioPlayer: true,
          QuranVerseItem: true,
        },
      },
    });

    await flushPromises();

    expect(wrapper.text()).toContain('Terjadi Kesalahan');
    expect(wrapper.text()).toContain('Surah tidak ditemukan.');

    // Mock successful retry
    api.getQuranChapterVerses.mockResolvedValueOnce({
      success: true,
      chapter: {
        number: 2,
        latin: 'Al-Baqarah',
        arabic: 'البقرة',
        meaning: 'Sapi Betina',
        ayat: 286,
      },
      data: {
        current_page: 1,
        last_page: 1,
        data: [{ id: 1, chapter: 2, verse: 1, text: 'الم', translation: 'Alif Lam Mim.' }],
      },
    });

    const retryBtn = wrapper.findAll('button').find((b) => b.text().includes('Coba Lagi'));
    expect(retryBtn).toBeDefined();

    await retryBtn.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Al-Baqarah');
    expect(wrapper.text()).not.toContain('Terjadi Kesalahan');
  });
});

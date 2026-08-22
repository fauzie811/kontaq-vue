import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SearchModal from '@/components/SearchModal.vue';
import * as api from '@/api';

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/api', () => ({
  searchQuran: vi.fn(),
}));

let wrapper;

async function mountModal(props = {}) {
  wrapper = mount(SearchModal, {
    props: {
      isOpen: true,
      ...props,
    },
    global: {
      stubs: {
        Teleport: true,
        Transition: false,
      },
    },
  });
  await flushPromises();
  return wrapper;
}

describe('SearchModal.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    wrapper?.unmount();
    wrapper = undefined;
  });

  it('renders initial state with popular surahs and shortcut guides when query is empty', async () => {
    await mountModal();

    expect(wrapper.text()).toContain('Surah Pilihan');
    expect(wrapper.text()).toContain('Al-Fatihah');
    expect(wrapper.text()).toContain('Al-Kahf');
    expect(wrapper.text()).toContain('Yasin');
    expect(wrapper.text()).toContain('Pintasan Pencarian Cepat');
  });

  it('clicking a popular surah emits select event and navigates to surah page', async () => {
    await mountModal();

    const fatihahBtn = wrapper.findAll('button').find((b) => b.text().includes('Al-Fatihah'));
    expect(fatihahBtn).toBeDefined();

    await fatihahBtn.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0][0]).toEqual({
      type: 'surah',
      data: expect.objectContaining({ number: 1, name: 'Al-Fatihah' }),
    });
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(mockPush).toHaveBeenCalledWith({
      name: 'quran.show',
      params: { chapter: 1 },
    });
  });

  it('calls searchQuran on search input with debounce and displays results', async () => {
    api.searchQuran.mockResolvedValueOnce({
      success: true,
      data: {
        chapters: [
          { number: 2, latin: 'Al-Baqarah', arabic: 'البقرة', meaning: 'Sapi Betina', ayat: 286 },
        ],
        verses: [],
        materials: [],
        faqs: [],
      },
    });

    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('baqarah');

    // Fast-forward debounce timer (250ms)
    vi.advanceTimersByTime(250);
    await flushPromises();

    expect(api.searchQuran).toHaveBeenCalledWith({ q: 'baqarah' });
    expect(wrapper.text()).toContain('Al-Baqarah');
    expect(wrapper.text()).toContain('Sapi Betina');
  });

  it('clicking a verse result emits select event and navigates to quran.show with chapter and verse query', async () => {
    api.searchQuran.mockResolvedValueOnce({
      success: true,
      data: {
        chapters: [],
        verses: {
          data: [
            {
              id: 262,
              chapter: 2,
              verse: 255,
              text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
              translation: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya)',
              surah: { number: 2, latin: 'Al-Baqarah' },
            },
          ],
        },
        materials: [],
        faqs: [],
      },
    });

    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('kursi');

    vi.advanceTimersByTime(250);
    await flushPromises();

    expect(wrapper.text()).toContain('QS Al-Baqarah: 255');

    const verseItem = wrapper.findAll('[data-item-key]').find((el) => el.attributes('data-item-key') === 'verse-262');
    expect(verseItem).toBeDefined();

    await verseItem.trigger('click');
    await flushPromises();

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')[0][0]).toEqual({
      type: 'verse',
      data: expect.objectContaining({ chapter: 2, verse: 255 }),
    });
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(mockPush).toHaveBeenCalledWith({
      name: 'quran.show',
      params: { chapter: 2 },
      query: { verse: 255 },
    });
  });

  it('handles category filter chips to add and toggle prefixes', async () => {
    await mountModal();

    const surahFilterBtn = wrapper.findAll('button').find((b) => b.text().includes('Surah') && b.text().includes('#'));
    expect(surahFilterBtn).toBeDefined();

    await surahFilterBtn.trigger('click');
    await flushPromises();

    const input = wrapper.find('input[type="text"]');
    expect(input.element.value).toBe('# ');

    // Clicking it again toggles prefix off
    await surahFilterBtn.trigger('click');
    await flushPromises();
    expect(input.element.value).toBe('');
  });

  it('shows empty results state when no items match the query', async () => {
    api.searchQuran.mockResolvedValueOnce({
      success: true,
      data: {
        chapters: [],
        verses: [],
        materials: [],
        faqs: [],
      },
    });

    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('xyznotfound123');

    vi.advanceTimersByTime(250);
    await flushPromises();

    expect(wrapper.text()).toContain('Tidak ada hasil ditemukan');
    expect(wrapper.text()).toContain('xyznotfound123');
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter)', async () => {
    api.searchQuran.mockResolvedValueOnce({
      success: true,
      data: {
        chapters: [
          { number: 1, latin: 'Al-Fatihah', arabic: 'الفاتحة', meaning: 'Pembukaan', ayat: 7 },
          { number: 2, latin: 'Al-Baqarah', arabic: 'البقرة', meaning: 'Sapi', ayat: 286 },
        ],
        verses: [],
        materials: [],
        faqs: [],
      },
    });

    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('al');

    vi.advanceTimersByTime(250);
    await flushPromises();

    // First item is selected by default (index 0: Al-Fatihah)
    // Press down arrow to move to Al-Baqarah (index 1)
    await input.trigger('keydown', { key: 'ArrowDown' });
    await flushPromises();

    // Press Enter to select Al-Baqarah
    await input.trigger('keydown', { key: 'Enter' });
    await flushPromises();

    expect(mockPush).toHaveBeenCalledWith({
      name: 'quran.show',
      params: { chapter: 2 },
    });
  });

  it('clears search query on Escape key when query is non-empty without closing modal', async () => {
    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('baqarah');
    expect(input.element.value).toBe('baqarah');

    // Press Escape
    await input.trigger('keydown', { key: 'Escape' });
    await flushPromises();

    // Query is cleared, modal is NOT closed
    expect(input.element.value).toBe('');
    expect(wrapper.emitted('close')).toBeFalsy();
  });

  it('dismisses modal on Escape key when search input is empty', async () => {
    await mountModal();

    const input = wrapper.find('input[type="text"]');
    expect(input.element.value).toBe('');

    await input.trigger('keydown', { key: 'Escape' });
    await flushPromises();

    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('handles window global Escape key properly', async () => {
    await mountModal();

    const input = wrapper.find('input[type="text"]');
    await input.setValue('surah');

    // Trigger window escape key
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushPromises();

    expect(input.element.value).toBe('');
    expect(wrapper.emitted('close')).toBeFalsy();

    // Trigger window escape key again when empty
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await flushPromises();

    expect(wrapper.emitted('close')).toBeTruthy();
  });
});

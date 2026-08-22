import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import QuranVerseItem from '@/components/QuranVerseItem.vue';

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('QuranVerseItem.vue', () => {
  const defaultVerse = {
    id: 1,
    chapter: 1,
    verse: 1,
    text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhir-raḥmānir-raḥīm',
    translation: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
  };

  const chapterDetails = {
    number: 1,
    latin: 'Al-Fatihah',
  };

  it('renders verse information correctly without materials', () => {
    const wrapper = mount(QuranVerseItem, {
      props: {
        verse: defaultVerse,
        chapterDetails,
      },
    });

    expect(wrapper.text()).toContain('QS Al-Fatihah: 1');
    expect(wrapper.text()).toContain('Bismillāhir-raḥmānir-raḥīm');
    expect(wrapper.text()).toContain('Dengan nama Allah Yang Maha Pengasih');
    expect(wrapper.text()).not.toContain('Tadabbur');
  });

  it('displays Tadabbur action and button badge when verse has related materials', async () => {
    const verseWithMaterial = {
      ...defaultVerse,
      materials: [
        {
          id: 42,
          title: 'Tadabbur Basmalah',
          week: 1,
          order: 1,
        },
      ],
    };

    const wrapper = mount(QuranVerseItem, {
      props: {
        verse: verseWithMaterial,
        chapterDetails,
      },
    });

    expect(wrapper.text()).toContain('Tadabbur');

    // Find the Tadabbur pill button
    const tadabburButton = wrapper.find('button[title*="Tadabbur"], button[title*="Materi"]');
    expect(tadabburButton.exists()).toBe(true);

    await tadabburButton.trigger('click');

    expect(wrapper.emitted('go-to-material')).toBeTruthy();
    expect(wrapper.emitted('go-to-material')[0][0]).toEqual(verseWithMaterial.materials[0]);
    expect(mockPush).toHaveBeenCalledWith({
      name: 'materials.show',
      params: { id: 42 },
    });
  });

  it('supports single material object via verse.material', async () => {
    const verseWithSingleMaterial = {
      ...defaultVerse,
      material: {
        id: 99,
        title: 'Kandungan Surah',
      },
    };

    const wrapper = mount(QuranVerseItem, {
      props: {
        verse: verseWithSingleMaterial,
        chapterDetails,
      },
    });

    expect(wrapper.text()).toContain('Tadabbur');
    const tadabburButton = wrapper.find('button[title*="Tadabbur"], button[title*="Materi"]');
    await tadabburButton.trigger('click');

    expect(mockPush).toHaveBeenCalledWith({
      name: 'materials.show',
      params: { id: 99 },
    });
  });
});

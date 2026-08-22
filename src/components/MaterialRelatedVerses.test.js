import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MaterialRelatedVerses from '@/components/MaterialRelatedVerses.vue';

const sampleVerses = [
  {
    id: 4832,
    chapter: 53,
    verse: 48,
    juz: 27,
    text: 'وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ',
    transliteration: 'Wa annahū huwa agnā wa aqnā.',
    translation: 'bahwa sesungguhnya Dialah yang menganugerahkan kekayaan dan kecukupan,',
    footnotes: null,
  },
  {
    id: 4833,
    chapter: 53,
    verse: 49,
    juz: 27,
    text: 'وَأَنَّهُ هُوَ رَبُّ الشِّعْرَىٰ',
    transliteration: 'Wa annahū huwa rabbusy-syi‘rā.',
    translation: 'bahwa sesungguhnya Dialah Tuhan (yang memiliki) bintang Syi‘ra,704)',
    footnotes: '704)Syi‘ra adalah nama bintang yang disembah oleh sebagian orang Arab pada masa Jahiliah.',
  },
];

describe('MaterialRelatedVerses.vue', () => {
  it('does not render when verses is empty', () => {
    const wrapper = mount(MaterialRelatedVerses, {
      props: {
        verses: [],
      },
    });

    expect(wrapper.find('div').exists()).toBe(false);
  });

  it('renders verses compactly in a single card', () => {
    const wrapper = mount(MaterialRelatedVerses, {
      props: {
        verses: sampleVerses,
      },
    });

    expect(wrapper.text()).toContain('Ayat Terkait');
    expect(wrapper.text()).toContain('(2 Ayat)');
    expect(wrapper.text()).toContain('QS. An-Najm: 48-49');

    // Check verse labels
    expect(wrapper.text()).toContain('QS. An-Najm: 48');
    expect(wrapper.text()).toContain('QS. An-Najm: 49');
    expect(wrapper.text()).toContain('Juz 27');

    // Check Arabic text and translations
    expect(wrapper.text()).toContain('وَأَنَّهُ هُوَ أَغْنَىٰ وَأَقْنَىٰ');
    expect(wrapper.text()).toContain('Wa annahū huwa agnā wa aqnā.');
    expect(wrapper.text()).toContain('bahwa sesungguhnya Dialah yang menganugerahkan kekayaan dan kecukupan');
  });

  it('formats footnote numbers into superscripts in translation', () => {
    const wrapper = mount(MaterialRelatedVerses, {
      props: {
        verses: sampleVerses,
      },
    });

    expect(wrapper.html()).toContain('<sup');
    expect(wrapper.html()).toContain('[704]');
  });

  it('can toggle footnotes when available', async () => {
    const wrapper = mount(MaterialRelatedVerses, {
      props: {
        verses: sampleVerses,
      },
    });

    expect(wrapper.text()).toContain('Lihat Catatan Kaki');
    expect(wrapper.text()).not.toContain('Syi‘ra adalah nama bintang');

    const button = wrapper.find('button');
    await button.trigger('click');

    expect(wrapper.text()).toContain('Sembunyikan Catatan Kaki');
    expect(wrapper.text()).toContain('Syi‘ra adalah nama bintang');
  });

  it('does not contain verse action elements like dropdown menu, audio player, or copy button', () => {
    const wrapper = mount(MaterialRelatedVerses, {
      props: {
        verses: sampleVerses,
      },
    });

    // Verify there are no actions dropdown / copy / play elements
    expect(wrapper.text()).not.toContain('Putar Audio');
    expect(wrapper.text()).not.toContain('Salin Ayat');
    expect(wrapper.text()).not.toContain('Tadabbur');
    expect(wrapper.find('button[title="Opsi Ayat"]').exists()).toBe(false);
  });
});

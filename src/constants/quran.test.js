import { describe, it, expect } from 'vitest';
import { getSurahLigature, getChapterName } from './quran';

describe('quran constants & helpers', () => {
  it('formats chapter numbers into 3-digit surah ligatures', () => {
    expect(getSurahLigature(1)).toBe('surah001');
    expect(getSurahLigature(18)).toBe('surah018');
    expect(getSurahLigature(114)).toBe('surah114');
    expect(getSurahLigature('2')).toBe('surah002');
  });

  it('handles invalid or out-of-range chapter numbers gracefully', () => {
    expect(getSurahLigature(null)).toBe('');
    expect(getSurahLigature(undefined)).toBe('');
    expect(getSurahLigature(0)).toBe('');
    expect(getSurahLigature(115)).toBe('');
    expect(getSurahLigature('abc')).toBe('');
  });

  it('gets chapter name properly', () => {
    expect(getChapterName(1)).toBe('Al-Fatihah');
    expect(getChapterName(114)).toBe('An-Nas');
  });
});

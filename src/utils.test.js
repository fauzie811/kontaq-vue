import { describe, it, expect } from 'vitest';
import { stripTags, shortDate, relativeDate } from './utils';

describe('stripTags', () => {
  it('should remove HTML tags from a string', () => {
    const input = '<p>Hello <strong>World</strong>!</p>';
    expect(stripTags(input)).toBe('Hello World!');
  });

  it('should return empty string when input has only HTML tags', () => {
    expect(stripTags('<div><span></span></div>')).toBe('');
  });

  it('should return unchanged text if no HTML tags are present', () => {
    expect(stripTags('Plain text content')).toBe('Plain text content');
  });
});

describe('shortDate', () => {
  it('should format ISO date strings into Indonesian short date format', () => {
    const formatted = shortDate('2026-08-09T12:00:00Z');
    expect(formatted).toBe('9 Agt 2026');
  });
});

describe('relativeDate', () => {
  it('should return a non-empty relative date string', () => {
    const result = relativeDate(new Date().toISOString());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

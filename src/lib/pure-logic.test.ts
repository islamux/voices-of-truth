import { describe, expect, it } from 'vitest';
import type { Scholar } from '@/types';
import { filterScholars } from './filterScholars';
import { normalizeArabic } from './search';
import { getPages, paginate } from './pagination';

const base = (over: Partial<Scholar> = {}): Scholar => ({
  id: 1,
  name: { en: 'Sample Scholar', ar: 'عالم نموذجي' },
  socialMedia: [],
  countryId: 1,
  categoryId: 2,
  language: ['Arabic', 'English'],
  avatarUrl: '/avatars/default-avatar.png',
  bio: { en: 'A short biography.', ar: 'سيرة قصيرة.' },
  ...over,
});

const ahmad = base({
  id: 2,
  name: { en: 'Ahmad Al-Hanbali', ar: 'أحمد الحنبلي' },
  countryId: 2,
  categoryId: 3,
  language: ['Urdu'],
  bio: { en: 'A specialist in jurisprudence.', ar: 'متخصص في الفقه.' },
});
const yusuf = base({
  id: 3,
  name: { en: 'Yusuf Qaradawi', ar: 'يوسف القرضاوي' },
  countryId: 3,
  categoryId: 4,
  language: ['French'],
  bio: { en: 'A contemporary thinker.', ar: 'مفكر معاصر.' },
});
const scholars = [base(), ahmad, yusuf];

describe('normalizeArabic', () => {
  it('strips diacritics and tatweel', () => {
    expect(normalizeArabic('مُحَمَّد')).toBe('محمد');
  });
  it('unifies alef variants to bare alef', () => {
    expect(normalizeArabic('أحمد إبراهيم آدم ٱلله')).toBe('احمد ابراهيم ادم الله');
  });
  it('maps yaa and ta-marbuta', () => {
    expect(normalizeArabic('سورة التوبة سعيد')).toBe('سوره التوبه سعيد');
  });
  it('is identity on latin/plain text', () => {
    expect(normalizeArabic('Ahmad')).toBe('Ahmad');
  });
  it('handles empty string', () => {
    expect(normalizeArabic('')).toBe('');
  });
});

describe('filterScholars', () => {
  const none = { searchQuery: '', countryId: null, categoryId: null, lang: null };

  it('returns all when no criteria', () => {
    expect(filterScholars(scholars, none)).toHaveLength(3);
  });

  it('matches search on latin name', () => {
    const r = filterScholars(scholars, { ...none, searchQuery: 'ahmad' });
    expect(r.map((s) => s.id)).toEqual([2]);
  });

  it('matches Arabic search ignoring alef/diacritics', () => {
    const r = filterScholars(scholars, {
      ...none,
      searchQuery: normalizeArabic('احمد').toLowerCase(),
    });
    expect(r.map((s) => s.id)).toEqual([2]);
  });

  it('matches search against bio', () => {
    const r = filterScholars(scholars, { ...none, searchQuery: 'biography' });
    expect(r.map((s) => s.id)).toEqual([1]);
  });

  it('filters by country', () => {
    const r = filterScholars(scholars, { ...none, countryId: 3 });
    expect(r.map((s) => s.id)).toEqual([3]);
  });

  it('filters by category', () => {
    const r = filterScholars(scholars, { ...none, categoryId: 3 });
    expect(r.map((s) => s.id)).toEqual([2]);
  });

  it('filters by language', () => {
    const r = filterScholars(scholars, { ...none, lang: 'Urdu' });
    expect(r.map((s) => s.id)).toEqual([2]);
  });

  it('returns empty when nothing matches', () => {
    const r = filterScholars(scholars, { ...none, searchQuery: 'zzzz' });
    expect(r).toEqual([]);
  });
});

describe('getPages', () => {
  it('lists all pages when total <= 7', () => {
    expect(getPages(1, 4)).toEqual([1, 2, 3, 4]);
  });
  it('adds trailing ellipsis far from the end', () => {
    expect(getPages(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
  });
  it('adds leading ellipsis far from the start', () => {
    expect(getPages(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });
  it('shows a window around the middle page', () => {
    expect(getPages(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });
});

describe('paginate', () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  it('slices a full page window', () => {
    expect(paginate(items, 2, 5)).toEqual([6, 7, 8, 9, 10]);
  });
  it('slices a partial final window', () => {
    expect(paginate(items, 3, 5)).toEqual([11, 12]);
  });
  it('returns empty for a page beyond the end', () => {
    expect(paginate(items, 5, 5)).toEqual([]);
  });
});

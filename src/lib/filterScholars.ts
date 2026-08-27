import type { Scholar } from '@/types';
import { normalizeArabic } from './search';

export interface FilterCriteria {
  searchQuery: string;
  countryId: number | null;
  categoryId: number | null;
  lang: string | null;
}

export function filterScholars(
  scholars: Scholar[],
  criteria: FilterCriteria,
): Scholar[] {
  const { searchQuery, countryId, categoryId, lang } = criteria;

  return scholars.filter((scholar) => {
    const matchSearch =
      !searchQuery ||
      normalizeArabic(scholar.name.en.toLowerCase()).includes(searchQuery) ||
      normalizeArabic(scholar.name.ar.toLowerCase()).includes(searchQuery) ||
      normalizeArabic((scholar.bio?.en || '').toLowerCase()).includes(searchQuery) ||
      normalizeArabic((scholar.bio?.ar || '').toLowerCase()).includes(searchQuery);

    const matchCountry = countryId === null || scholar.countryId === countryId;
    const matchLang = lang === null || scholar.language.includes(lang);
    const matchCategory =
      categoryId === null || scholar.categoryId === categoryId;

    return matchSearch && matchCountry && matchLang && matchCategory;
  });
}

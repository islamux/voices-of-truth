const ARABIC_DIACRITICS = /[\u064B-\u0652\u0670]/g;

export function normalizeArabic(text: string): string {
  return text.replace(ARABIC_DIACRITICS, '');
}

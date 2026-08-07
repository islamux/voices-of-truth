const ARABIC_DIACRITICS_AND_TATWEEL = /[\u064B-\u0652\u0670\u0640]/g;
const ALEF_VARIANTS = /[\u0622\u0623\u0625\u0671]/g;

export function normalizeArabic(text: string): string {
  return text
    .replace(ARABIC_DIACRITICS_AND_TATWEEL, "")
    .replace(ALEF_VARIANTS, "\u0627")
    .replace(/\u0649/g, "\u064A")
    .replace(/\u0629/g, "\u0647");
}

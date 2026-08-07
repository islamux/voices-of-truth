const LANGUAGE_LABELS: Record<string, { en: string; ar: string }> = {
  Arabic: { en: 'Arabic', ar: 'العربية' },
  English: { en: 'English', ar: 'الإنجليزية' },
  French: { en: 'French', ar: 'الفرنسية' },
  Urdu: { en: 'Urdu', ar: 'الأردية' },
};

export function languageLabel(code: string, locale: string): string {
  const entry = LANGUAGE_LABELS[code];
  if (!entry) return code;
  return locale === 'ar' ? entry.ar : entry.en;
}

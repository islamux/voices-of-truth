import { useTranslation } from 'react-i18next';
import { Scholar } from '@/types';

export function useLocalizedScholar(scholar: Scholar) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = scholar.name[currentLang] || scholar.name['en'];

  const bio = scholar.bio ? (scholar.bio[currentLang] || scholar.bio['en']) : undefined;

  return { name, bio, languages: scholar.language };
}

import { useTranslation } from 'react-i18next';
import { Scholar } from '@/types';
import { localize } from '@/lib/languages';

export function useLocalizedScholar(scholar: Scholar) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const name = localize(scholar.name, currentLang);
  const bio = scholar.bio ? localize(scholar.bio, currentLang) : undefined;

  return { name, bio, languages: scholar.language };
}

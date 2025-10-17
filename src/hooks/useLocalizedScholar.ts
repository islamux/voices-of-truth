import { useTranslation } from 'react-i18next';
import { Scholar } from '@/types';

/**
 * A custom hook to retrieve localized scholar data.
 * It centralizes the logic for selecting the correct translation for a scholar's name and bio
 * based on the current application language.
 *
 * @param scholar - The scholar object containing multilingual data.
 * @returns An object with the localized `name`, `bio`, and the original `languages`.
 */
export function useLocalizedScholar(scholar: Scholar) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  // Retrieves the localized name, falling back to English if the current language's translation is not available.
  const name = scholar.name[currentLang] || scholar.name['en'];

  // Retrieves the localized bio, falling back to English if available.
  const bio = scholar.bio ? (scholar.bio[currentLang] || scholar.bio['en']) : undefined;

  return { name, bio, languages: scholar.language };
}

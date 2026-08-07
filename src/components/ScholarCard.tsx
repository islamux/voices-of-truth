'use client';

import { Scholar } from '../types';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';
import { useTranslation } from 'react-i18next';
import { languageLabel } from '@/lib/languages';

interface ScholarCardProps {
  scholar: Scholar;
  countryName: string;
}

export default function ScholarCard({ scholar, countryName }: ScholarCardProps) {
  const { name, bio, languages } = useLocalizedScholar(scholar);
  const { t, i18n } = useTranslation('scholar');

  if (!scholar.name) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Scholar with missing name:', scholar);
    }
    return null;
  }

  const localizedLanguages = languages.map((code) =>
    languageLabel(code, i18n.language),
  );

  return (
    <article className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-md">
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
      <ScholarInfo
        name={name}
        country={countryName}
        bio={bio}
        languages={localizedLanguages}
        languagesLabel={t('languages')}
      />
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </article>
  );
}

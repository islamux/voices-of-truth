'use client';

import { Scholar } from '../types';
import ScholarAvatar from './ScholarAvatar';
import ScholarInfo from './ScholarInfo';
import SocialMediaLinks from './SocialMediaLinks';
import { useLocalizedScholar } from '@/hooks/useLocalizedScholar';
import { useTranslation } from 'react-i18next';

interface ScholarCardProps {
  scholar: Scholar;
  countryName: string;
}

export default function ScholarCard({ scholar, countryName }: ScholarCardProps) {
  const { name, bio, languages } = useLocalizedScholar(scholar);
  const { t } = useTranslation('scholar');

  if (!scholar.name) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Scholar with missing name:', scholar);
    }
    return null;
  }

  return (
    <article className="group flex h-full flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-md">
      <ScholarAvatar avatarUrl={scholar.avatarUrl} name={name} />
      <ScholarInfo
        name={name}
        country={countryName}
        bio={bio}
        languages={languages}
        languagesLabel={t('languages')}
      />
      <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
    </article>
  );
}

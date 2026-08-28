import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { scholars } from '@/data/scholars';
import { countries } from '@/data/countries';
import { specializations } from '@/data/specializations';
import { getTranslation, supportedLngs } from '@/lib/i18n';
import { languageLabel, localize } from '@/lib/languages';
import SocialMediaLinks from '@/components/SocialMediaLinks';

interface ScholarPageProps {
  params: Promise<{ locale: string; id: string }>;
}

function getScholar(id: number) {
  return scholars.find((s) => s.id === id);
}

export function generateStaticParams() {
  return supportedLngs.flatMap((locale) =>
    scholars.map((scholar) => ({ locale, id: String(scholar.id) })),
  );
}

export async function generateMetadata({
  params,
}: ScholarPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const scholar = getScholar(Number(id));
  if (!scholar) return {};
  const name = localize(scholar.name, locale);
  const bio = scholar.bio ? localize(scholar.bio, locale) : undefined;
  return {
    title: name,
    description: bio ?? name,
  };
}

export default async function ScholarDetailPage({ params }: ScholarPageProps) {
  const { locale, id } = await params;
  const scholar = getScholar(Number(id));
  if (!scholar) notFound();

  const { t } = await getTranslation(locale, ['common', 'scholar']);

  const name = localize(scholar.name, locale);
  const bio = scholar.bio ? localize(scholar.bio, locale) : undefined;
  const country = countries.find((c) => c.id === scholar.countryId);
  const countryName = country
    ? locale === 'ar'
      ? country.ar
      : country.en
    : '';
  const specialization = specializations.find((s) => s.id === scholar.categoryId);
  const specializationName = specialization
    ? locale === 'ar'
      ? specialization.ar
      : specialization.en
    : '';
  const languages = scholar.language.map((code) => languageLabel(code, locale));

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/${locale}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 rtl:rotate-180"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        {t('backToDirectory')}
      </Link>

      <article className="flex flex-col items-center text-center">
        <Image
          src={scholar.avatarUrl || '/avatars/default-avatar.png'}
          alt={name}
          width={192}
          height={192}
          className="mb-5 h-48 w-48 rounded-full object-cover bg-muted shadow-sm ring-2 ring-border"
        />
        <h1 className="text-display-sm text-foreground">{name}</h1>
        {countryName && <p className="mt-2 text-muted-foreground">{countryName}</p>}
        {specializationName && (
          <span className="mt-3 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground ring-1 ring-border">
            {specializationName}
          </span>
        )}
        {bio && (
          <p className="mt-6 text-foreground/90 leading-relaxed font-serif">{bio}</p>
        )}
        <p className="mt-6 text-xs text-muted-foreground">
          {t('languages', { ns: 'scholar' })}
        </p>
        <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
          {languages.map((lang) => (
            <span
              key={lang}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground ring-1 ring-border"
            >
              {lang}
            </span>
          ))}
        </div>
        <div className="mt-6 w-full">
          <SocialMediaLinks socialMedia={scholar.socialMedia} name={name} />
        </div>
      </article>
    </div>
  );
}

import type { MetadataRoute } from 'next';
import { scholars } from '@/data/scholars';
import { supportedLngs } from '@/lib/i18n';

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000';
const baseUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const localeEntries: MetadataRoute.Sitemap = supportedLngs.map((locale) => ({
    url: `${baseUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }));

  const profileEntries: MetadataRoute.Sitemap = supportedLngs.flatMap((locale) =>
    scholars.map((scholar) => ({
      url: `${baseUrl}/${locale}/scholars/${scholar.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
  );

  return [...localeEntries, ...profileEntries];
}

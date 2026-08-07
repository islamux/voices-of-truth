import type { MetadataRoute } from 'next';

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000';
const baseUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

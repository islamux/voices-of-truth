import type { MetadataRoute } from 'next';

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? 'http://localhost:3000';
const baseUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

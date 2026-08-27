import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supportedLngs as locales, fallbackLng as defaultLocale } from '@/lib/locales';

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const detectedLocale = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim())
      .find((lang) => locales.includes(lang.substring(0, 2)));

    if (detectedLocale) {
      return detectedLocale.substring(0, 2);
    }
  }

  return defaultLocale;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url),
    );
  }

  const locale =
    locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    ) ?? defaultLocale;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-locale', locale);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.webmanifest|robots.txt|sitemap.xml|avatars|locales).*)',
  ],
};

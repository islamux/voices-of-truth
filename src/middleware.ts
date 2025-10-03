import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/*
  Purpose of this middleware (simple words):
  -----------------------------------------
  1. Ensure every page URL starts with a locale segment: /en/..., /ar/..., etc.
     If the user visits "/" or "/about" we redirect them to "/en" or "/ar" based on their browser language.
  2. Detect the user's preferred language from the Accept-Language HTTP header.
  3. Fall back to a default language when we can't confidently detect one.

  When does this run?
  - It runs BEFORE your actual route handlers (server components / API) because Next.js middleware sits in front
    of the request handling pipeline.

  What is a locale segment?
  - It's the first part of the path after the leading slash. Example: /en/profile -> locale = "en".

  You will change this file when:
  - You add or remove supported languages.
  - You want a different detection strategy (e.g. cookies, user profile, query param like ?lang=).
  - You want to exclude or include more paths in matcher.
*/

// 1. List of supported locales (edit this list to add a new language).
const locales = ['en', 'ar'];
// 2. Fallback locale if we cannot detect or match the user's language.
const defaultLocale = 'en';

/*
  Step-by-step: detect the best locale from the request.
  -----------------------------------------------------
  1. Read the Accept-Language header (sent by the browser automatically; looks like: "en-US,en;q=0.9,ar;q=0.7").
  2. Split by comma to get each language token.
  3. Remove any quality weights (the ";q=0.9" parts) and trim spaces.
  4. Compare the first 2 letters of each candidate (e.g. "en-US" -> "en") against our supported list.
  5. Return the first supported match or fall back to default.
*/
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const detectedLocale = acceptLanguage
      .split(',') // Step 2
      .map(lang => lang.split(';')[0].trim()) // Step 3
      .find(lang => locales.includes(lang.substring(0, 2))); // Step 4

    if (detectedLocale) {
      return detectedLocale.substring(0, 2); // Normalize e.g. en-US -> en
    }
  }

  return defaultLocale; // Step 5 (fallback)
}

/*
  Main middleware logic:
  ----------------------
  1. Get the current pathname (e.g. "/", "/en/about", "/dashboard").
  2. Check if it already starts with ANY supported locale segment.
  3. If NOT, we detect the preferred locale and redirect to a new URL that includes it.
  4. If it DOES already include a locale, we do nothing and let the request continue.
*/
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname; // Step 1

  // Step 2: does the current path already contain a supported locale?
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Step 3: If missing locale, build a redirect URL that injects it.
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }
  // Step 4: If a locale is present, do nothing (implicitly continue).
}

/*
  Configure which incoming request paths this middleware should run on.
  Explanation of the matcher pattern:
  '/((?!api|_next/static|_next/image|favicon.ico|avatars|locales).*)'
  -> Use a negative lookahead to EXCLUDE internal/system paths so we don't waste time rewriting those.
  You typically add new static asset folders here if needed.
*/
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|avatars|locales).*)',
  ],
};

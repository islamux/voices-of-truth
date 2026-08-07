import type { Metadata, Viewport } from "next";
import "./globals.css";
import { dir } from "i18next";
import { headers } from "next/headers";
import { Space_Grotesk, IBM_Plex_Sans, Markazi_Text, Amiri } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const markazi = Markazi_Text({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-markazi",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.VERCEL_URL ?? "http://localhost:3000";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#1b2433" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Voices of Truth",
    template: "%s · Voices of Truth",
  },
  description:
    "A bilingual directory of renowned Islamic scholars and preachers worldwide.",
  applicationName: "Voices of Truth",
  keywords: [
    "Islamic scholars",
    "Muslim preachers",
    "duaat",
    "Quran studies",
    "Islamic knowledge",
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = (await headers()).get("x-locale") ?? "en";
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('theme') || 'system';
        var resolved = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      } catch(e) {}
    })();
  `;
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${grotesk.variable} ${plex.variable} ${markazi.variable} ${amiri.variable} bg-background text-foreground w-full min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

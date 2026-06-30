import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale?: string}>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale = 'en'} = await params;
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
    <body className="bg-background dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-[url('/assets/khwater.png')] bg-cover bg-center bg-fixed bg-no-repeat w-full min-h-screen">{children}</body>
    </html>
  );
}

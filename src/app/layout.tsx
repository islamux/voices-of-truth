import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ locale: string }>; // align with Next.js LayoutProps typing expectation
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const resolvedParams = params ? await params : { locale: 'en' };
  const { locale } = resolvedParams;
  return (
    <html lang={locale} dir={dir(locale)}>
      <body>{children}</body>
    </html>
  );
}

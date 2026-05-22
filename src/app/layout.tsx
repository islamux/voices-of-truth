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
  // Default to English if no locale is provided
  const {locale = 'en'} = await params;
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
    <body className="bg-background dark:bg-gradient-to-br dark:from-gray-900 dark:to-black bg-[url('/assets/khwater.png')] bg-cover bg-center bg-fixed bg-no-repeat w-full min-h-screen">{children}</body>
    </html>
  );
}

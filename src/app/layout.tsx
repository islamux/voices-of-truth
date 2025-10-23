import type { Metadata } from "next";
import "./globals.css";
import { dir } from "i18next";

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{locale:string}>; 
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const {locale} = await params;
  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning>
    <body>{children}</body>
    </html>
  );
}

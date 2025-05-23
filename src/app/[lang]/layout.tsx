import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import I18nProviderClient from '../../components/I18nProviderClient'; // Adjust path

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voices of Truth",
  description: "A directory of scholars and preachers.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}

import HomePage from './page';

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const awaitedParams = await params;
  return (
    <html lang={awaitedParams.lang} dir={awaitedParams.lang === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProviderClient>
          <HomePage lang={awaitedParams.lang} />
          {children}
        </I18nProviderClient>
      </body>
    </html>
  );
}

// src/components/PageLayout.tsx
'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    // The background is now handled by the body tag in globals.css
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6">{children}</main>
      <Footer />
    </div>
  );
}

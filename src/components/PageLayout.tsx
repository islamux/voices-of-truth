// src/components/PageLayout.tsx
"use client";

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-transparent to-[rgb(var(--background-end-rgb))] bg-[rgb(var(--background-start-rgb))]">
    <Header />
    <main className="flex-grow container mx-auto p-4 md:p-6">
    {children}
    </main>
    <Footer />
    </div>
  );
}


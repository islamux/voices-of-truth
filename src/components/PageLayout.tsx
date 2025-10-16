// src/components/PageLayout.tsx
'use client';

import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageLayoutProps{
  children: ReactNode
}

export default function PageLayout({children}:PageLayoutProps){

  return (
    <div className="flex-grow container mx-auto p-4 from-transparent to-[rgp]">
    <Header />
    <main>{children}</main> <!-- page content -->
    <Footer /> 
    </div>
  );
}

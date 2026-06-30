'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = useCallback((page: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }
    const search = params.toString();
    router.replace(`${pathname}${search ? `?${search}` : ''}`);
  }, [pathname, router, searchParams]);

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-8 mb-4" aria-label="Pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 rounded-md bg-card border border-border text-foreground disabled:opacity-40 hover:bg-accent transition-colors"
        aria-label="Previous page"
      >
        Prev
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-3 py-1.5 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border text-foreground hover:bg-accent'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 rounded-md bg-card border border-border text-foreground disabled:opacity-40 hover:bg-accent transition-colors"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

type PageItem = number | 'ellipsis';

function getPages(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('ellipsis');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

function ChevronIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 ${className}`}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (page <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      const search = params.toString();
      router.replace(`${pathname}${search ? `?${search}` : ''}`);
    },
    [pathname, router, searchParams],
  );

  if (totalPages <= 1) return null;

  const pages = getPages(currentPage, totalPages);
  const base =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <nav
      className="mt-10 mb-4 flex flex-wrap items-center justify-center gap-1.5"
      aria-label={t('scholars')}
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${base} border border-border bg-card text-foreground hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-40`}
        aria-label={t('prev')}
      >
        <ChevronIcon className="rotate-180" />
        <span className="sr-only">{t('prev')}</span>
      </button>

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-muted-foreground"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goToPage(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`${t('page')} ${page}`}
            className={`${base} ${
              page === currentPage
                ? 'bg-primary font-medium text-primary-foreground'
                : 'border border-border bg-card text-foreground hover:bg-accent/10'
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${base} border border-border bg-card text-foreground hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-40`}
        aria-label={t('next')}
      >
        <ChevronIcon />
        <span className="sr-only">{t('next')}</span>
      </button>
    </nav>
  );
}

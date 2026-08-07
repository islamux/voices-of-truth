'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilters } from '@/context/FilterContext';

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function SearchInput() {
  const { t } = useTranslation('common');
  const { onSearchChange, currentFilters } = useFilters();
  const [value, setValue] = useState(currentFilters.query);
  const [lastQuery, setLastQuery] = useState(currentFilters.query);
  const inputRef = useRef<HTMLInputElement>(null);

  if (currentFilters.query !== lastQuery) {
    setLastQuery(currentFilters.query);
    setValue(currentFilters.query);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      if (value !== currentFilters.query) onSearchChange(value);
    }, 300);
    return () => clearTimeout(id);
  }, [value, currentFilters.query, onSearchChange]);

  return (
    <div className="relative w-full">
      <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-muted-foreground">
        <SearchIcon />
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        className="h-10 w-full rounded-md border border-border bg-background ps-9 pe-9 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('');
            inputRef.current?.focus();
          }}
          aria-label={t('clearSearch')}
          className="absolute inset-y-0 end-2.5 flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}

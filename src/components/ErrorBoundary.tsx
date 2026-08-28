'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorFallback({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h2 className="font-display text-2xl font-bold text-foreground">
        {t('errorTitle')}
      </h2>
      <p className="max-w-md text-muted-foreground">{t('errorDescription')}</p>
      <button
        onClick={onReset}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          onReset={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

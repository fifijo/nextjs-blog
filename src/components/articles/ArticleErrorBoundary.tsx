'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorMessage } from '../common/ErrorMessage/ErrorMessage';

function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error to monitoring service
    console.error('Article Error:', error);
  }, [error]);

  const handleReset = () => {
    resetErrorBoundary();
    router.refresh();
  };

  return (
    <ErrorMessage
      title="Something went wrong"
      message={error.message || 'An unexpected error occurred while displaying the article'}
      onRetry={handleReset}
      showHomeButton
      isErrorBoundary
    />
  );
}

export function ArticleErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={(details) => {
        // Reset any state that may have caused the error
        console.log('Error boundary reset:', details);
      }}
      resetKeys={['article']} // Reset when article prop changes
    >
      {children}
    </ErrorBoundary>
  );
}

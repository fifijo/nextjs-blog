'use client';

import { memo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  isErrorBoundary?: boolean;
}

const ErrorMessageComponent: React.FC<ErrorMessageProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading the content.',
  onRetry,
  showHomeButton = false,
  isErrorBoundary = false
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleGoHome = () => {
    router.push('/');
  };

  const shouldShowHomeButton = showHomeButton && pathname !== '/';

  return (
    <div
      className={styles.errorContainer}
      role="alert"
      aria-live="polite"
    >
      <h2 className={styles.errorTitle}>{title}</h2>
      <p className={styles.errorMessage}>{message}</p>
      <div className={styles.errorActions}>
        {shouldShowHomeButton && (
          <button
            onClick={handleGoHome}
            className={styles.primaryButton}
          >
            Return Home
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className={isErrorBoundary ? styles.secondaryButton : styles.primaryButton}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export const ErrorMessage = memo(ErrorMessageComponent);
ErrorMessage.displayName = 'ErrorMessage';

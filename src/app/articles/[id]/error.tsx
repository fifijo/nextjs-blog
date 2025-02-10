'use client';

import styles from './page.module.css';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { error?: { statusCode: number } };
  reset: () => void;
}

export default function ArticleError({ error, reset }: ErrorProps) {
  const isServerError = error.error?.statusCode === 500;

  return (
    <div className={styles.errorContainer}>
      <h1 className={styles.errorTitle}>
        {isServerError ? 'Server Error' : 'Something went wrong'}
      </h1>
      <p className={styles.errorMessage}>{error.message}</p>
      <div className={styles.errorActions}>
        <button onClick={reset} className={styles.retryButton}>
          Try again
        </button>
        <Link href="/" className={styles.backLink}>
          Back to Articles
        </Link>
      </div>
    </div>
  );
}

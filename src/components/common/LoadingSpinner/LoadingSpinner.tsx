'use client';

import { memo } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinnerComponent = () => {
  return (
    <div className={styles.spinner} role="status" aria-label="Loading">
      <div className={styles.dot} />
      <div className={styles.dot} />
      <div className={styles.dot} />
    </div>
  );
};

export const LoadingSpinner = memo(LoadingSpinnerComponent);
LoadingSpinner.displayName = 'LoadingSpinner';

'use client';

import { memo } from 'react';
import styles from './ArticleControls.module.css';

export type SortOption = 'title' | 'date';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortSelectComponent: React.FC<SortSelectProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className={styles.selectWrapper}>
      <label htmlFor="sort-select" className={styles.selectLabel}>Sort by</label>
      <select
        id="sort-select"
        className={styles.sortSelect}
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
      >
        <option value="date">Newest First</option>
        <option value="title">By Title</option>
      </select>
    </div>
  );
};

export const SortSelect = memo(SortSelectComponent);
SortSelect.displayName = 'SortSelect';

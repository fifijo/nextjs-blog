'use client';

import { memo } from 'react';
import { Category } from '@/lib/types';
import styles from './ArticleControls.module.css';

interface SelectedCategoryProps {
  category: Category;
  onRemove: () => void;
}

const SelectedCategoryComponent: React.FC<SelectedCategoryProps> = ({
  category : {
    color,
    name
  },
  onRemove,
}) => {
  return (
    <div
      className={styles.activeCategory}
    >
      <span style={{ color: color, borderBottom: `2px solid ${color}` }}>
        {name}
      </span>

      <button
        className={styles.removeCategory}
        onClick={onRemove}
        aria-label="Remove category filter"
      >
        x
      </button>
    </div>
  );
};

export const SelectedCategory = memo(SelectedCategoryComponent);
SelectedCategory.displayName = 'SelectedCategory';

'use client';

import { Category } from '@/lib/types';
import { memo } from 'react';
import { SelectedCategory } from './SelectedCategory';
import { SortSelect, SortOption } from './SortSelect';
import styles from './ArticleControls.module.css';

interface ArticleControlsProps {
  sortValue: SortOption;
  onSortChange: (value: SortOption) => void;
  selectedCategory?: Category;
  onRemoveCategory?: () => void;
}

const ArticleControlsComponent: React.FC<ArticleControlsProps> = ({
  sortValue,
  onSortChange,
  selectedCategory,
  onRemoveCategory,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.row}>
        <SortSelect value={sortValue} onChange={onSortChange} />
      </div>
      {selectedCategory && onRemoveCategory && (
        <div className={styles.row}>
          <SelectedCategory
            category={selectedCategory}
            onRemove={onRemoveCategory}
          />
        </div>
      )}
    </div>
  );
};

export const ArticleControls = memo(ArticleControlsComponent);
ArticleControls.displayName = 'ArticleControls';

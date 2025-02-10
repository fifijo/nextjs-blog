'use client';

import { memo } from 'react';
import { Category } from '@/lib/types';
import styles from './CategoryBox.module.css';

interface CategoryBoxProps {
  category: Category;
  active?: boolean;
  onClick: (categoryId: number) => void;
}

const CategoryBoxComponent: React.FC<CategoryBoxProps> = ({
  category : {
    color,
    id,
    name
  },
  active = false,
  onClick
}) => {
  const boxStyle = {
    backgroundColor: color,
    ...(active && {
      borderBottom: `2px solid black`
    })
  };

  return (
    <button
      className={`${styles.categoryBox} ${active ? styles.active : ''}`}
      style={boxStyle}
      onClick={() => onClick(id)}
      type="button"
      aria-pressed={active}
      data-testid="category-button">
      <div className={styles.iconNameWrapper}>
        <span className={styles.name}>{name}</span>
      </div>
    </button>
  );
};

export const CategoryBox = memo(CategoryBoxComponent);
CategoryBox.displayName = 'CategoryBox';

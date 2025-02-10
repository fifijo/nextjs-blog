'use client';

import { categories } from '@/lib/data/categories';
import { CategoryBox } from '../CategoryBox/CategoryBox';
import { useRef, useState, useEffect } from 'react';
import styles from './CategoryList.module.css';

interface CategoryListProps {
  selectedCategory: number | null;
  onCategorySelect: (categoryId: number) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(0);
    } else {
      onCategorySelect(categoryId);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      window.addEventListener('resize', handleScroll);

      return () => {
        container.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, []);

  return (
    <div className={styles.container}>
      {showLeftArrow && (
        <button
          className={`${styles.arrow} ${styles.leftArrow}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          ←
        </button>
      )}
      <div className={styles.categoryList} ref={containerRef} onScroll={handleScroll}>
        {categories.map((category) => (
          <CategoryBox
            key={category.id}
            category={category}
            active={category.id === selectedCategory}
            onClick={handleCategoryClick}
          />
        ))}
      </div>
      {showRightArrow && (
        <button
          className={`${styles.arrow} ${styles.rightArrow}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          →
        </button>
      )}
    </div>
  );
};

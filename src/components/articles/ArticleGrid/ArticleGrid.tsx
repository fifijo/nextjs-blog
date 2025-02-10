'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ArticleResponseDTO } from '@/lib/types/dto/article.dto';
import { ArticleCard } from '../ArticleCard/ArticleCard';
import { ArticleControls } from '../ArticleControls/ArticleControls';
import { SortOption } from '../ArticleControls/SortSelect';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import styles from './ArticleGrid.module.css';

interface ArticleGridProps {
  articles: ArticleResponseDTO[];
  sortOrder: 'asc' | 'desc';
  selectedCategoryId: number | null;
  onSortChange: (value: SortOption) => void;
  onCategoryRemove?: () => void;
  onLoadMore: () => void;
  isLoading: boolean;
  hasMore: boolean;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  articles,
  sortOrder,
  selectedCategoryId,
  onSortChange,
  onCategoryRemove,
  onLoadMore,
  isLoading,
  hasMore,
}) => {
  const observerTarget = useRef(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !isLoading && hasMore) {
        onLoadMore();
      }
    },
    [onLoadMore, isLoading, hasMore]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    observer.observe(element);

     return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver]);

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortOrder === 'desc') {
      const dateA = new Date(a.publishedTime).getTime();
      const dateB = new Date(b.publishedTime).getTime();
      return dateB - dateA;
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  if (sortedArticles.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No articles found</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ArticleControls
        sortValue={sortOrder === 'desc' ? 'date' : 'title'}
        onSortChange={onSortChange}
        selectedCategory={selectedCategoryId && sortedArticles.length > 0 ? sortedArticles[0].category : undefined}
        onRemoveCategory={onCategoryRemove}
      />
      <div className={styles.grid}>
        {sortedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
      {isLoading && (
        <div className={styles.loading}>
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && hasMore && <div ref={observerTarget} className={styles.loadMoreTrigger} />}
    </div>
  );
};

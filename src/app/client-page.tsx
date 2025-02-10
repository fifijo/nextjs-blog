'use client';

import { useState, useCallback, useEffect } from 'react';
import { ArticleResponseDTO } from '@/lib/types/dto/article.dto';
import { CategoryList } from '@/components/categories/CategoryList/CategoryList';
import { ArticleGrid } from '@/components/articles/ArticleGrid/ArticleGrid';
import { ArticleService } from '@/lib/services/article.service';
import { categories } from '@/lib/data/categories';

interface ClientHomePageProps {
  initialArticles: ArticleResponseDTO[];
}

export const ClientHomePage = ({ initialArticles }: ClientHomePageProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [articles, setArticles] = useState<ArticleResponseDTO[]>(initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const loadArticles = useCallback(async () => {

    try {
      setIsLoading(true);
      const articleService = ArticleService.getInstance();
      const response = await articleService.getArticles({
        category: selectedCategoryId ? categories.find(c => c.id === selectedCategoryId)?.name || null : null,
        sortOrder,
        page,
        pageSize: 10,
        favorites: false
      });

      if (page === 1) {
        setArticles(response.articles);
      } else {
        setArticles(prev => {
          const existingIds = new Set(prev.map(article => article.id));
          const newArticles = response.articles.filter(article => !existingIds.has(article.id));
          return [...prev, ...newArticles];
        });
      }

      setHasMore(response.pagination.hasMore);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategoryId, sortOrder, page]);

  const handleCategorySelect = useCallback((categoryId: number) => {
    setSelectedCategoryId(prevId => prevId === categoryId ? null : categoryId);
    setPage(1);
    setHasMore(true);
  }, []);

  const handleCategoryRemove = useCallback(() => {
    setSelectedCategoryId(null);
    setPage(1);
    setHasMore(true);
  }, []);

  const handleSortChange = useCallback((value: 'date' | 'title') => {
    setSortOrder(value === 'date' ? 'desc' : 'asc');
    setPage(1);
    setHasMore(true);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return (
    <>
      <div>
        <CategoryList
          selectedCategory={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
        />
      </div>
      <ArticleGrid
        articles={articles}
        selectedCategoryId={selectedCategoryId}
        onCategoryRemove={handleCategoryRemove}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onLoadMore={handleLoadMore}
        isLoading={isLoading}
        hasMore={hasMore}
      />
    </>
  );
};

import { useState, useCallback, useEffect } from 'react';
import { Article } from '@/lib/types/models/article.model';
import { ArticleService } from '@/lib/services/article.service';
import { ApiError } from '@/lib/services/base.service';

interface UseArticleResult {
  article: Article | null;
  isLoading: boolean;
  error: string | null;
  retry: () => Promise<void>;
}

export function useArticle(id: string): UseArticleResult {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const articleService = ArticleService.getInstance();

  const fetchData = useCallback(async () => {
    if (!id) {
      setError('Article ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await articleService.getArticleById(id);
      setArticle(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while loading the article');
        console.error('Unexpected error:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, articleService]);

  const retry = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    // Cleanup function to handle component unmount
    return () => {
      setArticle(null);
      setError(null);
    };
  }, [fetchData]);

  return {
    article,
    isLoading,
    error,
    retry,
  };
}

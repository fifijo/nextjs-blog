import { Suspense } from 'react';
import { fetchArticles } from '@/lib/api/articles';
import { ArticleResponseDTO } from '@/lib/types/dto/article.dto';

interface ArticleDTO extends ArticleResponseDTO {
  isFavorite: boolean;
}
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage/ErrorMessage';
import { ClientHomePage } from './client-page';

async function getArticles(): Promise<ArticleDTO[]> {
  try {
    const articlesResponse = await fetchArticles();
    return articlesResponse.map(article => ({
      ...article,
      category: {
        ...article.category,
        icon: article.category.icon || '📄'
      },
      isFavorite: false,
    }));
  } catch (error) {
    console.error('Error loading articles:', error);
    throw new Error('Failed to load articles');
  }
}

export default async function Home() {
  let articles: ArticleDTO[];

  try {
    articles = await getArticles();
  } catch {
    return <ErrorMessage message="Failed to load articles. Please refresh the page." />;
  }

  return (
      <Suspense fallback={<LoadingSpinner />}>
        <ClientHomePage initialArticles={articles} />
      </Suspense>
  );
}

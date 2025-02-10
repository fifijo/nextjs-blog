import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { ArticleService } from '@/lib/services/article.service';
import { ArticleView } from '@/components/articles/ArticleView';
import { LoadingSpinner } from '@/components/common/LoadingSpinner/LoadingSpinner';
import { ArticleErrorBoundary } from '@/components/articles/ArticleErrorBoundary';
import { ApiError } from '@/lib/services/base.service';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const [articleService, parentMeta, resolvedParams] = await Promise.all([
    Promise.resolve(ArticleService.getInstance()),
    parent,
    params
  ]);

  const { id } = resolvedParams;

  try {
    const article = await articleService.getArticleById(id);
    const description = article.body.slice(0, 160).trim() + '...';

    return {
      title: `${article.title} | ${parentMeta.title?.absolute || 'Blog'}`,
      description,
      keywords: article.tags.join(', '),
      authors: [{ name: 'Blog Author' }],
      openGraph: {
        title: article.title,
        description,
        type: 'article',
        publishedTime: article.publishedTime,
        tags: article.tags,
        images: [
          {
            url: '/images/default-article.jpg',
            width: 1200,
            height: 630,
            alt: article.title
          },
          ...(parentMeta.openGraph?.images || [])
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description
      }
    };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return notFoundMetadata;
    }
    return defaultMetadata;
  }
}

export default async function ArticlePage({ params }: Props) {
  const [articleService, resolvedParams] = await Promise.all([
    Promise.resolve(ArticleService.getInstance()),
    params
  ]);

  const { id } = resolvedParams;

  try {
    const article = await articleService.getArticleById(id);

    if (!article) {
      notFound();
    }

    return (
      <div className="article-page">
        <ArticleErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <ArticleView article={article} />
          </Suspense>
        </ArticleErrorBoundary>
      </div>
    );
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }
}

const defaultMetadata: Metadata = {
  title: 'Blog Article',
  description: 'Read our latest blog article',
  openGraph: {
    type: 'article'
  }
};

const notFoundMetadata: Metadata = {
  title: 'Article Not Found',
  description: 'The requested article could not be found',
  robots: {
    index: false,
    follow: false
  }
};

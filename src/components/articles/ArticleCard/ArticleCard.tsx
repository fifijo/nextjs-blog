'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { ArticleResponseDTO } from '@/lib/types/dto/article.dto';
import { DateTimeHelper } from '@/lib/helpers/datetime';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  article: ArticleResponseDTO;
}

const ArticleCardComponent: React.FC<ArticleCardProps> = ({
  article
}) => {
  const formattedDate = DateTimeHelper.formatDate(article.publishedTime);

  const truncatedBody = article.body.length > 150
    ? `${article.body.substring(0, 150)}...`
    : article.body;

  const router = useRouter();

  const handleClick = () => {
    router.push(`/articles/${article.id}`);
  };

  return (
    <article
      className={styles.card}
      onClick={handleClick}
      data-testid="article-card"
      role="article"
    >
      <span
        className={styles.category}
        style={{ backgroundColor: article.category.color }}
      >
        {article.category.name}
      </span>

      <h2 className={styles.title}>{article.title}</h2>
      <time className={styles.date}>{formattedDate}</time>
      <p className={styles.description}>{truncatedBody}</p>

      <div className={styles.footer}>
        <span className={styles.readMore}>Read more →</span>
      </div>
    </article>
  );
};

export const ArticleCard = memo(ArticleCardComponent);
ArticleCard.displayName = 'ArticleCard';

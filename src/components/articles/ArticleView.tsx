'use client';

import Link from 'next/link';
import { Article } from '@/lib/types/models/article.model';
import { DateTimeHelper } from '@/lib/helpers/datetime';
import styles from './ArticleView.module.css';

interface ArticleViewProps {
  article: Article;
}

export function ArticleView({ article }: ArticleViewProps) {
  const formattedDate = DateTimeHelper.formatDate(article.publishedTime, 'pl-PL');

  return (
    <main
      className={styles.container}
      aria-labelledby="article-title"
    >
      <div className={styles.header}>
        <nav className={styles.navigation} aria-label="Article navigation">
          <Link
            href="/"
            className={styles.backLink}
            aria-label="Back to articles list"
          >
            <span aria-hidden="true">←</span> Back to Articles
          </Link>
        </nav>

        <div className={styles.metadata}>
          <span
            className={styles.category}
            style={{
              backgroundColor: article.category.color,
              color: getContrastColor(article.category.color)
            }}
            role="status"
          >
            {article.category.name}
          </span>

          <h1 id="article-title" className={styles.title}>
            {article.title}
          </h1>

          <time
            dateTime={article.publishedTime}
            className={styles.date}
          >
            {formattedDate}
          </time>
        </div>
      </div>

      <article
        className={styles.content}
        aria-label="Article content"
      >
        {article.body.split('\n').map((paragraph, index) => (
          <p key={`p-${index}`}>{paragraph}</p>
        ))}
      </article>

      <footer className={styles.footer}>
        <div
          className={styles.tags}
          role="list"
          aria-label="Article tags"
        >
          {article.tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
              role="listitem"
            >
              #{tag}
            </span>
          ))}
        </div>
      </footer>
    </main>
  );
}

// Helper function to determine text color based on background color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? '#000000' : '#ffffff';
}

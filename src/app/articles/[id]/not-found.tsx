import { ArticleError } from '../../../components/articles/ArticleError';

export default function ArticleNotFound() {
  return (
    <ArticleError
      title="Article not found"
      error="The article you're looking for doesn't exist."
    />
  );
}

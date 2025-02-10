import { FC } from 'react';
import { ErrorMessage } from '@/components/common/ErrorMessage/ErrorMessage';

interface ArticleErrorProps {
  title?: string;
  error: string;
  resetErrorBoundary?: () => void;
}

export const ArticleError: FC<ArticleErrorProps> = ({
  title = 'Error',
  error,
  resetErrorBoundary,
}) => {
  return (
    <ErrorMessage
      title={title}
      message={error}
      onRetry={resetErrorBoundary}
    />
  );
};

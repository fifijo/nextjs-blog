export interface ApiArticleDTO {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CategoryDTO {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface ArticleResponseDTO extends ApiArticleDTO {
  category: CategoryDTO;
  publishedTime: string;
  tags: string[];
}

export type SortOrder = 'asc' | 'desc';

export interface PaginationDTO {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface ArticleFilterDTO {
  category: string | null;
  favorites: boolean;
  sortOrder: SortOrder;
  page: number;
  pageSize: number;
}

export interface PaginatedArticlesDTO {
  articles: ArticleResponseDTO[];
  pagination: PaginationDTO;
}

export interface ApiErrorDTO {
  message: string;
  statusCode: number;
}

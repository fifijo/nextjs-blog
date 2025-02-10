export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Article {
  id: number;
  title: string;
  body: string;
  userId: number;
  category: Category;
  publishedTime: string;
  tags: string[];
}

export interface ArticleFilters {
  category: string | null;
  favorites: boolean;
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

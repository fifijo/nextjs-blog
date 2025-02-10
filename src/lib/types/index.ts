export interface ArticleDTO {
  id: number;
  title: string;
  body: string;
  userId: number;
  category: Category;
  publishedTime: string;
  tags: string[];
  isFavorite: boolean;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon?: string;
  image?: string;
}

export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  category: string | null;
  favorites: boolean;
  sortOrder: SortOrder;
}

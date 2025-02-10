import { categories } from '../data/categories';
import {
  ApiArticleDTO,
  ArticleResponseDTO
} from '../types/dto/article.dto';
import { ApiHelper, createApiRequestOptions } from '../helpers/api';
import { DateTimeHelper } from '../helpers/datetime';

const API_URL = 'https://jsonplaceholder.typicode.com';

const mapToArticleDTO = (post: ApiArticleDTO): ArticleResponseDTO => {
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomDate = DateTimeHelper.generateRandomDate(2);

  return {
    ...post,
    category: randomCategory,
    publishedTime: DateTimeHelper.toISOString(randomDate),
    tags: [randomCategory.name, 'Featured', 'New'],
  };
};

export const fetchArticles = async (): Promise<ArticleResponseDTO[]> => {
  try {
    const response = await fetch(
      `${API_URL}/posts`,
      createApiRequestOptions()
    );

    const posts = await ApiHelper.handleResponse<ApiArticleDTO[]>(
      response,
      'Failed to fetch articles'
    );
    return posts.map(mapToArticleDTO);
  } catch (error) {
    throw ApiHelper.handleError(
      error,
      'An unexpected error occurred while fetching articles'
    );
  }
};

export const fetchArticle = async (id: string): Promise<ArticleResponseDTO> => {
  try {
    const response = await fetch(
      `${API_URL}/posts/${id}`,
      { ...createApiRequestOptions(), next: { tags: [`article-${id}`] } }
    );

    const post = await ApiHelper.handleResponse<ApiArticleDTO>(
      response,
      'Failed to fetch article'
    );
    return mapToArticleDTO(post);
  } catch (error) {
    throw ApiHelper.handleError(
      error,
      'An unexpected error occurred while fetching article'
    );
  }
};

export const revalidateArticle = async (id: string) => {
  try {
    await fetch(`/api/revalidate?tag=article-${id}`);
  } catch (error) {
    console.error('Error revalidating article:', error);
  }
};

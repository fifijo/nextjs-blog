import { BaseService, ErrorMapping } from './base.service';
import { ApiArticleDTO, ArticleFilterDTO, PaginatedArticlesDTO } from '../types/dto/article.dto';
import { Article, ArticleFilters } from '../types/models/article.model';
import { ArticleMapper } from '../mappers/article.mapper';
import { categories } from '../data/categories';
import { DateTimeHelper } from '../helpers/datetime';
import { HTTP_STATUS } from '../config/api.config';

const ARTICLE_ERROR_MAPPING: ErrorMapping = {
  [HTTP_STATUS.BAD_REQUEST]: 'Invalid article request parameters',
  [HTTP_STATUS.NOT_FOUND]: 'Article not found',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Failed to process article request'
};

export class ArticleService extends BaseService {
  private static instance: ArticleService;

  private constructor() {
    super();
  }

  public static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  private validateId(id: string): void {
    if (!id || !/^\d+$/.test(id)) {
      this.handleError(new Error('Invalid article ID provided'), {
        [HTTP_STATUS.BAD_REQUEST]: 'Invalid article ID provided'
      });
    }
  }

  private enrichArticleData(article: ApiArticleDTO): Article {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const publishedTime = DateTimeHelper.toISOString(
      DateTimeHelper.generateRandomDate(2)
    );

    return {
      ...article,
      category,
      publishedTime,
      tags: [category.name, 'Featured', 'New'],
    };
  }

  public async getArticles(filterDto?: ArticleFilterDTO): Promise<PaginatedArticlesDTO> {
    return this.retryOperation(async () => {
      const articles = await this.fetchWithTimeout<ApiArticleDTO[]>(
        this.createUrl('/posts'),
        {},
        ARTICLE_ERROR_MAPPING
      );

      const enrichedArticles = articles.map(article => this.enrichArticleData(article));

      if (filterDto) {
        const filters = ArticleMapper.toFilters(filterDto);
        const { articles: filteredArticles, total } = this.applyFilters(enrichedArticles, filters);

        const startIndex = (filterDto.page - 1) * filterDto.pageSize;
        const endIndex = startIndex + filterDto.pageSize;
        const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

        return {
          articles: paginatedArticles.map(article => ArticleMapper.toArticleDto(article)),
          pagination: {
            page: filterDto.page,
            pageSize: filterDto.pageSize,
            total,
            hasMore: endIndex < total
          }
        };
      }

      // Return first page if no filters
      return {
        articles: enrichedArticles.slice(0, 10).map(article => ArticleMapper.toArticleDto(article)),
        pagination: {
          page: 1,
          pageSize: 10,
          total: enrichedArticles.length,
          hasMore: enrichedArticles.length > 10
        }
      };
    });
  }

  public async getArticleById(id: string): Promise<Article> {
    this.validateId(id);

    return this.retryOperation(async () => {
      const article = await this.fetchWithTimeout<ApiArticleDTO>(
        this.createUrl(`/posts/${id}`),
        {},
        {
          ...ARTICLE_ERROR_MAPPING,
          [HTTP_STATUS.NOT_FOUND]: `Article with ID ${id} not found`
        }
      );

      if (!article) {
        this.handleError(new Error('Article not found'), {
          [HTTP_STATUS.NOT_FOUND]: `Article with ID ${id} not found`
        });
      }

      return this.enrichArticleData(article);
    });
  }

  private applyFilters(
    articles: Article[],
    filters: ArticleFilters
  ): { articles: Article[]; total: number } {
    let filteredArticles = [...articles];

    if (filters.category) {
      filteredArticles = filteredArticles.filter(
        article => article.category.name.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    if (filters.sortOrder) {
      filteredArticles.sort((a, b) => {
        const dateA = new Date(a.publishedTime).getTime();
        const dateB = new Date(b.publishedTime).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return {
      articles: filteredArticles,
      total: filteredArticles.length
    };
  }

  public async revalidateArticle(id: string): Promise<void> {
    this.validateId(id);

    return this.retryOperation(async () => {
      await this.fetchWithTimeout(
        this.createUrl(`/api/revalidate?tag=article-${id}`),
        {},
        {
          ...ARTICLE_ERROR_MAPPING,
          [HTTP_STATUS.NOT_FOUND]: `Failed to revalidate article ${id}`,
          [HTTP_STATUS.BAD_REQUEST]: 'Invalid revalidation request'
        }
      );
    });
  }
}

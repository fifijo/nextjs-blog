import { ArticleResponseDTO, ApiArticleDTO, CategoryDTO, ArticleFilterDTO } from '@/lib/types/dto/article.dto';
import { Article, Category, ArticleFilters } from '@/lib/types/models/article.model';

export class ArticleMapper {
  static toCategory(dto: CategoryDTO): Category {
    return {
      id: dto.id,
      name: dto.name,
      color: dto.color,
      icon: dto.icon
    };
  }

  static toCategoryDto(model: Category): CategoryDTO {
    return {
      id: model.id,
      name: model.name,
      color: model.color,
      icon: model.icon || '' // Ensure DTO contract is met by providing empty string
    };
  }

  static toArticle(dto: ArticleResponseDTO): Article {
    return {
      id: dto.id,
      title: dto.title,
      body: dto.body,
      userId: dto.userId,
      category: this.toCategory(dto.category),
      publishedTime: dto.publishedTime,
      tags: [...dto.tags]
    };
  }

  static toArticleDto(model: Article): ArticleResponseDTO {
    return {
      id: model.id,
      title: model.title,
      body: model.body,
      userId: model.userId,
      category: this.toCategoryDto(model.category),
      publishedTime: model.publishedTime,
      tags: [...model.tags]
    };
  }

  static toFilters(dto: ArticleFilterDTO): ArticleFilters {
    return {
      category: dto.category,
      favorites: dto.favorites,
      sortOrder: dto.sortOrder,
      page: dto.page || 1,
      pageSize: dto.pageSize || 10
    };
  }

  static toApiArticle(model: Article): ApiArticleDTO {
    return {
      id: model.id,
      title: model.title,
      body: model.body,
      userId: model.userId
    };
  }
}

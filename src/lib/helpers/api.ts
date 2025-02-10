import { ApiErrorDTO } from '../types/dto/article.dto';

export class ApiHelper {
  static async handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
    if (!response.ok) {
      const error: ApiErrorDTO = {
        message: errorMessage,
        statusCode: response.status
      };
      throw new ApiError(error);
    }

    return await response.json();
  }

  static handleError(error: unknown, defaultMessage: string): never {
    console.error(defaultMessage, error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError({
      message: defaultMessage,
      statusCode: 500
    });
  }
}

export class ApiError extends Error {
  constructor(public error: ApiErrorDTO) {
    super(error.message);
    this.name = 'ApiError';
  }
}

export const createApiRequestOptions = (cacheDuration = 3600) => ({
  next: {
    revalidate: cacheDuration,
    tags: ['api-request']
  }
});

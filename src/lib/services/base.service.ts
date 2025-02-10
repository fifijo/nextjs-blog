import { ApiErrorDTO } from '../types/dto/article.dto';
import { API_CONFIG, HTTP_STATUS } from '../config/api.config';

export type ErrorMapping = {
  [key: number]: string;
};

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, errorMapping?: ErrorMapping): ApiError {
    const status = response.status;
    const defaultMessage = 'An unexpected error occurred';

    if (errorMapping && errorMapping[status]) {
      return new ApiError(status, errorMapping[status]);
    }

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new ApiError(status, 'Invalid request parameters');
      case HTTP_STATUS.UNAUTHORIZED:
        return new ApiError(status, 'Authentication required');
      case HTTP_STATUS.FORBIDDEN:
        return new ApiError(status, 'Access denied');
      case HTTP_STATUS.NOT_FOUND:
        return new ApiError(status, 'Resource not found');
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return new ApiError(status, 'Server error occurred');
      default:
        return new ApiError(status, defaultMessage);
    }
  }
}

export abstract class BaseService {
  protected readonly baseUrl: string;

  constructor(baseUrl = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  protected async fetchWithTimeout<T>(
    url: string,
    options: RequestInit = {},
    errorMapping?: ErrorMapping
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let apiError: ApiError;
        try {
          const error: ApiErrorDTO = await response.json();
          apiError = new ApiError(response.status, error.message || 'An error occurred');
        } catch {
          apiError = ApiError.fromResponse(response, errorMapping);
        }
        throw apiError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(
            HTTP_STATUS.GATEWAY_TIMEOUT,
            'Request timeout'
          );
        }
        throw new ApiError(
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error.message
        );
      }

      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'An unexpected error occurred'
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  protected handleError(error: unknown, customMapping?: ErrorMapping): never {
    if (error instanceof ApiError) {
      if (customMapping && customMapping[error.statusCode]) {
        error.message = customMapping[error.statusCode];
      }
      throw error;
    }

    if (error instanceof Error) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error.message
      );
    }

    throw new ApiError(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred'
    );
  }

  protected createUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  protected async retryOperation<T>(
    operation: () => Promise<T>,
    retries = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && error instanceof ApiError) {
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }
}

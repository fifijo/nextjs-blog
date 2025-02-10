import { render, screen, fireEvent } from '@testing-library/react';
import { ArticleCard } from '../ArticleCard';

global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(callback, 0);
};

const mockArticle = {
  id: 1,
  title: 'Test Article',
  body: 'This is a test article body that needs to be more than 150 characters long to test the truncation functionality properly. Adding some more text to make sure we exceed the limit.',
  publishedTime: '2023-01-01T12:00:00Z',
  category: {
    id: 1,
    name: 'Test Category',
    color: '#FF0000',
    icon: 'test-icon',
  },
  userId: 1,
  tags: ['test']
};

const mockRouter = {
  push: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('ArticleCard', () => {
  beforeEach(() => {
    mockRouter.push.mockClear();
  });

  it('renders article information correctly', () => {
    render(
      <ArticleCard article={mockArticle} />
    );

    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText(/This is a test article body/)).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
    expect(screen.getByText('January 1, 2023')).toBeInTheDocument();
    const description = screen.getByText(/This is a test article body/);
    expect(description.textContent?.length).toBeLessThanOrEqual(153);
    expect(description.textContent?.endsWith('...')).toBeTruthy();
  });

  it('handles click events correctly', () => {
    render(
      <ArticleCard article={mockArticle} />
    );

    fireEvent.click(screen.getByTestId('article-card'));
    expect(mockRouter.push).toHaveBeenCalledWith('/articles/1');
  });

});

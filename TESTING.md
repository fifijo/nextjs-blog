# Testing Guide

This project uses Jest and React Testing Library for unit/integration testing, and Playwright for end-to-end testing.

## Unit & Integration Testing

### Setup

The testing environment is configured with:
- Jest for test running and assertions
- React Testing Library for component testing
- jest-environment-jsdom for browser API simulation
- CSS and static asset mocks

### Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Structure

Tests are organized alongside the components they test in `__tests__` directories. For example:
```
src/components/articles/ArticleCard/
├── ArticleCard.tsx
└── __tests__/
    └── ArticleCard.test.tsx
```

### Writing Tests

Example test structure:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('ComponentName', () => {
  // Optional setup/teardown
  beforeEach(() => {
    // Setup code
  });

  it('should render correctly', () => {
    render(<Component />);
    // Add assertions
  });
});
```

### Common Testing Patterns

1. Testing Renders:
```typescript
render(<Component />);
expect(screen.getByText('Expected Text')).toBeInTheDocument();
```

2. Testing User Interactions:
```typescript
const mockFn = jest.fn();
render(<Component onClick={mockFn} />);
fireEvent.click(screen.getByRole('button'));
expect(mockFn).toHaveBeenCalled();
```

3. Testing State Changes:
```typescript
const { rerender } = render(<Component value={initialValue} />);
// Assert initial state
rerender(<Component value={newValue} />);
// Assert new state
```

## End-to-End Testing

### Setup

The project uses Playwright for end-to-end testing, providing:
- Multi-browser testing (Chromium, Firefox, WebKit)
- Built-in assertions and debugging tools
- Network request interception and mocking
- Test recording and codegen capabilities

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI mode for debugging
npm run test:e2e -- --ui

# Run tests in a specific browser
npm run test:e2e -- --project=chromium
```

### E2E Test Structure

E2E tests are located in the `e2e` directory and typically test complete user flows:

```typescript
// e2e/blog.spec.ts
import { test, expect } from '@playwright/test';

test('user can view and interact with blog articles', async ({ page }) => {
  // Test implementation
});
```

### Best Practices for E2E Tests

1. Test critical user paths
2. Use data-testid attributes for reliable element selection (required for components using CSS modules)
3. Isolate tests by resetting state between runs
4. Mock network requests when appropriate
5. Keep tests focused on user behaviors
6. Use test fixtures for common setup
7. Handle async route parameters in Next.js 15 appropriately

Example of handling async route parameters in tests:
```typescript
// For pages with dynamic routes in Next.js 15
type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// In your tests, wait for async parameters to resolve
test('should handle dynamic route', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  // Your test logic here
});
```

Example of using data-testid for reliable testing:
```typescript
// In your component
<button data-testid="category-button">Category</button>

// In your test
await page.waitForSelector('[data-testid="category-button"]', { state: 'visible' });
```

## Mocking

1. CSS Modules are mocked globally (see `__mocks__/styleMock.js`)
2. Static assets are mocked globally (see `__mocks__/fileMock.js`)
3. Next.js components (like Link) should be mocked in individual test files as needed

## Best Practices

1. Use semantic queries when possible (getByRole, getByLabelText, etc.)
2. Test component behavior, not implementation details
3. Write tests that resemble how users interact with components
4. Keep tests focused and isolated
5. Use meaningful test descriptions
6. Clean up after tests using beforeEach/afterEach as needed
7. Maintain test independence - no shared state between tests
8. Follow the testing pyramid: more unit tests, fewer E2E tests

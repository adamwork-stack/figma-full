# Testing Guide

## Overview

This guide covers testing strategies and practices for the Fastivalle application, including backend API tests and mobile app tests.

## Backend Testing

### Unit Tests

Backend unit tests are located in `backend/src/**/*.spec.ts` files.

**Running Tests:**
```bash
cd backend
npm test
```

**Watch Mode:**
```bash
npm run test:watch
```

**Coverage:**
```bash
npm run test:cov
```

### E2E Tests

E2E tests are located in `backend/test/*.e2e-spec.ts` files.

**Running E2E Tests:**
```bash
npm run test:e2e
```

### Test Structure

```typescript
describe('FeatureName', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    // Test implementation
  });
});
```

## Mobile Testing

### Unit Tests

Mobile unit tests are located in `mobile/__tests__/` directory.

**Running Tests:**
```bash
cd mobile
npm test
```

**Watch Mode:**
```bash
npm test -- --watch
```

### Component Tests

Component tests use React Native Testing Library:

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/Button';

test('renders button', () => {
  const { getByText } = render(<Button title="Click me" />);
  expect(getByText('Click me')).toBeTruthy();
});
```

### E2E Tests

E2E tests can be set up using Detox or Maestro:

**Detox Setup:**
```bash
npm install --save-dev detox
```

**Running E2E:**
```bash
npm run test:e2e:ios
npm run test:e2e:android
```

## Test Coverage Goals

- **Backend**: 80%+ coverage
- **Mobile**: 70%+ coverage
- **Critical paths**: 100% coverage

## Writing Tests

### Backend Test Example

```typescript
describe('AuthService', () => {
  it('should register a new user', async () => {
    const result = await authService.register(registerDto);
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('accessToken');
  });
});
```

### Mobile Test Example

```typescript
describe('LoginScreen', () => {
  it('should display error on invalid credentials', async () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    fireEvent.changeText(getByPlaceholderText('Email'), 'invalid');
    fireEvent.press(getByText('Sign In'));
    await waitFor(() => {
      expect(getByText('Invalid email')).toBeTruthy();
    });
  });
});
```

## Continuous Integration

Tests should run automatically on:
- Pull requests
- Before merging to main
- On every commit (optional)

## Best Practices

1. **Test isolation**: Each test should be independent
2. **Mock external dependencies**: Don't make real API calls in tests
3. **Test behavior, not implementation**: Focus on what the code does, not how
4. **Use descriptive test names**: Clearly state what is being tested
5. **Keep tests simple**: One assertion per test when possible
6. **Test edge cases**: Include error cases and boundary conditions

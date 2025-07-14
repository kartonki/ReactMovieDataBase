import { render, screen, waitFor } from '@testing-library/react';
import ImageWebp from './ImageWebp';

// Mock localStorage for WebP support detection
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

beforeEach(() => {
  localStorageMock.clear();
});

test('renders with basic props', () => {
  render(<ImageWebp src="/test.jpg" alt="test image" />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('alt', 'test image');
});

test('passes loading="lazy" attribute correctly', () => {
  render(<ImageWebp src="/test.jpg" alt="test image" loading="lazy" />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('loading', 'lazy');
});

test('passes loading="eager" attribute correctly', () => {
  render(<ImageWebp src="/test.jpg" alt="test image" loading="eager" />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('loading', 'eager');
});

test('does not set loading attribute when not provided', () => {
  render(<ImageWebp src="/test.jpg" alt="test image" />);
  const img = screen.getByRole('img');
  expect(img).not.toHaveAttribute('loading');
});

test('passes through other standard img attributes', () => {
  render(
    <ImageWebp 
      src="/test.jpg" 
      alt="test image" 
      className="test-class"
      width={100}
      height={200}
      loading="lazy"
    />
  );
  const img = screen.getByRole('img');
  expect(img).toHaveClass('test-class');
  expect(img).toHaveAttribute('width', '100');
  expect(img).toHaveAttribute('height', '200');
  expect(img).toHaveAttribute('loading', 'lazy');
});
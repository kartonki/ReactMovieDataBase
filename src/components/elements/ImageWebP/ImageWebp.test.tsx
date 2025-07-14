import { render, screen, waitFor } from '@testing-library/react';
import ImageWebp from './ImageWebp';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock Image constructor for WebP support detection
const mockImage = {
  onload: null as any,
  onerror: null as any,
  src: '',
  width: 0,
  height: 0,
};

global.Image = jest.fn(() => mockImage) as any;

describe('ImageWebp Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    jest.clearAllMocks();
  });

  test('renders image with basic props after webp detection', async () => {
    // Mock stored webp support
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ NONE: false, ALL: true }));
    
    render(<ImageWebp src="/test.jpg" alt="test image" />);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('alt', 'test image');
      expect(img).toHaveAttribute('src', '/test.jpg');
    });
  });

  test('renders image with srcset and sizes after webp detection', async () => {
    // Mock stored webp support
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ NONE: false, ALL: true }));
    
    const srcSet = '/test-small.jpg 300w, /test-medium.jpg 600w, /test-large.jpg 1200w';
    const sizes = '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px';
    
    render(
      <ImageWebp 
        src="/test.jpg" 
        srcSet={srcSet}
        sizes={sizes}
        alt="responsive test image" 
      />
    );
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('srcset', srcSet);
      expect(img).toHaveAttribute('sizes', sizes);
    });
  });

  test('renders image without srcset when not provided', async () => {
    // Mock stored webp support
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ NONE: false, ALL: true }));
    
    render(<ImageWebp src="/test.jpg" alt="basic test image" />);
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).not.toHaveAttribute('srcset');
      expect(img).not.toHaveAttribute('sizes');
    });
  });

  test('passes through other image attributes', async () => {
    // Mock stored webp support
    localStorageMock.getItem.mockReturnValue(JSON.stringify({ NONE: false, ALL: true }));
    
    render(
      <ImageWebp 
        src="/test.jpg" 
        alt="test image"
        className="test-class"
        width={300}
        height={200}
      />
    );
    
    await waitFor(() => {
      const img = screen.getByRole('img');
      expect(img).toHaveClass('test-class');
      expect(img).toHaveAttribute('width', '300');
      expect(img).toHaveAttribute('height', '200');
    });
  });

  test('uses transparent image when webp support is not detected yet', () => {
    // No stored webp support
    localStorageMock.getItem.mockReturnValue(null);
    
    render(<ImageWebp src="/test.jpg" alt="test image" />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
  });
});
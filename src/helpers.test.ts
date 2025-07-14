import { generatePosterSrcSet, generateBackdropSrcSet, generateImageSrcSet, POSTER_SIZES, BACKDROP_SIZES } from './helpers';

describe('Image helpers', () => {
  const baseUrl = 'https://image.tmdb.org/t/p/';
  const imagePath = '/test-image.jpg';

  test('generateImageSrcSet creates proper srcset string', () => {
    const sizes = ['w300', 'w500', 'w780'] as const;
    const srcSet = generateImageSrcSet(baseUrl, imagePath, sizes, false);
    
    expect(srcSet).toBe(
      'https://image.tmdb.org/t/p/w300/test-image.jpg 300w, ' +
      'https://image.tmdb.org/t/p/w500/test-image.jpg 500w, ' +
      'https://image.tmdb.org/t/p/w780/test-image.jpg 780w'
    );
  });

  test('generateImageSrcSet includes original when requested', () => {
    const sizes = ['w300', 'original'] as const;
    const srcSet = generateImageSrcSet(baseUrl, imagePath, sizes, true);
    
    expect(srcSet).toContain('https://image.tmdb.org/t/p/w300/test-image.jpg 300w');
    expect(srcSet).toContain('https://image.tmdb.org/t/p/original/test-image.jpg 2000w');
  });

  test('generatePosterSrcSet uses poster sizes', () => {
    const srcSet = generatePosterSrcSet(baseUrl, imagePath);
    
    // Should include all poster sizes except original
    expect(srcSet).toContain('w92/test-image.jpg 92w');
    expect(srcSet).toContain('w154/test-image.jpg 154w');
    expect(srcSet).toContain('w185/test-image.jpg 185w');
    expect(srcSet).toContain('w342/test-image.jpg 342w');
    expect(srcSet).toContain('w500/test-image.jpg 500w');
    expect(srcSet).toContain('w780/test-image.jpg 780w');
    expect(srcSet).toContain('original/test-image.jpg 2000w');
  });

  test('generateBackdropSrcSet uses backdrop sizes', () => {
    const srcSet = generateBackdropSrcSet(baseUrl, imagePath);
    
    // Should include all backdrop sizes
    expect(srcSet).toContain('w300/test-image.jpg 300w');
    expect(srcSet).toContain('w780/test-image.jpg 780w');
    expect(srcSet).toContain('w1280/test-image.jpg 1280w');
    expect(srcSet).toContain('original/test-image.jpg 2000w');
  });

  test('generateImageSrcSet returns empty string for empty imagePath', () => {
    const srcSet = generateImageSrcSet(baseUrl, '', POSTER_SIZES);
    expect(srcSet).toBe('');
  });

  test('POSTER_SIZES and BACKDROP_SIZES are properly defined', () => {
    expect(POSTER_SIZES).toEqual(['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original']);
    expect(BACKDROP_SIZES).toEqual(['w300', 'w780', 'w1280', 'original']);
  });
});
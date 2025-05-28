import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock ImageWebp to always render a plain img with the src prop
jest.mock('../ImageWebP/ImageWebp', () => (props: any) => (
  <img {...props} />
));

import MovieThumb from './MovieThumb';

test('renders clickable movie thumb', () => {
  render(
    <BrowserRouter>
      <MovieThumb
        clickable={true}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  expect(screen.getByRole('link')).toHaveAttribute('href', '/movie/123');
});

test('renders non-clickable movie thumb', () => {
  render(
    <BrowserRouter>
      <MovieThumb
        clickable={false}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('src', '/test.jpg');
  expect(screen.queryByRole('link')).toBeNull();
});

test('sets correct alt text', () => {
  render(
    <BrowserRouter>
      <MovieThumb
        clickable={true}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringMatching(/moviethumb/i));
});

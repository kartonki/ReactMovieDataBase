import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieThumb from './MovieThumb';

// Mock ImageWebp to always render a plain img with the src prop
jest.mock('../ImageWebP/ImageWebp', () => (props: any) => (
  <img {...props} alt="Movie thumbnail" />
));

test('renders clickable movie thumb', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MovieThumb
        clickable={true}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringMatching(/movie thumbnail/i));
});

test('sets loading="lazy" for performance optimization', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MovieThumb
        clickable={true}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
});

test('sets loading="lazy" for non-clickable movie thumb', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MovieThumb
        clickable={false}
        image="/test.jpg"
        movieId={123}
        movieName="Test Movie"
      />
    </BrowserRouter>
  );
  expect(screen.getByRole('img')).toHaveAttribute('loading', 'lazy');
});

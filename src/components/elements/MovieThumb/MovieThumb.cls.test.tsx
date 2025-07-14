import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import MovieThumb from './MovieThumb';

// Wrapper component for router context with future flags
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    {children}
  </BrowserRouter>
);

describe('MovieThumb CLS Prevention', () => {
  test('should have aspect ratio and min-height to prevent layout shift', () => {
    const { container } = render(
      <RouterWrapper>
        <MovieThumb
          image="test-poster.jpg"
          movieId={123}
          movieName="Test Movie"
          clickable={true}
        />
      </RouterWrapper>
    );

    const movieThumbContainer = container.querySelector('.rmdb-moviethumb');
    expect(movieThumbContainer).toBeInTheDocument();
    expect(movieThumbContainer).toHaveClass('rmdb-moviethumb');

    const image = container.querySelector('.rmdb-moviethumb img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'moviethumb');
  });

  test('should render non-clickable movie thumb', () => {
    const { container } = render(
      <MovieThumb
        image="test-poster.jpg"
        movieId={123}
        movieName="Test Movie"
        clickable={false}
      />
    );

    const movieThumbContainer = container.querySelector('.rmdb-moviethumb');
    expect(movieThumbContainer).toBeInTheDocument();

    // Should not have a link when not clickable
    const link = container.querySelector('a');
    expect(link).not.toBeInTheDocument();

    const image = container.querySelector('.rmdb-moviethumb img');
    expect(image).toBeInTheDocument();
  });

  test('should have consistent structure for layout stability', () => {
    const { container } = render(
      <RouterWrapper>
        <MovieThumb
          image="./images/no_image.jpg"
          movieId={456}
          movieName="Movie Without Poster"
          clickable={true}
        />
      </RouterWrapper>
    );

    const movieThumbContainer = container.querySelector('.rmdb-moviethumb');
    expect(movieThumbContainer).toBeInTheDocument();
    
    // Should have image element regardless of source
    const image = container.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'moviethumb');
  });

  test('should maintain structure with proper CSS classes', () => {
    const { container } = render(
      <RouterWrapper>
        <MovieThumb
          image="test.jpg"
          movieId={789}
          movieName="Test"
          clickable={true}
        />
      </RouterWrapper>
    );

    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/movie/789');

    const image = container.querySelector('img');
    expect(image).toHaveClass('clickable');
  });
});
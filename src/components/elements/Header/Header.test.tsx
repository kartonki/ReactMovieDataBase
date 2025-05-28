import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders Header with logos', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  expect(screen.getByAltText('Movie Database Logo')).toBeInTheDocument();
  expect(screen.getByAltText('TMDB Logo')).toBeInTheDocument();
});

test('renders Home link', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  // Add this line after render:
  screen.getAllByRole('img').forEach(img => console.log((img as HTMLImageElement).alt));
  // The first link is the Home link
  const links = screen.getAllByRole('link');
  expect(links[0]).toHaveAttribute('href', '/');
});

test('renders TMDB logo link', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  // The second link is the TMDB logo link
  const links = screen.getAllByRole('link');
  expect(links[1]).toHaveAttribute('href', expect.stringContaining('themoviedb.org'));
});

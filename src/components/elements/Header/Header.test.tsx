import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders Header with logos', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
    </BrowserRouter>
  );
  expect(screen.getByAltText('Movie Database Logo')).toBeInTheDocument();
  expect(screen.getByAltText('TMDB Logo')).toBeInTheDocument();
});

test('renders Home link', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
    </BrowserRouter>
  );
  // The second link is the TMDB logo link
  const links = screen.getAllByRole('link');
  expect(links[1]).toHaveAttribute('href', expect.stringContaining('themoviedb.org'));
});

test('home logo link navigates to root', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
    </BrowserRouter>
  );
  const links = screen.getAllByRole('link');
  expect(links[0]).toHaveAttribute('href', '/');
});

test('tmdb logo link opens in new tab', () => {
  render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Header />
    </BrowserRouter>
  );
  const links = screen.getAllByRole('link');
  expect(links[1]).toHaveAttribute('target', '_blank');
});

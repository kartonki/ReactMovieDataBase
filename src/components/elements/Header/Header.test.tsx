import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

test('renders Header with logos', () => {
  const { getByAltText } = render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  expect(getByAltText(/Movie Database Logo/i)).toBeInTheDocument();
  expect(getByAltText(/TMDB Logo/i)).toBeInTheDocument();
});

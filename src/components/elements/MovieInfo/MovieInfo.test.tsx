import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MovieInfo from './MovieInfo';

// Mock MovieThumb component
jest.mock('../MovieThumb/MovieThumb', () => ({ movieName }: any) => (
  <div data-testid="movie-thumb">{movieName}</div>
));

const mockMovie = {
  id: 1,
  title: 'Test Movie',
  overview: 'This is a test movie overview.',
  vote_average: 7.5,
  backdrop_path: '/backdrop.jpg',
  poster_path: '/poster.jpg'
};

const mockDirectors = [
  { name: 'Director One' },
  { name: 'Director Two' }
];

const renderMovieInfo = (movie = mockMovie, directors = mockDirectors) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MovieInfo movie={movie} directors={directors} />
    </BrowserRouter>
  );
};

describe('MovieInfo Component', () => {
  test('renders movie title', () => {
    renderMovieInfo();
    expect(screen.getByRole('heading', { name: 'Test Movie' })).toBeInTheDocument();
  });

  test('renders movie overview', () => {
    renderMovieInfo();
    expect(screen.getByText('This is a test movie overview.')).toBeInTheDocument();
  });

  test('renders IMDB rating', () => {
    renderMovieInfo();
    expect(screen.getByText('7.5')).toBeInTheDocument();
    
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('value', '75'); // 7.5 * 10
  });

  test('renders directors with plural header when multiple directors', () => {
    renderMovieInfo();
    expect(screen.getByText('DIRECTORS')).toBeInTheDocument();
    expect(screen.getByText('Director One')).toBeInTheDocument();
    expect(screen.getByText('Director Two')).toBeInTheDocument();
  });

  test('renders director with singular header when single director', () => {
    const singleDirector = [{ name: 'Single Director' }];
    renderMovieInfo(mockMovie, singleDirector);
    
    expect(screen.getByText('DIRECTOR')).toBeInTheDocument();
    expect(screen.getByText('Single Director')).toBeInTheDocument();
  });

  test('renders MovieThumb component', () => {
    renderMovieInfo();
    expect(screen.getByTestId('movie-thumb')).toBeInTheDocument();
    // Check that movie name is in the MovieThumb component specifically
    const movieThumb = screen.getByTestId('movie-thumb');
    expect(movieThumb).toHaveTextContent('Test Movie');
  });

  test('applies correct background style with backdrop', () => {
    const { container } = renderMovieInfo();
    const movieInfo = container.querySelector('.rmdb-movieinfo');
    
    expect(movieInfo).toHaveStyle(
      'background: url(https://image.tmdb.org/t/p/w1280/backdrop.jpg)'
    );
  });

  test('applies fallback background when no backdrop', () => {
    const movieWithoutBackdrop = { ...mockMovie, backdrop_path: null as any };
    const { container } = renderMovieInfo(movieWithoutBackdrop);
    const movieInfo = container.querySelector('.rmdb-movieinfo');
    
    expect(movieInfo).toHaveStyle({ background: '#000' });
  });
});
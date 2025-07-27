import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Movie from './Movie';

// Mock all child components
jest.mock('../elements/Navigation/Navigation', () => () => (
  <div data-testid="navigation">Navigation</div>
));
jest.mock('../elements/MovieInfo/MovieInfo', () => ({ movie }: any) => (
  <div data-testid="movie-info">{movie?.title}</div>
));
jest.mock('../elements/MovieInfoBar/MovieInfoBar', () => ({ movie }: any) => (
  <div data-testid="movie-info-bar">{movie?.title} Info Bar</div>
));
jest.mock('../elements/FourColGrid/FourColGrid', () => ({ header, children }: any) => (
  <div data-testid="four-col-grid">
    <h2>{header}</h2>
    {children}
  </div>
));
jest.mock('../elements/Actor/Actor', () => ({ actor }: any) => (
  <div data-testid="actor">{actor.name}</div>
));
jest.mock('../elements/Spinner/Spinner', () => () => (
  <div data-testid="spinner">Loading...</div>
));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock fetch
global.fetch = jest.fn();

const mockMovieResponse = {
  id: 123,
  title: 'Test Movie',
  overview: 'Test movie overview',
  runtime: 120,
  budget: 1000000,
  revenue: 5000000,
  vote_average: 7.5,
  backdrop_path: '/backdrop.jpg',
  poster_path: '/poster.jpg'
};

const mockCreditsResponse = {
  cast: [
    {
      cast_id: 1,
      character: 'Hero',
      name: 'Actor One',
      profile_path: '/actor1.jpg'
    },
    {
      cast_id: 2,
      character: 'Villain',
      name: 'Actor Two',
      profile_path: '/actor2.jpg'
    }
  ],
  crew: [
    {
      job: 'Director',
      name: 'Director One'
    }
  ]
};

const mockProps = {
  match: { params: { movieId: '123' } },
  location: { pathname: '/movie/123' } as any
};

const renderMovie = (props = mockProps) => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Movie {...props} />
    </BrowserRouter>
  );
};

describe('Movie Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/credits')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockCreditsResponse,
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: async () => mockMovieResponse,
        });
      }
    });
  });

  test('renders without crashing', async () => {
    await act(async () => {
      renderMovie();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('navigation')).toBeInTheDocument();
    });
  });

  test('fetches movie data on mount', async () => {
    await act(async () => {
      renderMovie();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('movies/123')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('movies/123/credits')
      );
    });
  });

  test('loads cached data from localStorage when available', async () => {
    const cachedData = {
      movie: mockMovieResponse,
      actors: mockCreditsResponse.cast,
      directors: mockCreditsResponse.crew.filter((crew: any) => crew.job === 'Director'),
      loading: false
    };
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedData));
    
    await act(async () => {
      renderMovie();
    });
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('123');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('renders movie components after loading', async () => {
    await act(async () => {
      renderMovie();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('movie-info')).toBeInTheDocument();
      expect(screen.getByTestId('movie-info-bar')).toBeInTheDocument();
      expect(screen.getByText('Test Movie')).toBeInTheDocument();
    });
  });
});
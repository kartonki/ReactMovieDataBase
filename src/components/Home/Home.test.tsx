import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock all child components
jest.mock('../elements/HeroImage/HeroImage', () => ({ title }: any) => (
  <div data-testid="hero-image">{title}</div>
));
jest.mock('../elements/SearchBar/SearchBar', () => () => (
  <div data-testid="search-bar">Search Bar</div>
));
jest.mock('../elements/FourColGrid/FourColGrid', () => ({ header, children }: any) => (
  <div data-testid="four-col-grid">
    <h2>{header}</h2>
    {children}
  </div>
));
jest.mock('../elements/MovieThumb/MovieThumb', () => ({ movieName }: any) => (
  <div data-testid="movie-thumb">{movieName}</div>
));
jest.mock('../elements/LoadMoreBtn/LoadMoreBtn', () => () => (
  <div data-testid="load-more-btn">Load More</div>
));
jest.mock('../elements/Spinner/Spinner', () => () => (
  <div data-testid="spinner">Loading...</div>
));

// Mock sessionStorage
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock fetch
global.fetch = jest.fn();

const mockMoviesResponse = {
  results: [
    {
      id: 1,
      original_title: 'Test Movie 1',
      overview: 'Test overview 1',
      poster_path: '/poster1.jpg',
      backdrop_path: '/backdrop1.jpg'
    },
    {
      id: 2,
      original_title: 'Test Movie 2',
      overview: 'Test overview 2', 
      poster_path: '/poster2.jpg',
      backdrop_path: '/backdrop2.jpg'
    }
  ],
  total_pages: 10,
  page: 1
};

const renderHome = () => {
  return render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockMoviesResponse,
    });
  });

  test('renders basic structure without crashing', async () => {
    await act(async () => {
      renderHome();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });
  });

  test('fetches popular movies on mount when no session storage', async () => {
    mockSessionStorage.getItem.mockReturnValue(null);
    
    await act(async () => {
      renderHome();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('movie/popular')
      );
    });
  });

  test('loads state from session storage when available', async () => {
    const storedState = {
      movies: [mockMoviesResponse.results[0]],
      heroImage: mockMoviesResponse.results[0],
      loading: false,
      currentPage: 1,
      totalPages: 10,
      searchTerm: ''
    };
    
    mockSessionStorage.getItem.mockReturnValue(JSON.stringify(storedState));
    
    await act(async () => {
      renderHome();
    });
    
    expect(mockSessionStorage.getItem).toHaveBeenCalledWith('HomeState');
    expect(fetch).not.toHaveBeenCalled();
  });

  test('displays content after loading', async () => {
    await act(async () => {
      renderHome();
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('hero-image')).toBeInTheDocument();
      expect(screen.getByTestId('four-col-grid')).toBeInTheDocument();
    });
  });
});
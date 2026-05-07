import { render, screen } from '@testing-library/react';
import App from './App';

// Mock all the child components to avoid complex dependencies
vi.mock('../elements/Header/Header', () => ({ default: () => <header data-testid="header">Header</header> }));
vi.mock('../Home/Home', () => ({ default: () => <div data-testid="home">Home Page</div> }));
vi.mock('../Movie/Movie', () => ({ default: () => <div data-testid="movie">Movie Page</div> }));
vi.mock('../elements/NotFound/NotFound', () => ({ default: () => <div data-testid="notfound">Not Found</div> }));

// Mock react-router-dom
const mockNavigate = vi.hoisted(() => vi.fn());
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    BrowserRouter: ({ children }: any) => <div data-testid="router">{children}</div>,
    Routes: ({ children }: any) => <div data-testid="routes">{children}</div>,
    Route: ({ element }: any) => element,
    useParams: () => ({ movieId: '123' }),
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => mockNavigate,
  };
});

describe('App Component', () => {
  test('renders main app structure', () => {
    render(<App />);
    
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  test('renders app with correct class', () => {
    const { container } = render(<App />);
    
    const appDiv = container.querySelector('.app');
    expect(appDiv).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });
});
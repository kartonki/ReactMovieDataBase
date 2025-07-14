import { render, screen } from '@testing-library/react';
import App from './App';

// Mock all the child components to avoid complex dependencies
jest.mock('../elements/Header/Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../Home/Home', () => () => <div data-testid="home">Home Page</div>);
jest.mock('../Movie/Movie', () => () => <div data-testid="movie">Movie Page</div>);
jest.mock('../elements/NotFound/NotFound', () => () => <div data-testid="notfound">Not Found</div>);

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }: any) => <div data-testid="router">{children}</div>,
  Routes: ({ children }: any) => <div data-testid="routes">{children}</div>,
  Route: ({ element }: any) => element,
  useParams: () => ({ movieId: '123' }),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => mockNavigate,
}));

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
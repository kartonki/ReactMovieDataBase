import { render, screen } from '@testing-library/react';

// Mock ImageWebp to always render a plain img with the src prop
jest.mock('../ImageWebP/ImageWebp', () => (props: any) => <img {...props} />);

import Actor from './Actor';

test('renders actor name and character', () => {
  render(<Actor actor={{ name: 'John Doe', character: 'Hero', profile_path: '', cast_id: 1 }} />);
  expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  expect(screen.getByText(/hero/i)).toBeInTheDocument();
});

test('renders actor with missing profile_path', () => {
  render(<Actor actor={{ name: 'Jane Smith', character: 'Villain', profile_path: '', cast_id: 2 }} />);
  expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
  expect(screen.getByText(/villain/i)).toBeInTheDocument();
  // Should render fallback image
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', expect.stringContaining('no_image'));
});

test('renders actor with custom profile_path', () => {
  render(<Actor actor={{ name: 'Alice', character: 'Sidekick', profile_path: '/alice.jpg', cast_id: 3 }} />);
  expect(screen.getByText(/alice/i)).toBeInTheDocument();
  expect(screen.getByText(/sidekick/i)).toBeInTheDocument();
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', expect.stringContaining('/alice.jpg'));
});

test('renders actor with long name and character', () => {
  render(<Actor actor={{ name: 'A very long actor name for testing', character: 'A very long character name for testing', profile_path: '', cast_id: 4 }} />);
  expect(screen.getByText(/a very long actor name for testing/i)).toBeInTheDocument();
  expect(screen.getByText(/a very long character name for testing/i)).toBeInTheDocument();
});

test('renders actor with special characters in name and character', () => {
  render(<Actor actor={{ name: 'Élodie Yung', character: 'Électra', profile_path: '', cast_id: 5 }} />);
  expect(screen.getByText(/élodie yung/i)).toBeInTheDocument();
  expect(screen.getByText(/électra/i)).toBeInTheDocument();
});

test('renders multiple Actor components', () => {
  const actors = [
    { name: 'Actor One', character: 'Role One', profile_path: '', cast_id: 6 },
    { name: 'Actor Two', character: 'Role Two', profile_path: '', cast_id: 7 }
  ];
  actors.forEach(actor =>
    render(<Actor actor={actor} />)
  );
  expect(screen.getByText(/actor one/i)).toBeInTheDocument();
  expect(screen.getByText(/role one/i)).toBeInTheDocument();
  expect(screen.getByText(/actor two/i)).toBeInTheDocument();
  expect(screen.getByText(/role two/i)).toBeInTheDocument();
});

test('sets loading="lazy" for performance optimization', () => {
  render(<Actor actor={{ name: 'John Doe', character: 'Hero', profile_path: '/test.jpg', cast_id: 1 }} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('loading', 'lazy');
});

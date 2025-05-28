import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

test('renders not found message', () => {
  render(<NotFound />);
  expect(screen.getByText(/doesn't exist/i)).toBeInTheDocument();
});

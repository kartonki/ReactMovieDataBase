import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoadMoreBtn from './LoadMoreBtn';

test('calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<LoadMoreBtn text="Load More" onClick={onClick} />);
  fireEvent.click(screen.getByText(/load more/i));
  expect(onClick).toHaveBeenCalled();
});

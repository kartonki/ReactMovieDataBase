import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LoadMoreBtn from './LoadMoreBtn';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(<LoadMoreBtn text="Load More" onClick={handleClick} />);
  fireEvent.click(getByText(/Load More/i));
  expect(handleClick).toHaveBeenCalled();
});

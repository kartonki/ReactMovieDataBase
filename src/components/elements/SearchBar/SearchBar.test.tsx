import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// Mock debounce/timers for consistent test results
jest.useFakeTimers();

import SearchBar from './SearchBar';

test('calls callback on input change', async () => {
  const callback = jest.fn();
  render(<SearchBar callback={callback} />);
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'batman' } });
  expect(input).toHaveValue('batman');
  // Fast-forward debounce timer
  jest.advanceTimersByTime(500);
  await waitFor(() => expect(callback).toHaveBeenCalledWith('batman'));
});

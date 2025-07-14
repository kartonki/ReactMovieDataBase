import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from './SearchBar';

// Mock debounce/timers for consistent test results
jest.useFakeTimers();

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

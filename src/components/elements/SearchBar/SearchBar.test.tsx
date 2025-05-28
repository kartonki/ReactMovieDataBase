import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('calls callback on input change', () => {
  const callback = jest.fn();
  render(<SearchBar callback={callback} />);
  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'batman' } });
  expect(input).toHaveValue('batman');
});

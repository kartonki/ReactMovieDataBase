import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar from './SearchBar';

// Mock debounce/timers for consistent test results
jest.useFakeTimers();

describe('SearchBar', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  test('calls callback on input change with sufficient characters', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Type enough characters to trigger search
    fireEvent.change(input, { target: { value: 'batman' } });
    expect(input).toHaveValue('batman');
    
    // Fast-forward debounce timer (1200ms)
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    
    await waitFor(() => expect(callback).toHaveBeenCalledWith('batman'));
  });

  test('does not trigger search with insufficient characters', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Type insufficient characters
    fireEvent.change(input, { target: { value: 'ba' } });
    expect(input).toHaveValue('ba');
    
    // Fast-forward debounce timer
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    
    // Should not have called callback for short input
    expect(callback).not.toHaveBeenCalled();
  });

  test('triggers search immediately when Enter is pressed', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Type sufficient characters
    fireEvent.change(input, { target: { value: 'batman' } });
    
    // Press Enter before debounce timer expires
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(callback).toHaveBeenCalledWith('batman');
  });

  test('allows empty search to show popular movies', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Start with some text
    fireEvent.change(input, { target: { value: 'test' } });
    
    // Clear input (empty search)
    fireEvent.change(input, { target: { value: '' } });
    
    // Should immediately trigger callback for empty search
    expect(callback).toHaveBeenCalledWith('');
  });

  test('shows pending indicator during debounce', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Type sufficient characters
    fireEvent.change(input, { target: { value: 'batman' } });
    
    // Should show pending indicator
    expect(screen.getByText(/search will trigger/i)).toBeInTheDocument();
    
    // Fast-forward to complete search
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    
    // Pending indicator should be gone
    await waitFor(() => {
      expect(screen.queryByText(/search will trigger/i)).not.toBeInTheDocument();
    });
  });

  test('cancels previous search when typing continues', async () => {
    const callback = jest.fn();
    render(<SearchBar callback={callback} />);
    const input = screen.getByPlaceholderText(/search/i);
    
    // Type first search term
    fireEvent.change(input, { target: { value: 'batman' } });
    
    // Advance time partway through debounce
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Type more characters (should reset timer)
    fireEvent.change(input, { target: { value: 'batman begins' } });
    
    // Advance remaining time from first debounce
    act(() => {
      jest.advanceTimersByTime(600);
    });
    
    // Should not have called callback yet
    expect(callback).not.toHaveBeenCalled();
    
    // Advance full debounce time from second input
    act(() => {
      jest.advanceTimersByTime(1200);
    });
    
    // Should now call with final value
    await waitFor(() => expect(callback).toHaveBeenCalledWith('batman begins'));
  });
});

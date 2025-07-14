import React, { Component, ChangeEvent, KeyboardEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  callback: (value: string) => void;
}

interface SearchBarState {
  value: string;
  isPending: boolean;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  timeout: NodeJS.Timeout | null = null;
  private readonly DEBOUNCE_DELAY = 1200; // Increased from 500ms
  private readonly MIN_SEARCH_LENGTH = 3; // Minimum characters before search

  state = {
    value: '',
    isPending: false
  }

  doSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { callback } = this.props;
    const newValue = event.target.value;

    this.setState({ value: newValue });

    // Clear existing timeout
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.setState({ isPending: false });
    }

    // If value is empty, search immediately to show popular movies
    if (newValue.trim() === '') {
      callback('');
      return;
    }

    // Only start debounce timer if we have minimum characters
    if (newValue.trim().length >= this.MIN_SEARCH_LENGTH) {
      this.setState({ isPending: true });
      
      this.timeout = setTimeout(() => {
        callback(newValue);
        this.setState({ isPending: false });
      }, this.DEBOUNCE_DELAY);
    }
  }

  handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Allow immediate search on Enter key
    if (event.key === 'Enter') {
      const { callback } = this.props;
      const { value } = this.state;
      
      // Clear any pending timeout
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.setState({ isPending: false });
      }
      
      // Search immediately if we have minimum characters or empty (for popular movies)
      if (value.trim() === '' || value.trim().length >= this.MIN_SEARCH_LENGTH) {
        callback(value);
      }
    }
  }

  componentWillUnmount() {
    // Clean up timeout on component unmount
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  render () {
    const { value, isPending } = this.state;
    const hasMinLength = value.trim().length >= this.MIN_SEARCH_LENGTH;
    const showPendingIndicator = isPending && hasMinLength;

    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
          <input
            type="text"
            className={`rmdb-searchbar-input ${showPendingIndicator ? 'pending-search' : ''}`}
            placeholder="Search (min 3 characters, or press Enter)"
            onChange={this.doSearch}
            onKeyDown={this.handleKeyDown}
            value={value}
          />
          {showPendingIndicator && (
            <div className="rmdb-search-pending-indicator">
              Search will trigger in {this.DEBOUNCE_DELAY / 1000}s...
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default SearchBar;
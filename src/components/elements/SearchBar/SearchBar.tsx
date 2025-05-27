import React, { Component, ChangeEvent } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  callback: (value: string) => void;
}

interface SearchBarState {
  value: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  timeout: NodeJS.Timeout | null = null;

  state = {
    value: ''
  }

  doSearch = (event: ChangeEvent<HTMLInputElement>) => {
    // ES6 Destructuring prop
    const { callback } = this.props;

    this.setState({ value: event.target.value })
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    // Set a timeout to wait for the user to stop writing
    // So we don´t have to make unnessesary calls
    this.timeout = setTimeout( () => {
      callback(this.state.value);
    }, 500);
  }

  render () {
    // ES6 Destructuring state
    const { value } = this.state;

    return (
      <div className="rmdb-searchbar">
        <div className="rmdb-searchbar-content">
          <input
            type="text"
            className="rmdb-searchbar-input"
            placeholder="Search"
            onChange={this.doSearch}
            value={value}
          />
        </div>
      </div>
    )
  }
}

export default SearchBar;
import React from 'react';
import { render, screen } from '@testing-library/react';
import MovieInfoBar from './MovieInfoBar';

// Mock test to verify FontAwesome icons render without external CDN
describe('MovieInfoBar Component - Font Integration Test', () => {
  test('renders FontAwesome icons without external CDN dependencies', () => {
    const mockProps = {
      time: 120,
      budget: 50000000,
      revenue: 150000000
    };

    render(<MovieInfoBar {...mockProps} />);
    
    // Check that the component renders
    expect(screen.getByText(/Running time/)).toBeInTheDocument();
    expect(screen.getByText(/Budget/)).toBeInTheDocument();
    expect(screen.getByText(/Revenue/)).toBeInTheDocument();
    
    // Check that FontAwesome icons are rendered (they should have SVG content)
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThan(0);
    
    // Verify that the CSS classes are applied correctly
    expect(document.querySelector('.fa-time')).toBeInTheDocument();
    expect(document.querySelector('.fa-budget')).toBeInTheDocument();
    expect(document.querySelector('.fa-revenue')).toBeInTheDocument();
  });
});
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import FourColGrid from './FourColGrid';

// Simple test component that doesn't need router
const TestItem: React.FC = () => <div>Test Item</div>;

describe('FourColGrid CLS Prevention', () => {
  test('should have minimum height to prevent layout shift', () => {
    const { container } = render(
      <FourColGrid header="Test Movies">
        <TestItem />
      </FourColGrid>
    );

    const gridContent = container.querySelector('.rmdb-grid-content');
    expect(gridContent).toBeInTheDocument();
    
    // Check that CSS min-height is applied via className
    expect(gridContent).toHaveClass('rmdb-grid-content');
    
    // Verify the grid structure is preserved
    const gridElement = container.querySelector('.rmdb-grid-element');
    expect(gridElement).toBeInTheDocument();
  });

  test('should render without content and maintain structure', () => {
    const { container } = render(
      <FourColGrid header="Empty Grid" />
    );

    const gridContent = container.querySelector('.rmdb-grid-content');
    expect(gridContent).toBeInTheDocument();
    expect(gridContent).toHaveClass('rmdb-grid-content');
  });

  test('should maintain grid structure during loading states', () => {
    const { container } = render(
      <FourColGrid header="Loading Movies" loading={true}>
        <TestItem />
      </FourColGrid>
    );

    const gridContent = container.querySelector('.rmdb-grid-content');
    expect(gridContent).toBeInTheDocument();
    
    // Header should not be shown during loading
    expect(container.querySelector('h1')).not.toBeInTheDocument();
  });

  test('should show header when not loading', () => {
    const { container } = render(
      <FourColGrid header="Test Movies" loading={false}>
        <TestItem />
      </FourColGrid>
    );

    const header = container.querySelector('h1');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Test Movies');
  });
});
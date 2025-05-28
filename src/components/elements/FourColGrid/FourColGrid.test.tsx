import { render, screen } from '@testing-library/react';
import FourColGrid from './FourColGrid';

test('renders header when provided and not loading', () => {
  render(
    <FourColGrid header="Test Header" loading={false}>
      <div>Child 1</div>
      <div>Child 2</div>
    </FourColGrid>
  );
  expect(screen.getByText(/test header/i)).toBeInTheDocument();
});

test('does not render header when loading', () => {
  render(
    <FourColGrid header="Test Header" loading={true}>
      <div>Child 1</div>
    </FourColGrid>
  );
  expect(screen.queryByText(/test header/i)).not.toBeInTheDocument();
});

test('renders children in grid elements', () => {
  render(
    <FourColGrid>
      <div>Child A</div>
      <div>Child B</div>
      <div>Child C</div>
    </FourColGrid>
  );
  expect(screen.getByText(/child a/i)).toBeInTheDocument();
  expect(screen.getByText(/child b/i)).toBeInTheDocument();
  expect(screen.getByText(/child c/i)).toBeInTheDocument();
  // Check that each child is wrapped in a grid element
  const gridElements = document.querySelectorAll('.rmdb-grid-element');
  expect(gridElements.length).toBe(3);
});

test('renders nothing if no children', () => {
  render(<FourColGrid>{/* no children */}</FourColGrid>);
  // Should not find any grid elements or text
  expect(document.querySelectorAll('.rmdb-grid-element').length).toBe(0);
  expect(screen.queryByText(/./)).not.toBeInTheDocument();
});

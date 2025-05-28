import { render, screen } from '@testing-library/react';

// Mock CSS import to avoid issues in test environment
jest.mock('./HeroImage.css', () => ({}));

import HeroImage from './HeroImage';

test('renders HeroImage with title and text', () => {
  render(
    <HeroImage
      image="test-image.jpg"
      title="Test Title"
      text="Test description"
    />
  );
  expect(screen.getByText(/test title/i)).toBeInTheDocument();
  expect(screen.getByText(/test description/i)).toBeInTheDocument();
});



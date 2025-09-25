import { render, screen } from '@testing-library/react';
import App from './App';

test('renders brand name', () => {
  render(<App />);
  const brand = screen.getByText(/Ocean Notes/i);
  expect(brand).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  const defaultProps = {
    title: 'Currency Converter',
    subtitle: 'Convert currencies with real-time exchange rates',
    onRefreshRates: jest.fn(),
    refreshing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render refresh button with default text', () => {
    render(<PageHeader {...defaultProps} />);

    const button = screen.getByRole('button', { name: 'Refresh Rates' });
    expect(button).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it('should disable button and show refreshing text while refreshing', () => {
    render(<PageHeader {...defaultProps} refreshing={true} />);

    const button = screen.getByRole('button', { name: 'Refreshing...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should call onRefreshRates when refresh button is clicked', async () => {
    const user = userEvent.setup();
    render(<PageHeader {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Refresh Rates' }));

    expect(defaultProps.onRefreshRates).toHaveBeenCalledTimes(1);
  });
});

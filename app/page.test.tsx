import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';

// Mock fetch globally
global.fetch = jest.fn();

describe('Home page refresh notifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show success notification after refreshing rates and auto-dismiss it', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const initialRates = {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
      },
      timestamp: Date.now(),
    };

    const refreshedRates = {
      ...initialRates,
      rates: {
        ...initialRates.rates,
        EUR: 0.9,
      },
      timestamp: Date.now() + 1000,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: initialRates }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: refreshedRates }),
      });

    render(<Home />);

    const refreshButton = await screen.findByRole('button', {
      name: 'Refresh Rates',
    });

    await user.click(refreshButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Rates updated');

    jest.advanceTimersByTime(3000);

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('should show error notification after refresh failure', async () => {
    const user = userEvent.setup();

    const initialRates = {
      base: 'USD',
      rates: {
        USD: 1,
        EUR: 0.85,
      },
      timestamp: Date.now(),
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({ success: true, data: initialRates }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: false, error: 'Refresh failed' }),
      });

    render(<Home />);

    const refreshButton = await screen.findByRole('button', {
      name: 'Refresh Rates',
    });

    await user.click(refreshButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Refresh failed');
  });
});

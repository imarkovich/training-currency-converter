import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConversionHistory from './ConversionHistory';
import { ConversionResult } from '@/types';

describe('ConversionHistory', () => {
  const mockOnToggle = jest.fn();
  const mockOnClear = jest.fn();
  const mockOnLoadConversion = jest.fn();

  const history: ConversionResult[] = [
    {
      from: 'USD',
      to: 'EUR',
      amount: 100,
      result: 85,
      rate: 0.85,
      timestamp: 1704067200000,
    },
    {
      from: 'GBP',
      to: 'JPY',
      amount: 50,
      result: 7534.25,
      rate: 150.685,
      timestamp: 1704153600000,
    },
  ];

  const defaultProps = {
    history,
    showHistory: true,
    onToggle: mockOnToggle,
    onClear: mockOnClear,
    onLoadConversion: mockOnLoadConversion,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show toggle text and count when history is visible', () => {
    render(<ConversionHistory {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Hide (2)' })).toBeInTheDocument();
  });

  it('should show toggle text and count when history is hidden', () => {
    render(<ConversionHistory {...defaultProps} showHistory={false} />);

    expect(screen.getByRole('button', { name: 'Show (2)' })).toBeInTheDocument();
  });

  it('should render clear button only when history has items', () => {
    const { rerender } = render(<ConversionHistory {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Clear History' })).toBeInTheDocument();

    rerender(<ConversionHistory {...defaultProps} history={[]} />);

    expect(screen.queryByRole('button', { name: 'Clear History' })).not.toBeInTheDocument();
  });

  it('should call onToggle when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConversionHistory {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Hide (2)' }));

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onClear when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConversionHistory {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: 'Clear History' }));

    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('should not render history list when showHistory is false', () => {
    render(<ConversionHistory {...defaultProps} showHistory={false} />);

    expect(screen.queryByText('No conversion history yet')).not.toBeInTheDocument();
    expect(screen.queryByText('100.00 USD → 85.00 EUR')).not.toBeInTheDocument();
  });

  it('should render empty state when showHistory is true and history is empty', () => {
    render(<ConversionHistory {...defaultProps} history={[]} />);

    expect(screen.getByText('No conversion history yet')).toBeInTheDocument();
  });

  it('should render multiple conversion items with full details', () => {
    render(<ConversionHistory {...defaultProps} />);

    expect(screen.getByText('100.00 USD → 85.00 EUR')).toBeInTheDocument();
    expect(screen.getByText('50.00 GBP → 7534.25 JPY')).toBeInTheDocument();
    expect(screen.getByText('Rate: 1 USD = 0.8500 EUR')).toBeInTheDocument();
    expect(screen.getByText('Rate: 1 GBP = 150.6850 JPY')).toBeInTheDocument();
    expect(screen.getByText(new Date(history[0].timestamp).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(new Date(history[1].timestamp).toLocaleString())).toBeInTheDocument();
  });

  it('should call onLoadConversion with the clicked conversion item', async () => {
    const user = userEvent.setup();
    render(<ConversionHistory {...defaultProps} />);

    await user.click(screen.getByText('100.00 USD → 85.00 EUR'));

    expect(mockOnLoadConversion).toHaveBeenCalledTimes(1);
    expect(mockOnLoadConversion).toHaveBeenCalledWith(history[0]);
  });

  it('should handle different timestamp input formats', () => {
    const isoTimestamp = '2025-01-15T10:30:00.000Z';
    const mixedHistory = [
      {
        ...history[0],
      },
      {
        from: 'EUR',
        to: 'USD',
        amount: 10,
        result: 10.8,
        rate: 1.08,
        timestamp: isoTimestamp as unknown as number,
      },
    ] as ConversionResult[];

    render(<ConversionHistory {...defaultProps} history={mixedHistory} />);

    expect(screen.getByText(new Date(mixedHistory[0].timestamp).toLocaleString())).toBeInTheDocument();
    expect(screen.getByText(new Date(isoTimestamp).toLocaleString())).toBeInTheDocument();
  });
});
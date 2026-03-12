import { fireEvent, render, screen } from "@testing-library/react";
import { ConverterForm } from "./ConverterForm";

const replace = jest.fn();
const searchParams = new URLSearchParams();
const conversion = {
  error: null,
  data: { amount: 1, convertedAmount: 0.9, rate: 0.9 },
};
const emptyHistory: never[] = [];
const addToHistoryMock = jest.fn(() => emptyHistory);
const clearHistoryMock = jest.fn();
const loadHistoryMock = jest.fn(() => emptyHistory);
const setAmountMock = jest.fn();
const setFromCurrencyMock = jest.fn();
const setToCurrencyMock = jest.fn();
const swapCurrenciesMock = jest.fn();

let converterMockState = {
  amount: "1",
  setAmount: setAmountMock,
  fromCurrency: "USD",
  setFromCurrency: setFromCurrencyMock,
  toCurrency: "EUR",
  setToCurrency: setToCurrencyMock,
  swapCurrencies: swapCurrenciesMock,
  getConversion: () => conversion,
  amountError: null as string | null,
};

let exchangeRatesMockState = {
  data: { base: "USD", source: "mock", timestamp: new Date().toISOString(), rates: {} },
  isLoading: false,
  error: null as string | null,
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => searchParams,
}));

jest.mock("@/hooks", () => ({
  useConverter: () => converterMockState,
  useExchangeRates: () => exchangeRatesMockState,
}));

jest.mock("@/utils/storage", () => ({
  addToHistory: () => addToHistoryMock(),
  clearHistory: () => clearHistoryMock(),
  loadHistory: () => loadHistoryMock(),
}));

describe("ConverterForm", () => {
  beforeEach(() => {
    addToHistoryMock.mockClear();
    clearHistoryMock.mockClear();
    loadHistoryMock.mockClear();

    converterMockState = {
      amount: "1",
      setAmount: setAmountMock,
      fromCurrency: "USD",
      setFromCurrency: setFromCurrencyMock,
      toCurrency: "EUR",
      setToCurrency: setToCurrencyMock,
      swapCurrencies: swapCurrenciesMock,
      getConversion: () => conversion,
      amountError: null,
    };

    exchangeRatesMockState = {
      data: { base: "USD", source: "mock", timestamp: new Date().toISOString(), rates: {} },
      isLoading: false,
      error: null,
    };
  });

  it("renders controls", () => {
    render(<ConverterForm />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /swap currencies/i })).toBeInTheDocument();
    expect(screen.getByText(/conversion result/i)).toBeInTheDocument();
  });

  it("adds to history only once for unchanged conversion", () => {
    const { rerender } = render(<ConverterForm />);

    expect(addToHistoryMock).toHaveBeenCalledTimes(1);

    rerender(<ConverterForm />);

    expect(addToHistoryMock).toHaveBeenCalledTimes(1);
  });

  it("clears history when clear button is clicked", () => {
    render(<ConverterForm />);

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(clearHistoryMock).toHaveBeenCalledTimes(1);
  });

  it("does not save history when from and to currencies are the same", () => {
    converterMockState = {
      amount: "90",
      setAmount: setAmountMock,
      fromCurrency: "EUR",
      setFromCurrency: setFromCurrencyMock,
      toCurrency: "EUR",
      setToCurrency: setToCurrencyMock,
      swapCurrencies: swapCurrenciesMock,
      getConversion: () => ({
        error: null,
        data: { amount: 90, convertedAmount: 90, rate: 1 },
      }),
      amountError: null,
    };

    render(<ConverterForm />);

    expect(addToHistoryMock).not.toHaveBeenCalled();
  });

  it("does not save history while rates are for a different base currency", () => {
    exchangeRatesMockState = {
      data: { base: "USD", source: "mock", timestamp: new Date().toISOString(), rates: {} },
      isLoading: false,
      error: null,
    };

    converterMockState = {
      amount: "90",
      setAmount: setAmountMock,
      fromCurrency: "EUR",
      setFromCurrency: setFromCurrencyMock,
      toCurrency: "USD",
      setToCurrency: setToCurrencyMock,
      swapCurrencies: swapCurrenciesMock,
      getConversion: () => ({
        error: null,
        data: { amount: 90, convertedAmount: 97.83, rate: 1.087 },
      }),
      amountError: null,
    };

    render(<ConverterForm />);

    expect(addToHistoryMock).not.toHaveBeenCalled();
  });
});

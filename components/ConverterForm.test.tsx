import { render, screen } from "@testing-library/react";
import { ConverterForm } from "./ConverterForm";

const replace = jest.fn();
const searchParams = new URLSearchParams();
const conversion = {
  error: null,
  data: { amount: 1, convertedAmount: 0.9, rate: 0.9 },
};
const emptyHistory: never[] = [];

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => searchParams,
}));

jest.mock("@/hooks", () => ({
  useConverter: () => ({
    amount: "1",
    setAmount: jest.fn(),
    fromCurrency: "USD",
    setFromCurrency: jest.fn(),
    toCurrency: "EUR",
    setToCurrency: jest.fn(),
    swapCurrencies: jest.fn(),
    getConversion: () => conversion,
    amountError: null,
  }),
  useExchangeRates: () => ({
    data: { base: "USD", source: "mock", timestamp: new Date().toISOString(), rates: {} },
    isLoading: false,
    error: null,
  }),
}));

jest.mock("@/utils/storage", () => ({
  addToHistory: () => emptyHistory,
  clearHistory: jest.fn(),
  loadHistory: () => emptyHistory,
}));

describe("ConverterForm", () => {
  it("renders controls", () => {
    render(<ConverterForm />);

    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /swap currencies/i })).toBeInTheDocument();
    expect(screen.getByText(/conversion result/i)).toBeInTheDocument();
  });
});

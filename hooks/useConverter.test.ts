import { act, renderHook } from "@testing-library/react";
import { useConverter } from "./useConverter";
import type { ExchangeRatesPayload } from "@/types";

const payload: ExchangeRatesPayload = {
  base: "USD",
  source: "test",
  timestamp: new Date().toISOString(),
  rates: {
    USD: 1,
    EUR: 0.9,
    GBP: 0.8,
    JPY: 150,
    CAD: 1.3,
    AUD: 1.5,
    CHF: 0.88,
    CNY: 7.2,
    INR: 82,
    UAH: 40,
  },
};

describe("useConverter", () => {
  it("calculates conversion", () => {
    const { result } = renderHook(() => useConverter({ amount: "2", fromCurrency: "USD", toCurrency: "EUR" }));
    const conversion = result.current.getConversion(payload);

    expect(conversion.error).toBeNull();
    expect(conversion.data?.convertedAmount).toBe(1.8);
  });

  it("swaps currencies", () => {
    const { result } = renderHook(() => useConverter({ fromCurrency: "USD", toCurrency: "EUR" }));

    act(() => {
      result.current.swapCurrencies();
    });

    expect(result.current.fromCurrency).toBe("EUR");
    expect(result.current.toCurrency).toBe("USD");
  });

  it("keeps getConversion stable between rerenders when inputs are unchanged", () => {
    const { result, rerender } = renderHook(() => useConverter({ amount: "2", fromCurrency: "USD", toCurrency: "EUR" }));

    const initialRef = result.current.getConversion;
    rerender();

    expect(result.current.getConversion).toBe(initialRef);
  });
});

"use client";

import { useCallback, useMemo, useState } from "react";
import { convertAmount, isCurrencyCode, parseAmount, validateAmount } from "@/utils/currency";
import type { ConversionSummary, CurrencyCode, ExchangeRatesPayload } from "@/types";

const DEFAULT_FROM: CurrencyCode = "USD";
const DEFAULT_TO: CurrencyCode = "EUR";

interface ConverterInit {
  amount?: string;
  fromCurrency?: string;
  toCurrency?: string;
}

export function useConverter(init?: ConverterInit) {
  const [amount, setAmount] = useState(init?.amount ?? "1");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(
    isCurrencyCode(init?.fromCurrency ?? "") ? init!.fromCurrency! : DEFAULT_FROM,
  );
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(
    isCurrencyCode(init?.toCurrency ?? "") ? init!.toCurrency! : DEFAULT_TO,
  );

  function swapCurrencies() {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }

  const getConversion = useCallback(
    (payload: ExchangeRatesPayload | null): { error: string | null; data: ConversionSummary | null } => {
      const validationError = validateAmount(amount);
      if (validationError) {
        return { error: validationError, data: null };
      }

      if (!payload) {
        return { error: "Exchange rates are not loaded yet", data: null };
      }

      const rate = payload.rates[toCurrency];
      if (!rate) {
        return { error: `Rate for ${toCurrency} is unavailable`, data: null };
      }

      const parsed = parseAmount(amount);
      return {
        error: null,
        data: {
          amount: parsed,
          rate,
          convertedAmount: convertAmount(parsed, rate),
        },
      };
    },
    [amount, toCurrency],
  );

  const amountError = useMemo(() => validateAmount(amount), [amount]);

  return {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    swapCurrencies,
    getConversion,
    amountError,
  };
}

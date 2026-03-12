"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConverter, useExchangeRates } from "@/hooks";
import type { ConversionRecord } from "@/types";
import { addToHistory, clearHistory, loadHistory } from "@/utils/storage";
import { AmountInput } from "./AmountInput";
import { ConversionHistory } from "./ConversionHistory";
import { ConversionResult } from "./ConversionResult";
import { CurrencySelect } from "./CurrencySelect";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingSpinner } from "./LoadingSpinner";
import { SwapButton } from "./SwapButton";

export function ConverterForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const lastSavedSignature = useRef<string | null>(null);

  const {
    amount,
    setAmount,
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    swapCurrencies,
    getConversion,
    amountError,
  } = useConverter({
    amount: searchParams.get("amount") ?? undefined,
    fromCurrency: searchParams.get("from") ?? undefined,
    toCurrency: searchParams.get("to") ?? undefined,
  });

  const ratesState = useExchangeRates(fromCurrency);

  const conversion = useMemo(() => getConversion(ratesState.data), [getConversion, ratesState.data]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({
      amount,
      from: fromCurrency,
      to: toCurrency,
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [amount, fromCurrency, toCurrency, router]);

  useEffect(() => {
    if (!conversion.data || ratesState.isLoading || ratesState.error) {
      return;
    }

    // Skip transitional states while currency selectors are being updated.
    if (fromCurrency === toCurrency) {
      return;
    }

    if (!ratesState.data || ratesState.data.base !== fromCurrency) {
      return;
    }

    const signature = [
      conversion.data.amount,
      fromCurrency,
      toCurrency,
      conversion.data.rate,
      conversion.data.convertedAmount,
    ].join("|");

    if (lastSavedSignature.current === signature) {
      return;
    }

    lastSavedSignature.current = signature;

    const record: ConversionRecord = {
      id: `${Date.now()}-${fromCurrency}-${toCurrency}`,
      amount: conversion.data.amount,
      fromCurrency,
      toCurrency,
      rate: conversion.data.rate,
      result: conversion.data.convertedAmount,
      createdAt: new Date().toISOString(),
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(addToHistory(record));
  }, [conversion.data, ratesState.isLoading, ratesState.error, fromCurrency, toCurrency]);

  function handleReload(record: ConversionRecord) {
    setAmount(String(record.amount));
    setFromCurrency(record.fromCurrency);
    setToCurrency(record.toCurrency);
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  const combinedError = amountError ?? ratesState.error ?? conversion.error;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <AmountInput value={amount} onChange={setAmount} error={amountError} />
        <CurrencySelect label="From" value={fromCurrency} onChange={setFromCurrency} />
        <SwapButton onSwap={swapCurrencies} />
        <CurrencySelect label="To" value={toCurrency} onChange={setToCurrency} />
        <button
          type="button"
          className="mt-6 inline-flex h-10 min-w-36 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white"
          disabled
        >
          {ratesState.isLoading ? (
            <>
              <LoadingSpinner />
              Converting...
            </>
          ) : (
            "Auto Convert"
          )}
        </button>
      </div>

      {combinedError ? <ErrorMessage message={combinedError} /> : null}

      {conversion.data && ratesState.data ? (
        <ConversionResult
          amount={conversion.data.amount}
          convertedAmount={conversion.data.convertedAmount}
          rate={conversion.data.rate}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
          source={ratesState.data.source}
          timestamp={ratesState.data.timestamp}
        />
      ) : null}

      <ConversionHistory history={history} onReload={handleReload} onClear={handleClearHistory} />
    </div>
  );
}

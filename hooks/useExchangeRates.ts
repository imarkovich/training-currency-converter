"use client";

import { useEffect, useState } from "react";
import type { CurrencyCode, ExchangeRatesPayload } from "@/types";

interface UseExchangeRatesState {
  data: ExchangeRatesPayload | null;
  isLoading: boolean;
  error: string | null;
}

export function useExchangeRates(baseCurrency: CurrencyCode) {
  const [state, setState] = useState<UseExchangeRatesState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    async function fetchRates() {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`/api/rates?base=${baseCurrency}`);
        if (!response.ok) {
          const payload = (await response.json()) as { error?: string };
          throw new Error(payload.error ?? "Failed to fetch exchange rates");
        }

        const payload = (await response.json()) as ExchangeRatesPayload;
        if (!isCancelled) {
          setState({ data: payload, isLoading: false, error: null });
        }
      } catch (error) {
        if (!isCancelled) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error.message : "Unexpected error",
          });
        }
      }
    }

    fetchRates();

    return () => {
      isCancelled = true;
    };
  }, [baseCurrency]);

  return state;
}

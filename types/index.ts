export const SUPPORTED_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "UAH",
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export interface ExchangeRatesPayload {
  base: CurrencyCode;
  rates: Record<CurrencyCode, number>;
  source: string;
  timestamp: string;
}

export interface ConversionRecord {
  id: string;
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  rate: number;
  result: number;
  createdAt: string;
}

export interface ConversionSummary {
  amount: number;
  convertedAmount: number;
  rate: number;
}

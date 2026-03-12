import type { CurrencyCode } from "@/types";
import { SUPPORTED_CURRENCIES } from "@/types";

export const CURRENCY_OPTIONS: Array<{ code: CurrencyCode; label: string }> = [
  { code: "USD", label: "US Dollar" },
  { code: "EUR", label: "Euro" },
  { code: "GBP", label: "British Pound" },
  { code: "JPY", label: "Japanese Yen" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "AUD", label: "Australian Dollar" },
  { code: "CHF", label: "Swiss Franc" },
  { code: "CNY", label: "Chinese Yuan" },
  { code: "INR", label: "Indian Rupee" },
  { code: "UAH", label: "Ukrainian Hryvnia" },
];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.includes(value as CurrencyCode);
}

export function sanitizeAmountInput(value: string): string {
  return value.replace(/[^\d.]/g, "");
}

export function parseAmount(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function validateAmount(value: string): string | null {
  if (!value.trim()) {
    return "Amount is required";
  }

  const amount = parseAmount(value);
  if (!Number.isFinite(amount)) {
    return "Amount must be a number";
  }

  if (amount <= 0) {
    return "Amount must be greater than 0";
  }

  return null;
}

export function roundTo(value: number, decimals = 4): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function convertAmount(amount: number, rate: number): number {
  return roundTo(amount * rate, 4);
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}

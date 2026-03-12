import type { CurrencyCode } from "@/types";
import { formatCurrency } from "@/utils/currency";

interface ConversionResultProps {
  amount: number;
  convertedAmount: number;
  rate: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  source: string;
  timestamp: string;
}

export function ConversionResult({
  amount,
  convertedAmount,
  rate,
  fromCurrency,
  toCurrency,
  source,
  timestamp,
}: ConversionResultProps) {
  return (
    <section className="soft-grid rounded-2xl border border-slate-200 bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Conversion Result</h2>
      <p className="title-serif text-3xl leading-tight text-foreground">
        {formatCurrency(amount, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
      </p>
      <p className="mt-2 text-sm text-muted">
        1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
      </p>
      <p className="mt-2 text-xs text-muted">Source: {source} • Updated: {new Date(timestamp).toLocaleTimeString()}</p>
    </section>
  );
}

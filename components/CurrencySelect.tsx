import type { CurrencyCode } from "@/types";
import { CURRENCY_OPTIONS } from "@/utils/currency";

interface CurrencySelectProps {
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
}

export function CurrencySelect({ label, value, onChange }: CurrencySelectProps) {
  return (
    <label className="flex min-w-36 flex-1 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      <select
        aria-label={label}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
      >
        {CURRENCY_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code} - {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

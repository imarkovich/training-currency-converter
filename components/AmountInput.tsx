import type { ChangeEvent } from "react";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
}

export function AmountInput({ value, onChange, error }: AmountInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <label className="flex min-w-44 flex-1 flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">Amount</span>
      <input
        aria-label="Amount"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        value={value}
        onChange={handleChange}
        inputMode="decimal"
        placeholder="Enter amount"
      />
      {error ? <span className="text-xs text-danger">{error}</span> : <span className="text-xs text-transparent">.</span>}
    </label>
  );
}

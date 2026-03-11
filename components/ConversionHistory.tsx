import type { ConversionRecord } from "@/types";
import { formatCurrency } from "@/utils/currency";

interface ConversionHistoryProps {
  history: ConversionRecord[];
  onReload: (record: ConversionRecord) => void;
  onClear: () => void;
}

export function ConversionHistory({ history, onReload, onClear }: ConversionHistoryProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Recent Conversions</h2>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-muted transition hover:border-danger hover:text-danger"
        >
          Clear
        </button>
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-muted">No history yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <span>
                {formatCurrency(item.amount, item.fromCurrency)} → {formatCurrency(item.result, item.toCurrency)}
              </span>
              <button
                type="button"
                onClick={() => onReload(item)}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold transition hover:border-primary hover:text-primary"
              >
                Reload
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

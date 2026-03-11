interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  return (
    <button
      type="button"
      onClick={onSwap}
      className="mt-6 h-10 shrink-0 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary hover:text-primary"
      aria-label="Swap currencies"
    >
      Swap
    </button>
  );
}

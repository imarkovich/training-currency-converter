export function PageHeader() {
  return (
    <header className="mb-8">
      <p className="mb-2 inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
        Next.js + TypeScript + Tailwind
      </p>
      <h1 className="title-serif text-4xl text-foreground sm:text-5xl">Currency Converter</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
        Real-time rates, resilient API fallback, and local conversion history. Edit amount or currency and conversion updates automatically.
      </p>
    </header>
  );
}

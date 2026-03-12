export function LoadingSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
      role="status"
      aria-label="Loading"
    />
  );
}

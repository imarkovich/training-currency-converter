import type { ConversionRecord } from "@/types";

const HISTORY_KEY = "currency-converter-history";
export const HISTORY_LIMIT = 10;

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadHistory(): ConversionRecord[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as ConversionRecord[];
    return Array.isArray(parsed) ? parsed.slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: ConversionRecord[]): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
  } catch {
    // Ignore storage write errors such as quota limits.
  }
}

export function addToHistory(record: ConversionRecord): ConversionRecord[] {
  const next = [record, ...loadHistory()].slice(0, HISTORY_LIMIT);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(HISTORY_KEY);
}

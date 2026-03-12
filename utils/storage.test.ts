import { addToHistory, clearHistory, loadHistory } from "./storage";
import type { ConversionRecord } from "@/types";

function record(id: string): ConversionRecord {
  return {
    id,
    amount: 1,
    fromCurrency: "USD",
    toCurrency: "EUR",
    rate: 0.92,
    result: 0.92,
    createdAt: new Date().toISOString(),
  };
}

describe("storage utils", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("adds and loads history", () => {
    addToHistory(record("1"));
    const history = loadHistory();
    expect(history).toHaveLength(1);
    expect(history[0].id).toBe("1");
  });

  it("clears history", () => {
    addToHistory(record("1"));
    clearHistory();
    expect(loadHistory()).toEqual([]);
  });
});

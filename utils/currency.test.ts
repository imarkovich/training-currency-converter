import { convertAmount, formatCurrency, parseAmount, validateAmount } from "./currency";

describe("currency utils", () => {
  it("validates amount", () => {
    expect(validateAmount("")).toBe("Amount is required");
    expect(validateAmount("abc")).toBe("Amount must be a number");
    expect(validateAmount("0")).toBe("Amount must be greater than 0");
    expect(validateAmount("10")).toBeNull();
  });

  it("parses amount", () => {
    expect(parseAmount("12.5")).toBe(12.5);
  });

  it("converts amount with rounding", () => {
    expect(convertAmount(10, 1.23456)).toBe(12.3456);
  });

  it("formats currency", () => {
    expect(formatCurrency(100, "USD")).toContain("$");
  });
});

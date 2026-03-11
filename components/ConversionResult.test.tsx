import { render, screen } from "@testing-library/react";
import { ConversionResult } from "./ConversionResult";

describe("ConversionResult", () => {
  it("renders amounts and rate", () => {
    render(
      <ConversionResult
        amount={1}
        convertedAmount={0.92}
        rate={0.92}
        fromCurrency="USD"
        toCurrency="EUR"
        source="mock"
        timestamp={new Date().toISOString()}
      />,
    );

    expect(screen.getByText(/conversion result/i)).toBeInTheDocument();
    expect(screen.getByText(/1 usd = 0.9200 eur/i)).toBeInTheDocument();
  });
});

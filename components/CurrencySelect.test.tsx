import { fireEvent, render, screen } from "@testing-library/react";
import { CurrencySelect } from "./CurrencySelect";

describe("CurrencySelect", () => {
  it("changes selected currency", () => {
    const onChange = jest.fn();
    render(<CurrencySelect label="From" value="USD" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/from/i), { target: { value: "EUR" } });

    expect(onChange).toHaveBeenCalledWith("EUR");
  });
});

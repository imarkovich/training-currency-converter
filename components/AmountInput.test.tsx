import { fireEvent, render, screen } from "@testing-library/react";
import { AmountInput } from "./AmountInput";

describe("AmountInput", () => {
  it("renders and changes value", () => {
    const onChange = jest.fn();
    render(<AmountInput value="1" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "2" } });

    expect(onChange).toHaveBeenCalledWith("2");
  });
});

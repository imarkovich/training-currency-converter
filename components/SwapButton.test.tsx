import { fireEvent, render, screen } from "@testing-library/react";
import { SwapButton } from "./SwapButton";

describe("SwapButton", () => {
  it("fires swap callback", () => {
    const onSwap = jest.fn();
    render(<SwapButton onSwap={onSwap} />);

    fireEvent.click(screen.getByRole("button", { name: /swap currencies/i }));

    expect(onSwap).toHaveBeenCalledTimes(1);
  });
});

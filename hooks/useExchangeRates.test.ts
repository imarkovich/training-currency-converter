import { renderHook, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useExchangeRates } from "./useExchangeRates";

const server = setupServer(
  rest.get("/api/rates", (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        base: "USD",
        source: "mock",
        timestamp: new Date().toISOString(),
        rates: {
          USD: 1,
          EUR: 0.9,
          GBP: 0.8,
          JPY: 150,
          CAD: 1.3,
          AUD: 1.5,
          CHF: 0.88,
          CNY: 7.2,
          INR: 82,
          UAH: 40,
        },
      }),
    );
  }),
);

describe("useExchangeRates", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("fetches rates", async () => {
    const { result } = renderHook(() => useExchangeRates("USD"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.data?.base).toBe("USD");
  });
});

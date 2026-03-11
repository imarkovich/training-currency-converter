/** @jest-environment node */

import { GET } from "./route";

describe("GET /api/rates", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns bad request for invalid currency", async () => {
    const response = await GET(new Request("http://localhost/api/rates?base=XXX"));
    expect(response.status).toBe(400);
  });

  it("uses fallback source when first source fails", async () => {
    const fetchSpy = jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
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
          { status: 200 },
        ),
      );

    const response = await GET(new Request("http://localhost/api/rates?base=USD"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.base).toBe("USD");
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});

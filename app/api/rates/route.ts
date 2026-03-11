import https from "node:https";
import { NextResponse } from "next/server";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/types";

export const revalidate = 3600;

const ONE_HOUR_IN_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 7000;

interface NormalizedRates {
  source: string;
  rates: Record<CurrencyCode, number>;
}

interface SourceDefinition {
  name: string;
  url: (base: CurrencyCode) => string;
  parse: (payload: unknown) => Record<string, number> | null;
}

const SOURCES: SourceDefinition[] = [
  {
    name: "exchangerate.host",
    url: (base) => `https://api.exchangerate.host/latest?base=${base}&symbols=${SUPPORTED_CURRENCIES.join(",")}`,
    parse: (payload) => {
      if (!payload || typeof payload !== "object" || !("rates" in payload)) {
        return null;
      }
      const rates = (payload as { rates?: Record<string, number> }).rates;
      return rates ?? null;
    },
  },
  {
    name: "exchangerate-api.com",
    url: (base) => `https://api.exchangerate-api.com/v4/latest/${base}`,
    parse: (payload) => {
      if (!payload || typeof payload !== "object" || !("rates" in payload)) {
        return null;
      }
      return (payload as { rates?: Record<string, number> }).rates ?? null;
    },
  },
  {
    name: "open.er-api.com",
    url: (base) => `https://open.er-api.com/v6/latest/${base}`,
    parse: (payload) => {
      if (!payload || typeof payload !== "object" || !("rates" in payload)) {
        return null;
      }
      return (payload as { rates?: Record<string, number> }).rates ?? null;
    },
  },
];

function isSslError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("ssl") ||
    message.includes("tls") ||
    message.includes("certificate") ||
    message.includes("unable to verify") ||
    message.includes("self signed")
  );
}

async function fetchWithSslFallback(url: string): Promise<unknown> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: ONE_HOUR_IN_SECONDS },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    if (!isSslError(error)) {
      throw error;
    }

    return insecureHttpsFetch(url);
  }
}

function insecureHttpsFetch(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        method: "GET",
        agent: new https.Agent({ rejectUnauthorized: false }),
        timeout: REQUEST_TIMEOUT_MS,
      },
      (response) => {
        let data = "";
        response.setEncoding("utf8");

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          if (!response.statusCode || response.statusCode >= 400) {
            reject(new Error(`SSL fallback failed with status ${response.statusCode ?? "unknown"}`));
            return;
          }

          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error("SSL fallback returned invalid JSON"));
          }
        });
      },
    );

    request.on("timeout", () => {
      request.destroy(new Error("SSL fallback request timed out"));
    });

    request.on("error", reject);
    request.end();
  });
}

function normalizeRates(base: CurrencyCode, sourceName: string, rates: Record<string, number>): NormalizedRates | null {
  const normalized = {} as Record<CurrencyCode, number>;

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === base) {
      normalized[currency] = 1;
      continue;
    }

    const rawRate = rates[currency];
    if (!rawRate || !Number.isFinite(rawRate)) {
      return null;
    }

    normalized[currency] = rawRate;
  }

  return { source: sourceName, rates: normalized };
}

async function fetchRates(base: CurrencyCode): Promise<NormalizedRates> {
  for (const source of SOURCES) {
    try {
      const payload = await fetchWithSslFallback(source.url(base));
      const rawRates = source.parse(payload);
      if (!rawRates) {
        continue;
      }

      const normalized = normalizeRates(base, source.name, rawRates);
      if (normalized) {
        return normalized;
      }
    } catch {
      // Continue with the next provider.
    }
  }

  throw new Error("All rate providers are unavailable");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const base = (searchParams.get("base") ?? "USD").toUpperCase();

  if (!SUPPORTED_CURRENCIES.includes(base as CurrencyCode)) {
    return NextResponse.json({ error: "Invalid base currency" }, { status: 400 });
  }

  try {
    const payload = await fetchRates(base as CurrencyCode);

    return NextResponse.json(
      {
        base,
        rates: payload.rates,
        source: payload.source,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch rates",
      },
      { status: 503 },
    );
  }
}

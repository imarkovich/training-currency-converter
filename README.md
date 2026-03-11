# Currency Converter App

A complete currency converter built with Next.js App Router, TypeScript, and Tailwind CSS.

## Features

- Multi-source exchange rate fetching with fallbacks:
	- exchangerate.host
	- exchangerate-api.com
	- open.er-api.com
- Server-side API endpoint with timeout handling and SSL fallback logic
- 1-hour caching via Next.js revalidation and cache headers
- Automatic conversion on every input or selection change
- 10 supported currencies
- URL query parameter persistence (`amount`, `from`, `to`)
- Conversion history (latest 10 records), with reload and clear actions
- Input validation and clear error messages
- Responsive layout for desktop and mobile

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Jest + React Testing Library
- MSW (Mock Service Worker) for API mocking in tests

## Project Structure

```text
app/
	api/rates/route.ts
	layout.tsx
	page.tsx
components/
hooks/
types/
utils/
jest.config.js
jest.setup.ts
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
```

## Testing

- Unit tests are co-located next to source files (`*.test.ts`, `*.test.tsx`)
- API route tests cover invalid input and fallback behavior
- Hook tests include MSW-based request mocking

Run all tests:

```bash
npm run test
```

## API Endpoint

`GET /api/rates?base=USD`

Response:

```json
{
	"base": "USD",
	"rates": {
		"USD": 1,
		"EUR": 0.92
	},
	"source": "open.er-api.com",
	"timestamp": "2026-03-11T12:00:00.000Z"
}
```

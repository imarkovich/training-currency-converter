# Changelog

All notable changes to this project are documented in this file.

## 1.0.0 - 2026-03-11

- Initialized Next.js App Router project with TypeScript and Tailwind CSS
- Implemented resilient exchange-rates API route with multiple providers and fallback strategy
- Added SSL fallback logic and timeout handling in server-side fetch flow
- Added one-hour caching via revalidate and response cache headers
- Built modular converter UI with validation, swap, automatic conversion, and error handling
- Added URL query persistence for converter state
- Added local conversion history with reload and clear actions
- Added unit tests for utilities, hooks, components, and API route
- Added Jest + React Testing Library + MSW test infrastructure
- Replaced starter docs with project-specific README

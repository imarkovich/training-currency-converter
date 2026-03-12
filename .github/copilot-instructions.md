## Session Management

- Always create a to-do list at the start of each multi-step task
- Maintain a temporary log file (copilot_session.log)

## Core Architecture

- Custom Hooks: useExchangeRates + useConverter
- Component Composition: Small, focused components
- State Management: URL-first with useSearchParams
- API Layer: Multiple fallback sources with 1-hour caching

## Critical Patterns

- Co-located tests (.tsx + .test.tsx)
- URL state management pattern
- API error handling with fallbacks

## **Note**: You can use either approach:
> - **GitHub Copilot**: Place instructions in `.github/copilot-instructions.md`
> - **Multi-Agent Support** (OPTIONAL): Create `AGENTS.md` at repository root for broader AI agent compatibility (Claude, Gemini, Cursor IDE, Windsurf, etc.).

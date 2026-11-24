@AGENTS.md

# Web (`apps/web`)

Next.js 16 (App Router) + React 19 + Tailwind CSS 4. UI only: it displays data and triggers API actions. Business rules live in the API.

## Commands

```bash
pnpm --filter web dev            # next dev (port 3000), against the real API
pnpm --filter web dev:mock       # next dev with the API mocked by MSW (no API/database needed)
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web check-types
pnpm --filter web test           # vitest run (test:watch for watch mode)
pnpm --filter web test:e2e       # playwright, mock mode (runs in CI)
pnpm --filter web test:e2e:real  # playwright, real API + database
```

## Structure

```text
app/                       routes (App Router)
  providers.tsx            client providers: TanStack Query, mock mode
  (app)/                   authenticated shell (sidebar + header)
  (auth)/                  login, sign-up, verify, password reset (no sidebar)
src/
  services/api.ts          the single Axios instance; every API call goes through it
  components/ui/           design system primitives (Button, Input, Table, Modal…)
  components/shell/        app shell (sidebar, header, nav config)
  features/<domain>/       per-domain code: api.ts, use-*.ts hooks, mocks.ts, forms, columns
  mocks/                   MSW setup: handlers.ts (aggregates features), node.ts, browser.ts
  test/                    test helpers (renderWithProviders)
  lib/                     generic helpers
  types/                   shared front-end types
e2e/                       Playwright specs
```

- Import alias: `@/*` maps to the app root, so imports look like `@/src/services/api`.
- Primitives: one file per component, no domain logic, accept `className` (applied last). Domain components (e.g. `BudgetStatusBadge`) live in `src/features/<domain>/`.
- Don't create abstractions shared between two features until a third one needs them.

## Routes

Paths are **English**, even when specs show Portuguese ones:

| Area        | Route                                                                  |
| ----------- | ---------------------------------------------------------------------- |
| Dashboard   | `/`                                                                    |
| Budgets     | `/budgets`                                                             |
| Work orders | `/work-orders`                                                         |
| Inventory   | `/inventory`                                                           |
| Machines    | `/machines`                                                            |
| Clients     | `/clients`                                                             |
| Suppliers   | `/suppliers`                                                           |
| Settings    | `/settings`                                                            |
| Auth        | `/login`, `/sign-up`, `/verify`, `/forgot-password`, `/reset-password` |

CRUD pattern: `/<resource>` (list), `/<resource>/new`, `/<resource>/[id]` (detail + edit).

## i18n (pt-BR + en)

- Every user-facing string exists in **pt-BR (default)** and **en**. No hardcoded text in components, including toasts, empty states, validation messages and page titles.
- API error `code`s are translated on the front; never display raw API messages to the user without a translation fallback.
- **Not set up yet.** Setting up the i18n layer is the first task of the visual identity / shell step. When it's done, document here: library, message file layout, how locale is resolved (URL segment vs cookie), and how to add a string.

## Styling

- Tailwind 4 CSS-first config: tokens are defined with `@theme` in `app/globals.css`. There is no `tailwind.config.js`.
- Use tokens (`bg-canvas`, `bg-canvas-muted`, `text-ink`, `text-ink-muted`, `text-brand`, `border-line`), **never raw hex values** in components.
- Brand: `#6F37E4`. Dark-mode canvas: `#101010`. Font: Sora (`next/font`). Light and dark mode via `next-themes` (`class` on `<html>`).
- Visual direction: minimal, clear hierarchy, low noise, good information density. It should look like a real B2B SaaS, not a template.

## UI states and feedback

- Every data view handles **loading, empty, error** and, for forms, **validation** states.
- Every mutation (save, delete, status change) gives visible feedback (toast) and disables the trigger while pending.
- Destructive actions ask for confirmation in a modal that names the item.
- Show API validation errors under the matching field when possible; otherwise in a toast.

## Data fetching

- Client components fetch with **TanStack Query**. Per feature: `api.ts` (functions that call `api`), `use-<thing>.ts` (hooks with `useQuery`/`useMutation` and exported query keys).
- `src/services/api.ts` uses Axios with the **fetch adapter**: same browser behavior (CORS, cookies), and MSW can intercept it in Vitest (jsdom's XHR blocks cross-origin mocks).
- Failed calls reject with `ApiError` (`message`, `status`, `code`). Branch on `code`, never on `message`.

## Mocks and tests

- Every API route the web calls has an MSW handler in `src/features/<domain>/mocks.ts`, registered in `src/mocks/handlers.ts`. The same handlers serve the unit tests and `pnpm dev:mock`.
- MSW 3: import `http`/`HttpResponse` from `msw/http`; the unhandled-request option is `onUnhandledFrame`.
- Mock mode is browser-only: `src/mocks/mock-worker.tsx` loads through `next/dynamic` with `ssr: false` because `msw/browser` cannot resolve during SSR. It never runs in production builds. Server Component fetches are not mocked.
- Unit tests: Vitest + Testing Library, `*.test.tsx` next to the component, rendered with `renderWithProviders` from `src/test/render.tsx`. Unmocked requests fail the test; override a handler per test with `server.use(...)`.
- E2E: Playwright specs in `e2e/` must pass in both modes (mock and real API).

## Auth and data

- The session is an httpOnly cookie set by the API; Axios uses `withCredentials: true`. Never store tokens in `localStorage` or `sessionStorage`.
- Hiding a button is UX, not security. The API must enforce every rule regardless of the UI.
- Env vars exposed to the browser need the `NEXT_PUBLIC_` prefix and must not contain secrets. Document them in `.env.example`.

## Code style

- ESLint: `eslint-config-next` (core-web-vitals + typescript).
- Prettier with root defaults (double quotes).
- Server Components by default; add `"use client"` only for components that need state, effects or browser APIs.

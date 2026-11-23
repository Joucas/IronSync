@AGENTS.md

# Web (`apps/web`)

Next.js 16 (App Router) + React 19 + Tailwind CSS 4. UI only: it displays data and triggers API actions. Business rules live in the API.

## Commands

```bash
pnpm --filter web dev      # next dev (port 3000)
pnpm --filter web build
pnpm --filter web lint
```

## Structure

```text
app/                       routes (App Router)
  (app)/                   authenticated shell (sidebar + header)
  (auth)/                  login, sign-up, verify, password reset (no sidebar)
src/
  services/api.ts          the single Axios instance; every API call goes through it
  components/ui/           design system primitives (Button, Input, Table, Modal…)
  components/shell/        app shell (sidebar, header, nav config)
  features/<domain>/       per-domain code: api.ts, forms, hooks, columns
  lib/                     generic helpers
  types/                   shared front-end types
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

## Auth and data

- The session is an httpOnly cookie set by the API; Axios uses `withCredentials: true`. Never store tokens in `localStorage` or `sessionStorage`.
- Hiding a button is UX, not security. The API must enforce every rule regardless of the UI.
- Env vars exposed to the browser need the `NEXT_PUBLIC_` prefix and must not contain secrets. Document them in `.env.example`.

## Code style

- ESLint: `eslint-config-next` (core-web-vitals + typescript).
- Prettier with root defaults (double quotes).
- Server Components by default; add `"use client"` only for components that need state, effects or browser APIs.

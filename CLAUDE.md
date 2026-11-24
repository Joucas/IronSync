# IronSync ERP

B2B multi-tenant SaaS ERP for small and mid-sized machining, metalworking and tooling shops. It covers clients, suppliers, machines, materials/inventory, budgets with cost calculation, and work orders. Every company (tenant) sees only its own data.

## Stack

| Layer            | Tech                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------- |
| Web (`apps/web`) | Next.js 16.4 (App Router), React 19.3, Tailwind CSS 4, Axios, TanStack Query 5              |
| API (`apps/api`) | NestJS 12 (CommonJS app), Prisma 7 (`prisma-client` + driver adapter), Swagger, pino        |
| Database         | PostgreSQL on Supabase                                                                      |
| Monorepo         | Turborepo 2, pnpm 10 workspaces                                                             |
| Tooling          | TypeScript 6.0, ESLint 9, Prettier 3                                                        |
| Tests            | Vitest 5 in both apps: + Supertest (API), + Testing Library + MSW 3 (web); Playwright (E2E) |
| CI               | GitHub Actions (`.github/workflows/ci.yml`)                                                 |
| Runtime          | Node 26 LTS (`.nvmrc`)                                                                      |

## Layout

```text
apps/
  web/        Next.js app (UI only, no business rules)
  api/        NestJS API (business rules, auth, tenant isolation, Prisma)
packages/     shared code (planned, none yet; workspace glob already set)
```

## Commands

Always use **pnpm** (never npm or yarn). From the repo root:

| Command                      | Does                                           |
| ---------------------------- | ---------------------------------------------- |
| `pnpm install`               | Install all workspaces                         |
| `pnpm dev`                   | Run web (:3000) and API (:3001) via Turbo      |
| `pnpm dev:mock`              | Run the web only, with the API mocked (MSW)    |
| `pnpm build`                 | Build all apps                                 |
| `pnpm lint`                  | Lint all apps                                  |
| `pnpm check-types`           | Type-check all apps                            |
| `pnpm test`                  | Unit tests of all apps                         |
| `pnpm test:e2e`              | Playwright E2E, web in mock mode (as in CI)    |
| `pnpm test:e2e:real`         | Playwright E2E against the real API + database |
| `pnpm format`                | Prettier on `**/*.{ts,tsx,md}`                 |
| `pnpm --filter api <script>` | Run a script in the API only                   |
| `pnpm --filter web <script>` | Run a script in the web app only               |

## CLAUDE.md index

Nested files load automatically when working in that folder. Read the relevant one before changing code there.

| File                                                                 | Covers                                                                                              |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [apps/api/CLAUDE.md](apps/api/CLAUDE.md)                             | NestJS module layout, bootstrap, env, Swagger, logging, tenant rules, DTOs, errors, security        |
| [apps/api/prisma/CLAUDE.md](apps/api/prisma/CLAUDE.md)               | Schema conventions, migrations, generated client                                                    |
| [apps/web/CLAUDE.md](apps/web/CLAUDE.md)                             | Next 16 caveats, folder structure, routes, data fetching, mocks and tests, i18n, styling, UI states |
| [CONTRIBUTING.md](CONTRIBUTING.md)                                   | Commit dictionary, branches, PR rules (imported below)                                              |
| [.github/pull_request_template.md](.github/pull_request_template.md) | PR body template                                                                                    |

## Golden rules

1. **Tenant isolation is a server-side security rule.** Every tenant-owned row has `companyId`; every query is scoped by it; cross-tenant access returns `404`. Never rely on the UI to hide other tenants' data.
2. **Business rules live in the API.** The web displays data and triggers actions; it never is the only place a rule is enforced.
3. **English everywhere in the codebase:** code, identifiers, comments, docs, routes, API messages, commits, PRs.
4. **The UI is bilingual: pt-BR (default) and en.** No hardcoded user-facing text; every string exists in both locales.
5. **No secrets in git.** Never commit `.env` / `.env.local`. Every new env var goes into the matching `.env.example` with a placeholder.
6. **One roadmap step at a time.** Build what the current step needs; no premature abstractions (e.g. no `packages/types` until types are actually shared).
7. **Product before CRUD.** Model the real shop workflow (who uses it, at which stage, what it triggers), not just create/read/update/delete.

## Domain glossary (PT → EN)

Specs and conversations are often in Portuguese. Use these names in code, routes and the database:

| Portuguese              | English (code)         |
| ----------------------- | ---------------------- |
| Empresa                 | `Company` (the tenant) |
| Usuário                 | `User`                 |
| Cliente                 | `Client`               |
| Fornecedor              | `Supplier`             |
| Máquina                 | `Machine`              |
| Valor/hora              | `hourlyRate`           |
| Material / Produto      | `Material` / `Product` |
| Estoque                 | `Inventory`            |
| Movimentação de estoque | `InventoryMovement`    |
| Orçamento               | `Budget`               |
| Item do orçamento       | `BudgetItem`           |
| Ordem de Serviço (OS)   | `WorkOrder`            |
| Operação (processo)     | `Operation`            |
| Peça                    | `Part`                 |
| Configurações           | `Settings`             |

Add a row whenever a new domain term appears.

## Git workflow

Trunk-based: short-lived branches from `main`, Conventional Commits in English, PRs squash-merged. Full rules:

@CONTRIBUTING.md

## Maintaining these files

- When a convention changes, update the CLAUDE.md that owns it in the same PR.
- When a folder gets conventions of its own, add a `CLAUDE.md` there and a row in the index above.
- Keep these files short and specific. Explanations belong in code comments or the README.

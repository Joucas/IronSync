<div align="center">

# IronSync ERP

**A specialized ERP platform for small machining shops — built for precision, speed, and operational control.**

![Status](https://img.shields.io/badge/status-active%20development-blue?style=flat-square)
![Version](https://img.shields.io/badge/version-2.0-informational?style=flat-square)
![License](https://img.shields.io/badge/license-proprietary-red?style=flat-square)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20PostgreSQL-informational?style=flat-square)
![Monorepo](https://img.shields.io/badge/monorepo-TurboRepo-blueviolet?style=flat-square)

</div>

---

## Overview

IronSync ERP is a modular management system designed specifically for small machining and metalworking companies. It addresses a critical gap in the market: existing ERP solutions are either too generic, too expensive, or too complex for businesses in this sector.

The platform centralizes operations that are typically managed through fragmented manual processes — eliminating spreadsheet dependencies, reducing calculation errors, and giving managers real-time visibility over production, inventory, and budget workflows.

The project was originally developed as an academic work at Faculdade de Tecnologia de Tatuí (FATEC Tatuí) and is currently evolving into its second version, incorporating multi-tenant support and more granular production tracking capabilities.

---

## Problem

Small machining shops face a recurring set of operational challenges that manual processes cannot sustainably solve:

- Fragmented information across departments with no unified view of operations
- Material calculation errors that directly impact production costs and profit margins
- Missed deadlines caused by lack of visibility into job and order progress
- Excessive management time spent on spreadsheet maintenance instead of operations
- Difficulty scaling workflows as production volume increases

As companies grow, these problems compound. Manual methods that worked at smaller scale become a hard ceiling on business expansion.

---

## Solution

IronSync ERP provides only what machining shops actually need — no unnecessary modules, no steep learning curve, no months-long onboarding process.

The system covers the full operational cycle: from customer registration and budget creation through parts and tooling control, operation tracking, and service order execution. Each module is designed around the real workflows of metalworking operations.

---

## Target Market

The initial focus is on small machining and metalworking companies with up to 20 employees that have already recognized the limitations of manual processes and are actively seeking a solution. This segment is underserved by both large-scale generic ERPs (too complex and expensive) and basic tools (too limited to handle production workflows).

---

## Functional Requirements

### Customer and Company Management
- Full customer registration including corporate data, contact, and address
- Customer listing, editing, and removal
- Company registration screen enabling multi-tenant support *(v2)*

### Materials and Tooling
- Material registration with technical specifications, supplier, and pricing
- Tool registration and association with parts and operations
- Inventory listing and editing

### Operations and Production
- Operation registration with name, description, and hourly rate
- Association of operations to parts through relational mapping
- Parts registration including material, weight, quantity, and linked operations

### Budget Management
- Budget creation linked to customers, tools, and operations
- Detailed cost breakdown per budget item
- PDF export of budgets
- Service order generation from approved budgets *(v2)*

### Service Orders *(v2)*
- Service order creation from accepted budget items
- Employee assignment to service orders for traceability
- Employee-facing execution interface for real-time order tracking
- Machine time tracking per employee and operation

### Employee Management *(v2)*
- Employee registration and profile management
- Role-based assignment to service orders
- Execution history and traceability per employee

---

## Non-Functional Requirements

- **Usability:** Intuitive interface accessible to users with limited ERP experience
- **Security:** Data protection via authentication and access control
- **Scalability:** Modular architecture allowing new features to be added incrementally
- **Performance:** System queries processed in under 2 seconds
- **Multi-tenancy:** Company-level data isolation to support multiple organizations *(v2)*

---

## Features Deferred to Future Phases

- Direct CNC machine integration for automated production monitoring
- Native mobile application for remote access
- AI-powered predictive analysis for demand forecasting and inventory optimization
- Advanced custom report builder for end users

---

## Competitive Positioning

IronSync competes against three types of alternatives:

**Large generic ERPs** (e.g., SAP Business One, TOTVS, Senior) are built for multiple industries, resulting in high complexity, long onboarding periods, and features irrelevant to machining operations — at a significantly higher cost. IronSync focuses exclusively on the workflows that metalworking businesses actually use, enabling onboarding in days rather than months.

**Spreadsheets and manual methods** are the current default for most small shops. They work at low volume but break down under growth, creating the exact bottlenecks IronSync is designed to eliminate.

**Generic small-business software** covers basic accounting and inventory but lacks domain-specific workflows such as operation sequencing, job-order management, and parts-based cost estimation.

---

## Architecture

The system is built using a **monorepo architecture**, allowing the frontend, backend, and shared packages to coexist in a single repository with clearly defined boundaries.

### Architectural Principles

- Modular monolith with domain-driven backend structure
- Clear separation of concerns across layers
- Reusable shared packages (types, utilities, configs)
- Scalable folder and code organization
- Incremental evolution towards microservices if needed

### Backend Structure

```
Domain-driven modules (users, orders, inventory, budgets, ...)
└── Layered architecture
    ├── Controllers  → HTTP layer
    ├── Services     → Business logic
    └── Repositories → Data access (via Prisma ORM)
```

### Frontend Structure

```
Feature-based organization
├── API consumption layer (services)
├── Reusable UI components
└── Scalable routing (App Router)
```

---

## Technology Stack

| Layer        | Technology                                |
|--------------|-------------------------------------------|
| **Frontend** | Next.js (App Router) + TypeScript + Axios |
| **Backend**  | NestJS + TypeScript + Prisma ORM          |
| **Database** | PostgreSQL (via Supabase)                 |
| **Monorepo** | TurboRepo + pnpm Workspaces               |
| **Config**   | Environment-based configuration           |
| **Testing**  | Jest + Supertest (API), Vitest + Testing Library + MSW (web), Playwright (E2E) |
| **API docs** | OpenAPI / Swagger UI                      |

> The first version of the system was built with Laravel (PHP 11.x), React 18.x, and MySQL. The current version adopts a TypeScript-first stack across frontend and backend.

---

## Getting Started

### Prerequisites

- Node.js ≥ 20.19 (24 LTS recommended)
- pnpm 10 (`corepack enable` installs the version pinned in `package.json`)
- A PostgreSQL database. Development uses a Supabase project (the free plan is enough).

### 1. Install

```bash
pnpm install   # also generates the Prisma client
```

### 2. Configure the environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

In `apps/api/.env`, set `DATABASE_URL`. In Supabase, open **Connect** and copy the **Session pooler** string (port 5432): it works over IPv4 and supports both the app and migrations. Replace `[YOUR-PASSWORD]` with the database password **without the brackets**, and URL-encode special characters.

The API validates every variable at startup and refuses to start, with a clear message, when one is missing or invalid.

### 3. Create the database schema

```bash
pnpm --filter api prisma:migrate
```

### 4. Run

| Command         | What runs                       | Use it for                                                                    |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| `pnpm dev`      | Web + API                       | Day-to-day work against the real API and database                             |
| `pnpm dev:mock` | Web only, API mocked with MSW   | UI work without the API or database. A **MOCK** badge shows in the corner.    |

| URL                              | What                                                  |
| -------------------------------- | ----------------------------------------------------- |
| http://localhost:3000            | Web app                                               |
| http://localhost:3001/api        | API                                                   |
| http://localhost:3001/api/docs   | API docs (Swagger UI). JSON at `/api/docs-json`.      |
| http://localhost:3001/api/health | Health check of the API and the database              |

Mock mode notes:

- Mocks live next to each feature in `apps/web/src/features/<domain>/mocks.ts`. The unit tests and `pnpm dev:mock` share them.
- Only requests made in the browser are mocked. Data fetched in Server Components is not.

### Tests

| Command                       | Runs                                                                      |
| ----------------------------- | ------------------------------------------------------------------------- |
| `pnpm test`                   | Unit tests: API (Jest) and web (Vitest + Testing Library + MSW)           |
| `pnpm test:e2e`               | Browser E2E (Playwright) against the web in mock mode. Runs in CI.        |
| `pnpm test:e2e:real`          | The same E2E specs against the real API and database                      |
| `pnpm --filter api test:e2e`  | API e2e (Supertest) against the database in `apps/api/.env`               |

Before the first E2E run: `pnpm --filter web exec playwright install chromium`.

### Other commands

| Command                           | Does                                    |
| --------------------------------- | --------------------------------------- |
| `pnpm lint`                       | ESLint on both apps                     |
| `pnpm check-types`                | TypeScript check on both apps           |
| `pnpm build`                      | Production build of both apps           |
| `pnpm --filter api prisma:studio` | Browse the database in Prisma Studio    |

Every pull request runs lint, type-check, unit tests, build and the mock-mode E2E in GitHub Actions.

---

## AI-Assisted Development

The repository is set up for coding agents such as Claude Code:

- `CLAUDE.md` files (root and per app) hold the conventions. `apps/web/AGENTS.md` points agents to the Next.js docs bundled in `node_modules/next/dist/docs/`.
- `.mcp.json` registers the official **Next.js DevTools MCP** server. With `pnpm dev` running, the agent can read build errors, routes and logs from the dev server. Claude Code asks you to approve it the first time.
  - **Native Windows:** `npx` cannot start without a shell there. Add a local server with the same name, which takes precedence over the project one:

    ```bash
    claude mcp add --scope local next-devtools -- cmd /c npx -y next-devtools-mcp@latest
    ```

Recommended skills, installed per machine (`-g`), not stored in the repository:

```bash
npx skills add vercel/next.js --skill next-dev-loop -g
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices -g
npx skills add vercel-labs/agent-skills --skill vercel-composition-patterns -g
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -g
```

| Skill                         | Use it for                                                         |
| ----------------------------- | ------------------------------------------------------------------ |
| `next-dev-loop`               | Verify changes against the running dev server and a real browser   |
| `vercel-react-best-practices` | React and Next.js performance rules                                |
| `vercel-composition-patterns` | Component API design                                               |
| `web-design-guidelines`       | UI and accessibility review                                        |

Optional: `design-taste-frontend` (`npx skills add Leonxlnx/taste-skill -g`) targets landing pages and marketing sites rather than ERP screens.

---

## Development Methodology

The project follows an agile workflow inspired by Scrum, with weekly sprints, incremental feature delivery, and continuous refactoring. Version control is managed via Git with trunk-based development and Conventional Commits for a consistent and readable history.

- **Trunk-based development** — `main` branch + short-lived feature branches
- **Conventional Commits** — clear and consistent version history
- Continuous refactoring and improvement
- Focus on maintainability and readability

---

## Scalability Strategy

### Phase 1 — Initial Growth
- Modular monolith architecture
- Query optimization and strategic indexing
- Redis caching layer for frequently accessed data

### Phase 2 — Expansion
- Migration of high-write components to dedicated relational database instances
- Read replicas for analytics queries
- Microservices for resource-intensive features (cost estimation, report generation)
- Message queues for asynchronous processing

### Phase 3 — Scale
- Full microservices architecture across production, inventory, CRM, and analytics domains
- Container orchestration with Kubernetes
- Multi-region deployment for reliability and latency
- Dedicated data warehouse for business intelligence

---

## Deployment Strategy

Each component is deployed independently:

| Component    | Deployment                             |
|--------------|----------------------------------------|
| **Frontend** | Web application (Vercel / custom)      |
| **Backend**  | API service (Railway / Docker / cloud) |
| **Database** | Managed PostgreSQL via Supabase        |

> The architecture supports **continuous deployment** and **independent scaling** of all components.

---

## Roadmap

- [ ] Customer and contact management
- [ ] Materials and tooling registration
- [ ] Operations management
- [ ] Budget creation and PDF export
- [ ] Company registration and multi-tenant support *(v2)*
- [ ] Service order management from approved budgets *(v2)*
- [ ] Employee registration and assignment *(v2)*
- [ ] Employee-facing service order execution interface *(v2)*
- [ ] Machine time tracking per operation and employee *(v2)*
- [ ] CNC machine integration *(future)*
- [ ] Mobile application *(future)*
- [ ] AI-powered predictive analysis *(future)*

---

## Academic Context

This project was originally developed as a graduation work (*Trabalho de Graduação*) at **Faculdade de Tecnologia de Tatuí — FATEC Tatuí**, under the Technology in Systems Analysis and Development program, with guidance from Prof. Me. Rafael de Sá Mascarenhas.

**Authors:** Caique Martins dos Santos, Gustavo Ferreira Cordeiro, João Gabriel de Moura Franco, Joaquim André.

---

## Disclaimer

This project is currently under **active development**. It is being built following production-level standards with the intention of evolving into a commercially available platform for the machining and metalworking industry.

---

<div align="center">

*Transforming machining operations — one workflow at a time.*

</div>

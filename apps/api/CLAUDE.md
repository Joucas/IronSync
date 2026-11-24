# API (`apps/api`)

NestJS 12 API. Owns business rules, auth, tenant isolation and all database access (Prisma 7). Schema rules live in [prisma/CLAUDE.md](prisma/CLAUDE.md).

## Commands

```bash
pnpm --filter api dev                # nest start --watch (port 3001)
pnpm --filter api build
pnpm --filter api lint               # eslint --fix
pnpm --filter api check-types
pnpm --filter api test               # vitest unit tests (test:watch, test:cov)
pnpm --filter api test:e2e           # supertest, uses the database in .env (local only, not in CI)
pnpm --filter api prisma:generate    # also runs on pnpm install (postinstall)
pnpm --filter api prisma:migrate --name <snake_case_name>
pnpm --filter api prisma:studio
```

## Module layout

One folder per domain, English, kebab-case, plural:

```text
src/
  <domain>/                 e.g. clients/, work-orders/
    <domain>.module.ts
    <domain>.controller.ts
    <domain>.service.ts
    dto/                    create-*.dto.ts, update-*.dto.ts, list-*.query.ts, *-response.dto.ts
    <domain>.service.spec.ts
  common/                   cross-cutting code
    config/                 env.validation.ts (every env var the API reads)
    logger/                 pino.config.ts
  prisma/                   PrismaModule (@Global) + PrismaService
  generated/prisma/         Prisma client (generated, gitignored)
  health/                   GET /api/health (reference module)
  app.setup.ts              HTTP setup shared by main.ts and the e2e tests
  app.module.ts
  main.ts
```

- Controllers are thin: parse input, call the service, return. Logic goes in services.
- Register new modules in `AppModule`.
- `src/users/` is the Nest CLI scaffold, not a real module and not imported. Don't build on it until the company/user step.

## Bootstrap

`setupApp()` in `src/app.setup.ts` holds the HTTP setup, so the e2e tests run the same configuration as the server:

- `helmet()` security headers.
- Global prefix `api` → routes are `/api/<resource>`.
- CORS: `origin` = exact `FRONTEND_URL`, `credentials: true`.
- `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- Swagger UI at `/api/docs` (JSON at `/api/docs-json`) when `SWAGGER_ENABLED=true`.
- Shutdown hooks (closes the Prisma pool on SIGTERM).

`main.ts` adds the pino logger (`bufferLogs` + `app.useLogger`) and listens on `PORT`.

## Environment

- Every variable is declared and validated in `src/common/config/env.validation.ts`. The API refuses to start when one is missing or invalid. New variable → add it there **and** in `.env.example`.
- Read env through `ConfigService<EnvironmentVariables, true>` with `config.get('NAME', { infer: true })`. Never `process.env` in services.
- Booleans need an explicit `@Transform`: env values are strings and `Boolean('false')` is `true`.

## API docs (Swagger)

- The `@nestjs/swagger` CLI plugin (`nest-cli.json`) documents DTOs from their TypeScript types and JSDoc comments. Return DTO classes from controllers, not inline object types.
- Each controller gets `@ApiTags('<domain>')`. Document non-2xx outcomes with `@Api*Response` (e.g. `@ApiNotFoundResponse`).

## Logging

- Use Nest's `Logger` (`new Logger(MyService.name)`); it is routed to pino. Never `console.log`.
- Each request gets an id (`x-request-id`, echoed in the response). Readable lines in development, JSON elsewhere.
- Never log secrets, tokens, cookies or full request bodies.

## Dependencies

- The API stays **CommonJS** while NestJS 12 packages (`@nestjs/*`) are **ESM-only**. Compiled `require()` calls load them through Node's `require(esm)`, so don't switch the app to `"type": "module"` without a dedicated migration.
- Keep every `@nestjs/*` package on the same major (12). Before adding a package, check its `"type"` and `peerDependencies` (`@nestjs/core ^12`).
- TypeScript is 6.0 (required by `@nestjs/schematics` 12). TypeScript 7 is not usable yet: typescript-eslint doesn't support it.
- The tsconfig sets `strict: false`, `types: ["node"]` and `rootDir` explicitly because TypeScript 6 changed those defaults.

## Tenant rules (security, non-negotiable)

- Get the tenant with `getTenant()` / `tenantWhere()` from `src/common/tenant/`. Never read `companyId` from the request body, params or query.
- Read one row: `findFirst({ where: { id, ...tenantWhere() } })`. **Never** `findUnique({ where: { id } })` alone.
- Lists, counts, updates and deletes are always filtered by `companyId`.
- Create: `data: { ...dto, companyId: getTenant().companyId }`.
- Row not found in the current tenant → `NotFoundException` (`404`), never `403`, so ids from other tenants are not confirmed.
- Companies with status `PENDING` must not reach domain endpoints.
- Review check: grep `prisma.<model>.` in the changed files and confirm every call is scoped.

## DTOs and responses

- Validate with `class-validator` + `class-transformer`. Every body and query has a DTO class.
- `Update<Entity>Dto extends PartialType(Create<Entity>Dto)` (import `PartialType` from `@nestjs/swagger` so docs stay in sync).
- List query: `q?` (search), `page` (default 1), `perPage` (default 20, max 100), with `@Type(() => Number)`.
- List response shape:

  ```ts
  { data: T[]; meta: { page: number; perPage: number; total: number } }
  ```

- Never return secrets: strip `passwordHash` and token hashes from every response.

## Errors

- Use Nest HTTP exceptions with **English** messages.
- When the web needs to react to a specific case, add a stable machine-readable `code` (e.g. `{ code: 'EMAIL_NOT_VERIFIED' }`). The web translates codes; it never parses messages.
- Duplicates inside a tenant → `409 Conflict`.

## Auth and security

- JWT travels only in an httpOnly cookie (`sameSite: 'lax'`, `secure` in production). Never in a response body for storage.
- Hash passwords with bcrypt. Store **hashes** of verification/reset tokens, never raw values.
- Login, register and forgot-password never reveal whether an email exists.
- Rate-limit auth routes.

## Code style

- Prettier: single quotes, trailing commas (`.prettierrc`). ESLint: `typescript-eslint` type-checked config.
- `moduleResolution: nodenext`: imports of the generated Prisma client use the `.js` extension (e.g. `'../generated/prisma/client.js'`). Vite resolves them to the `.ts` sources in tests.
- Tests: **Vitest**, the same runner as the web. Unit tests are `*.spec.ts` next to the file under test (`vitest.config.mts`). E2E tests are `test/*.e2e-spec.ts` (`vitest.config.e2e.mts`); they call `setupApp()` and use the database in `.env`, so they run locally only.
- Import `describe`, `it`, `expect` and `vi` from `'vitest'`; there are no test globals. Mock with `vi.fn()`.
- Decorator metadata (Nest DI, class-transformer types) comes from Vite 8's Oxc transform reading `emitDecoratorMetadata` in tsconfig.json; no SWC plugin needed.
- Service tests must cover tenant scoping for new domain logic.

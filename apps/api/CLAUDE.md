# API (`apps/api`)

NestJS 11 API. Owns business rules, auth, tenant isolation and all database access (Prisma 7). Schema rules live in [prisma/CLAUDE.md](prisma/CLAUDE.md).

## Commands

```bash
pnpm --filter api dev        # nest start --watch (port 3001)
pnpm --filter api build
pnpm --filter api lint       # eslint --fix
pnpm --filter api test       # jest unit tests
pnpm --filter api test:e2e
pnpm --filter api exec prisma generate
pnpm --filter api exec prisma migrate dev
```

Once `prisma:generate`, `prisma:migrate` and `prisma:studio` scripts exist in `package.json`, prefer them.

## Module layout

One folder per domain, English, kebab-case, plural:

```text
src/
  <domain>/                 e.g. clients/, work-orders/
    <domain>.module.ts
    <domain>.controller.ts
    <domain>.service.ts
    dto/                    create-*.dto.ts, update-*.dto.ts, list-*.query.ts
    <domain>.service.spec.ts
  common/                   cross-cutting code (tenant/, guards, filters, utils)
  prisma/                   PrismaModule (@Global) + PrismaService
  app.module.ts
  main.ts
```

- Controllers are thin: parse input, call the service, return. Logic goes in services.
- Register new modules in `AppModule`.
- `src/users/` is the Nest CLI scaffold, not a real module yet. Don't build on it until the company/user step.

## Bootstrap (expected in `main.ts`)

Check `src/main.ts` before assuming. The target setup is:

- Global prefix `api` → routes are `/api/<resource>`.
- `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`.
- CORS: `origin` = exact `FRONTEND_URL`, `credentials: true`.
- `ConfigModule.forRoot({ isGlobal: true })`. Read env via `ConfigService`, not `process.env` scattered in services.

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
- `Update<Entity>Dto extends PartialType(Create<Entity>Dto)`.
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
- `moduleResolution: nodenext`: imports of the generated Prisma client use the `.js` extension (e.g. `'../generated/prisma/client.js'`).
- Tests: Jest, `*.spec.ts` next to the file under test; e2e tests in `test/`. Service tests must cover tenant scoping for new domain logic.

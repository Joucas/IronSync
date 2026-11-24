# Prisma schema (`apps/api/prisma`)

Prisma 7 with the `prisma-client` generator and the PostgreSQL driver adapter (`@prisma/adapter-pg`). Connection config lives in `apps/api/prisma.config.ts` (reads `DATABASE_URL` from `.env` via dotenv).

## Naming

- Models: singular PascalCase, English (`Client`, `WorkOrder`, `BudgetItem`). Use the glossary in the root [CLAUDE.md](../../../CLAUDE.md).
- Fields: camelCase. Foreign keys: `<relation>Id` (`companyId`, `clientId`).
- Enums: PascalCase name, UPPER_SNAKE values (`enum CompanyStatus { PENDING ACTIVE }`).

## Every model

```prisma
id        String   @id @default(cuid())
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

## Tenant-owned models

Everything that belongs to a company (clients, suppliers, machines, materials, budgets, work orders…):

```prisma
companyId String
company   Company @relation(fields: [companyId], references: [id], onDelete: Cascade)

@@index([companyId])
```

- Add the back-relation on `Company` (e.g. `clients Client[]`).
- Add composite indexes for common filters: `@@index([companyId, <field>])`.

## Uniqueness

- Unique constraints are **per tenant**: `@@unique([companyId, field])`. Never a global unique on business data (including `User.email`).
- Don't declare unique on nullable columns (multiple `NULL`s break the intent). Validate duplicates in the service instead, only when the value is present.

## Types

- Money, rates and quantities with decimals use `Decimal` (e.g. `hourlyRate Decimal @db.Decimal(12, 2)`), never `Float`.
- Status fields use enums, not free strings.
- Delete is a hard delete unless a step explicitly requires soft delete.

## Migrations

```bash
pnpm --filter api prisma:migrate --name <snake_case_name>
```

- Name describes the change: `company_and_user`, `clients`, `auth_tokens`, `machines_hourly_rate`.
- Never edit a migration that has been applied or committed. Create a new one.
- Commit the migration in the same commit as the schema change.
- Run `pnpm --filter api prisma:generate` after every schema edit (Prisma 7 `migrate dev` does not regenerate the client).
- Supabase: use the session pooler URL (port 5432) for both the app and `migrate`.
- `P1001 Can't reach database server` with a reachable host can be a wrong password: the Supabase pooler rejects the login and Prisma reports it as P1001. Test the URL with `pg` to see the real error.

## Generated client

- Never edit generated files. They are gitignored.
- Output: `apps/api/src/generated/prisma` (`output = "../src/generated/prisma"`), inside `src` so `nest build` compiles it.
- `pnpm install` regenerates it (`postinstall` in `apps/api/package.json`).
- Import it as `'../generated/prisma/client.js'` (relative, with `.js`).

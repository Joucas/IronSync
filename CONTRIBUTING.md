# Contributing

All commit messages, branch names, PR titles and PR descriptions are written in **English**.

## Commits

IronSync uses [Conventional Commits](https://www.conventionalcommits.org/).

```text
<type>(<scope>)!: <subject>

<body>

<footer>
```

### Types

| Type       | Use for                                                   |
| ---------- | --------------------------------------------------------- |
| `feat`     | A new user-facing capability or API endpoint              |
| `fix`      | A bug fix                                                 |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf`     | A performance improvement                                 |
| `test`     | Adding or adjusting tests only                            |
| `docs`     | Documentation only (README, CLAUDE.md, code comments)     |
| `style`    | Formatting only (Prettier, whitespace); no logic change   |
| `build`    | Build system, dependencies, package scripts               |
| `ci`       | CI/CD pipelines                                           |
| `chore`    | Maintenance that fits nothing above (config, cleanup)     |
| `revert`   | Reverts a previous commit                                 |

### Scopes

| Scope  | Area                                          |
| ------ | --------------------------------------------- |
| `api`  | `apps/api` (NestJS)                           |
| `web`  | `apps/web` (Next.js)                          |
| `db`   | Prisma schema and migrations                  |
| `ui`   | Design system primitives and tokens           |
| `deps` | Dependency changes                            |
| `ci`   | Pipelines                                     |
| `repo` | Root / monorepo config (Turbo, pnpm, tooling) |

A feature that spans API and web uses the **domain** as scope: `auth`, `tenant`, `clients`, `suppliers`, `machines`, `inventory`, `budgets`, `work-orders`, `dashboard`, `settings`.

The scope may be omitted for repo-wide changes (e.g. `docs: update readme`).

### Subject

- Imperative mood: "add", not "added" or "adds".
- Lowercase, no trailing period.
- At most 72 characters.

### Body (optional)

- Explain **why**, not what (the diff shows what).
- Wrap at 72 characters.

### Footer (optional)

- `BREAKING CHANGE: <description>`: also add `!` after the scope in the header.
- `Closes #12` / `Refs #12`: link issues.
- `Co-Authored-By: <name> <email>`: when someone (or an AI assistant) co-authored the change.

### Rules

- One logical change per commit.
- A schema change and the migration it generates go in the same commit.
- Never commit secrets, `.env` or `.env.local` files.

### Examples

```text
feat(clients): add paginated client list
fix(auth): return 401 without revealing whether the email exists
build(deps): add @prisma/adapter-pg and pg
feat(db): add client model scoped by company
refactor(api)!: replace tenant header middleware with jwt interceptor

BREAKING CHANGE: x-company-id and x-user-id headers are no longer read.
```

## Branches

Trunk-based development: `main` is always deployable; work happens on short-lived branches.

```text
<type>/<short-kebab-description>
```

Examples: `feat/clients-crud`, `fix/login-redirect`, `docs/claude-setup`, `build/prisma-adapter`.

- Branch from an up-to-date `main`.
- Never commit directly to `main`.
- Delete the branch after it is merged.

## Pull requests

- **Title** follows the commit format (e.g. `feat(clients): add client crud`). It becomes the commit message on `main`.
- **Merge strategy:** squash merge.
- **Size:** one roadmap step or one coherent slice of it. Split anything that is hard to review in one sitting.
- **Description:** follow [.github/pull_request_template.md](.github/pull_request_template.md). Remove sections that don't apply (e.g. Screenshots for API-only PRs) instead of leaving them empty.

Before opening a PR:

1. `pnpm lint` passes.
2. `pnpm check-types` passes.
3. `pnpm --filter api test` passes (and new logic has tests).
4. Migrations are committed with their schema change.
5. New env vars are documented in the matching `.env.example`.
6. New UI text exists in pt-BR and en.

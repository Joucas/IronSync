## Summary

<!-- 1–3 sentences: what this PR does and why. -->

## Changes

<!-- Group by area. Remove lines that don't apply. -->

- **api:**
- **web:**
- **db:** <!-- include the migration name -->

## How to test

<!-- Steps a reviewer can follow locally. -->

1.

## Screenshots

<!-- UI changes only. Show pt-BR and en, light and dark. Remove this section otherwise. -->

## Checklist

- [ ] `pnpm lint` and `pnpm check-types` pass
- [ ] Tests added or updated, and passing
- [ ] Tenant isolation verified: queries scoped by `companyId`, another tenant gets `404`
- [ ] New UI text exists in pt-BR and en (no hardcoded strings)
- [ ] Migrations included; new env vars added to `.env.example`
- [ ] No secrets or private material included

## Notes

<!-- Breaking changes, follow-ups, known limitations. Remove if empty. -->

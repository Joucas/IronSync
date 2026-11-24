import { defineConfig } from 'vitest/config';

// E2E tests boot the whole AppModule against the database in apps/api/.env,
// so they run locally only (not in CI) and one file at a time.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.e2e-spec.ts'],
    fileParallelism: false,
  },
});

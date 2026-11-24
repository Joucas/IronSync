import { defineConfig, devices } from "@playwright/test";

/**
 * Two modes, same specs:
 * - `pnpm test:e2e`      → web in mock mode (MSW), no API or database needed. Used in CI.
 * - `pnpm test:e2e:real` → real API + web, using the database from apps/api/.env.
 */
const isRealApi = process.env.E2E_MODE === "real";
const isCI = Boolean(process.env.CI);

const webServerDefaults = {
  reuseExistingServer: !isCI,
  timeout: 120_000,
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: isRealApi
    ? [
        {
          ...webServerDefaults,
          command: "pnpm --filter api dev",
          // Ready only when the database answers (health returns 503 otherwise).
          url: "http://localhost:3001/api/health",
        },
        {
          ...webServerDefaults,
          command: "pnpm dev",
          url: "http://localhost:3000",
        },
      ]
    : {
        ...webServerDefaults,
        command: "pnpm dev:mock",
        url: "http://localhost:3000",
      },
});

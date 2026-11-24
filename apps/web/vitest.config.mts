import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolves the `@/*` alias from tsconfig.json (native in Vite 8).
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    // Component/unit tests only; Playwright specs live in e2e/.
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
  },
});

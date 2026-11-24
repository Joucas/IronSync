import { defineConfig } from 'vitest/config';

// Unit tests. Vite 8 (Oxc) reads `experimentalDecorators` and
// `emitDecoratorMetadata` from tsconfig.json, so Nest DI works without SWC.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**', 'src/**/*.spec.ts', 'src/main.ts'],
    },
  },
});

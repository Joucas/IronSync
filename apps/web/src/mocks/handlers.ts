import { healthHandlers } from "@/src/features/health/mocks";

/**
 * Every mocked API route. Each feature owns its handlers in
 * `src/features/<domain>/mocks.ts`; add them here.
 * Shared by the tests (`node.ts`) and the browser mock mode (`browser.ts`).
 */
export const handlers = [...healthHandlers];

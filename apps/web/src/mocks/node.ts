import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/** Intercepts requests in Node (Vitest). */
export const server = setupServer(...handlers);

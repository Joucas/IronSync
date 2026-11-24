import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/** Intercepts browser requests through `public/mockServiceWorker.js`. */
export const worker = setupWorker(...handlers);

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./src/mocks/node";

// Every request in a test must hit an MSW handler; unmocked calls fail loudly.
beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => server.close());

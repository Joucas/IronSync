import { http, HttpResponse } from "msw/http";
import { API_URL } from "@/src/services/api";
import type { Health } from "./api";

/** Default handlers: the API and database are healthy. */
export const healthHandlers = [
  http.get(`${API_URL}/health`, () =>
    HttpResponse.json<Health>({
      status: "ok",
      database: "up",
      timestamp: new Date().toISOString(),
    }),
  ),
];

/** Override for tests: the database is down and the API answers 503. */
export const healthDownHandler = http.get(`${API_URL}/health`, () =>
  HttpResponse.json({ status: "error", database: "down" }, { status: 503 }),
);

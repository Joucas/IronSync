import axios from "axios";

/**
 * NestJS API base URL, including the global `/api` prefix.
 * `NEXT_PUBLIC_*` values are inlined at build time.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/** Error thrown by every failed API call, with a normalized message. */
export class ApiError extends Error {
  readonly status?: number;
  /** Stable machine-readable code sent by the API, translated by the UI. */
  readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** The single HTTP client. Every API call goes through it. */
export const api = axios.create({
  baseURL: API_URL,
  // Fetch instead of XHR: same browser behavior (CORS, cookies), and MSW can
  // intercept it in Vitest, where jsdom's XHR blocks cross-origin mocks.
  adapter: "fetch",
  timeout: 10_000,
  // The session will travel in an httpOnly cookie set by the API.
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type ApiErrorBody = { message?: string | string[]; code?: string };

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorBody>(error)) return Promise.reject(error);

    const body = error.response?.data;
    const raw = body?.message ?? error.message;
    const message = Array.isArray(raw) ? raw[0] : raw;

    return Promise.reject(
      new ApiError(message, error.response?.status, body?.code),
    );
  },
);

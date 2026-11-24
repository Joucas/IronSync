"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ApiMocking } from "@/src/mocks/api-mocking";

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  });
}

function getQueryClient() {
  // A new client per server render keeps requests isolated;
  // the browser reuses one client so the cache survives re-renders.
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApiMocking>
      <QueryClientProvider client={getQueryClient()}>
        {children}
        {/* Rendered only in development. */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ApiMocking>
  );
}

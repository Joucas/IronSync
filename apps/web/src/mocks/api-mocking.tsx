"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, type ReactNode } from "react";

/**
 * Mock mode (`pnpm dev:mock`): the browser talks to MSW instead of the API.
 * Never enabled in production builds, so the MSW code is dropped there.
 */
export const isApiMockingEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

// Browser-only (`msw/browser` cannot resolve during SSR). The condition is
// constant-folded at build time, so production builds emit no MSW chunk.
const MockWorker = isApiMockingEnabled
  ? dynamic(() => import("./mock-worker"), { ssr: false })
  : () => null;

/** Waits for the mock service worker before rendering, so no request escapes it. */
export function ApiMocking({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(!isApiMockingEnabled);
  const handleReady = useCallback(() => setReady(true), []);

  if (!isApiMockingEnabled) return children;

  return (
    <>
      <MockWorker onReady={handleReady} />
      {ready && children}
      <div className="fixed bottom-4 left-4 rounded bg-amber-400 px-2 py-1 font-mono text-xs font-bold text-black">
        MOCK
      </div>
    </>
  );
}

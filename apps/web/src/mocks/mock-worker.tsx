"use client";

import { useEffect } from "react";
import { worker } from "./browser";

/**
 * Starts the MSW service worker. Loaded only in the browser (see api-mocking.tsx)
 * because `msw/browser` cannot be resolved during server rendering.
 */
export default function MockWorker({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    void worker.start({ onUnhandledFrame: "bypass" }).then(onReady);
  }, [onReady]);

  return null;
}

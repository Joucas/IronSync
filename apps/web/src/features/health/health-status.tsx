"use client";

import { useHealth } from "./use-health";

// Step-0 diagnostics, replaced by the dashboard later. The text is not
// translated yet because the i18n layer is the first task of roadmap step 1.
export function HealthStatus() {
  const health = useHealth();

  if (health.isPending) {
    return (
      <p className="mt-6" role="status">
        Checking API…
      </p>
    );
  }

  if (health.isError) {
    return (
      <p className="mt-6 text-red-600" role="alert">
        API unavailable: {health.error.message}
      </p>
    );
  }

  const { status, database, timestamp } = health.data;

  return (
    <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-sm">
      <dt>status</dt>
      <dd>{status}</dd>
      <dt>database</dt>
      <dd>{database}</dd>
      <dt>timestamp</dt>
      <dd>{timestamp}</dd>
    </dl>
  );
}

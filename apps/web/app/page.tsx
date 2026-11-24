import { HealthStatus } from "@/src/features/health/health-status";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-semibold">IronSync</h1>
      <HealthStatus />
    </main>
  );
}

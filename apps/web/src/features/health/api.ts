import { api } from "@/src/services/api";

export type Health = {
  status: "ok";
  database: "up";
  timestamp: string;
};

export async function getHealth(): Promise<Health> {
  const { data } = await api.get<Health>("/health");
  return data;
}

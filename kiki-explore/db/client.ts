import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  return url;
}

let client: ReturnType<typeof postgres> | undefined;

export function getDb() {
  if (!client) {
    client = postgres(getDatabaseUrl(), { max: 1 });
  }
  return drizzle(client, { schema });
}

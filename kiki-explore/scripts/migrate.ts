import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const sql = postgres(databaseUrl, { max: 1 });
  const migrationsDir = path.join(process.cwd(), "db/migrations");
  const files = readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    id text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`;

  for (const file of files) {
    const id = file.replace(/\.sql$/, "");
    const applied = await sql<{ id: string }[]>`
      SELECT id FROM schema_migrations WHERE id = ${id}
    `;
    if (applied.length > 0) {
      continue;
    }

    const contents = readFileSync(path.join(migrationsDir, file), "utf8");
    const statements = contents
      .split(/--> statement-breakpoint\n?/)
      .map((part) => part.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await sql.unsafe(statement);
    }

    await sql`INSERT INTO schema_migrations (id) VALUES (${id})`;
    console.log(`Applied ${file}`);
  }

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

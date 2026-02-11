import { defineConfig } from "drizzle-kit";
import { parse } from "pg-connection-string";

import env from "./server/lib/env";

const dbUrl = env.DATABASE_URL!;
const parsed = parse(dbUrl);

export default defineConfig({
  out: "./server/db/migrations",
  schema: "./server/db/schema/index.ts",
  casing: "snake_case",
  dialect: "postgresql",
  dbCredentials: {
    host: parsed.host!,
    port: parsed.port ? Number.parseInt(parsed.port, 10) : 5432,
    user: parsed.user!,
    password: parsed.password!,
    database: parsed.database!,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
});

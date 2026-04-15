import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  out: "./drizzle",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgres://giggi:giggi@127.0.0.1:5432/giggi"
  }
});


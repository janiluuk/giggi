import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool =
  globalThis.pgPool ??
  new Pool({
    connectionString,
  });

if (process.env.NODE_ENV !== "production") globalThis.pgPool = pool;

export const prisma: PrismaClient =
  globalThis.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;


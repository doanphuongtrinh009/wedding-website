import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(
  databaseUrl && databaseUrl !== "undefined"
);

const prismaClientSingleton =
  global.prisma ||
  (isDatabaseConfigured
    ? new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "warn", "error"]
            : ["error"]
      })
    : undefined);

export const prisma =
  prismaClientSingleton ||
  new Proxy({} as PrismaClient, {
    get() {
      throw new Error("DATABASE_URL is not configured.");
    }
  });

if (process.env.NODE_ENV !== "production" && prismaClientSingleton) {
  global.prisma = prismaClientSingleton;
}

import { neon } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

// Get connection string
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create Prisma client - PrismaNeon adapter handles the neon connection internally
const CLIENT = new PrismaClient({
  adapter: new PrismaNeon({
    connectionString: connectionString,
  } as any),
});

export const prisma = CLIENT;

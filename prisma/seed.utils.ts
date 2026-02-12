import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/prisma/generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

/** Prisma client instance used for the seed operations. */
export const prisma = new PrismaClient({ adapter });

export const SEED_RECORDS = {
  USER: 10,
  LOCATION: 4,
  SERVICE: 8,
  BOOKING: 20
};

import { PrismaClient } from "@prisma/client";

/** Prisma client instance used for the seed operations. */
export const prisma = new PrismaClient();

export const SEED_RECORDS = {
  USER: 10,
  LOCATION: 4,
  SERVICE: 8,
  BOOKING: 20
};

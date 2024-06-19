import {PrismaClient} from "@prisma/client";

import {seedBookings} from "./seed/booking.seed";
import {seedLocations} from "./seed/location.seed";
import {seedServices} from "./seed/service.seed";
import {seedUsers} from "./seed/user.seed";

const prisma = new PrismaClient();

async function seed() {
  await seedUsers(prisma);
  await seedLocations(prisma);
  await seedServices(prisma);
  await seedBookings(prisma);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

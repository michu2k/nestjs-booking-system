import { prisma } from "./seed.utils";
import { seedBookings } from "./seed/booking.seed";
import { seedLocations } from "./seed/location.seed";
import { seedServices } from "./seed/service.seed";
import { seedServiceSchedules } from "./seed/service-schedule.seed";
import { seedUsers } from "./seed/user.seed";

async function seed() {
  console.time("Seeding database");

  await seedUsers();
  await seedLocations();
  await seedServices();
  await seedServiceSchedules();
  await seedBookings();

  console.timeEnd("Seeding database");
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

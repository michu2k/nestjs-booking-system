import {faker} from "@faker-js/faker";
import {type Prisma, PrismaClient} from "@prisma/client";

import {SEED_RECORDS} from "../seed.utils";

function createLocation(): Prisma.LocationCreateManyInput {
  return {
    city: faker.location.city(),
    address: faker.location.streetAddress(),
    country: faker.location.country(),
    lat: faker.location.latitude(),
    lng: faker.location.longitude()
  };
}

export async function seedLocations(prisma: PrismaClient) {
  console.log("Seeding locations...");

  await prisma.location.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Location_id_seq" RESTART WITH 1;`;

  const records = faker.helpers.multiple(() => createLocation(), {count: SEED_RECORDS.LOCATION});

  await prisma.location.createMany({data: records});

  console.log(`${SEED_RECORDS.LOCATION} locations have been created.`);
}

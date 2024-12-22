import {faker} from "@faker-js/faker";
import {type Prisma, PrismaClient} from "@prisma/client";

import {SEED_RECORDS} from "../seed.utils";

function createService(): Prisma.ServiceCreateManyInput {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({min: 19, max: 79}),
    locationId: faker.number.int({min: 1, max: SEED_RECORDS.LOCATION})
  };
}

export async function seedServices(prisma: PrismaClient) {
  console.log("Seeding services...");

  await prisma.service.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Service_id_seq" RESTART WITH 1;`;

  const records = faker.helpers.multiple(() => createService(), {count: SEED_RECORDS.SERVICE});

  await prisma.service.createMany({data: records});

  console.log(`${SEED_RECORDS.SERVICE} services have been created.`);
}

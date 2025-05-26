import { faker } from "@faker-js/faker";
import { type Prisma, PrismaClient, UserRole } from "@prisma/client";

import { SEED_RECORDS } from "../seed.utils";

function createUser(role: UserRole): Prisma.UserCreateInput {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    role,
    accounts: {
      create: {
        provider: "google",
        providerAccountId: faker.string.uuid()
      }
    }
  };
}

export async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  await prisma.account.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Account_id_seq" RESTART WITH 1;`;

  await prisma.user.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;

  const adminCount = Math.round(SEED_RECORDS.USER / 5);
  const managerCount = Math.round(SEED_RECORDS.USER / 3);
  const userCount = SEED_RECORDS.USER - adminCount - managerCount;

  const admins = faker.helpers.multiple(() => createUser(UserRole.ADMIN), { count: adminCount });
  const managers = faker.helpers.multiple(() => createUser(UserRole.MANAGER), { count: managerCount });
  const users = faker.helpers.multiple(() => createUser(UserRole.USER), { count: userCount });
  const createdUsers = [...admins, ...managers, ...users];

  await Promise.all(createdUsers.map(async (data) => await prisma.user.create({ data })));

  console.log(`${SEED_RECORDS.SERVICE} users have been created.`);
}

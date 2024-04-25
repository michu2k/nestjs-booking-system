import {PrismaClient, type Prisma, UserRole} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {SEED_RECORDS} from "../seed.utils";

function createUser(role: UserRole): Prisma.UserCreateInput {
  // TODO: Password should be hashed
  const password = faker.helpers.arrayElement([null, "test"]);

  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    password,
    role,
    accounts: {
      create: {
        provider: !!password ? "password" : "google",
        providerAccountId: !!password ? "password" : faker.string.uuid()
      }
    }
  };
}

async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  await prisma.account.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Account_id_seq" RESTART WITH 1;`;

  await prisma.user.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;

  const adminCount = Math.round(SEED_RECORDS.USER / 5);
  const managerCount = Math.round(SEED_RECORDS.USER / 3);
  const userCount = SEED_RECORDS.USER - adminCount - managerCount;

  const admins = faker.helpers.multiple(() => createUser(UserRole.ADMIN), {count: adminCount});
  const managers = faker.helpers.multiple(() => createUser(UserRole.MANAGER), {count: managerCount});
  const users = faker.helpers.multiple(() => createUser(UserRole.USER), {count: userCount});

  const createdUsers = [...admins, ...managers, ...users].map(async (data) => await prisma.user.create({data}));

  await Promise.all(createdUsers);
}

export {seedUsers};

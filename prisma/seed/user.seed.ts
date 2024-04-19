import {PrismaClient, type Prisma, UserRole} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {SEED_RECORDS} from "../seed.utils";

function createUser(role: UserRole): Prisma.UserCreateManyInput {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    // FIXME: Password should be hashed
    phone: faker.phone.number(),
    password: faker.internet.password(),
    role
  };
}

async function seedUsers(prisma: PrismaClient) {
  console.log("Seeding users...");

  await prisma.user.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;

  const admins = faker.helpers.multiple(() => createUser(UserRole.ADMIN), {count: SEED_RECORDS.ADMIN});
  const managers = faker.helpers.multiple(() => createUser(UserRole.MANAGER), {count: SEED_RECORDS.MANAGER});
  const users = faker.helpers.multiple(() => createUser(UserRole.USER), {count: SEED_RECORDS.USER});

  await prisma.user.createMany({data: [...admins, ...managers, ...users], skipDuplicates: true});
}

export {seedUsers};

import {BookingStatus, PrismaClient, type Prisma} from "@prisma/client";
import {faker} from "@faker-js/faker";
import {SEED_RECORDS} from "../seed.utils";

function createBooking(): Prisma.BookingCreateManyInput {
  return {
    from: faker.date.recent(),
    to: faker.date.soon(),
    createdAt: faker.date.recent(),
    serviceId: faker.number.int({min: 1, max: SEED_RECORDS.SERVICE}),
    userId: faker.number.int({min: 1, max: SEED_RECORDS.ADMIN + SEED_RECORDS.MANAGER + SEED_RECORDS.USER}),
    status: faker.helpers.enumValue(BookingStatus)
  };
}

async function seedBookings(prisma: PrismaClient) {
  console.log("Seeding bookings...");

  await prisma.booking.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "Booking_id_seq" RESTART WITH 1;`;

  const records = faker.helpers.multiple(() => createBooking(), {count: SEED_RECORDS.BOOKING});

  await prisma.booking.createMany({data: records});
}

export {seedBookings};

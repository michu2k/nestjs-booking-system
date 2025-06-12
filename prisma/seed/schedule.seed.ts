import { faker } from "@faker-js/faker";
import { type Prisma } from "@prisma/client";

import { prisma } from "../seed.utils";

function getServiceTimeSlot() {
  const startHour = faker.number.int({ min: 6, max: 10 }); // e.g. 6 AM to 10 AM
  const startMinutes = faker.helpers.arrayElement([0, 15, 30, 45]);
  const availabilitySlot = faker.number.int({ min: 6, max: 8 });

  const startDate = new Date();
  startDate.setHours(startHour, startMinutes, 0, 0);

  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + availabilitySlot);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  return {
    startTime: dateFormatter.format(startDate),
    endTime: dateFormatter.format(endDate)
  };
}

function createSchedule(day: number, serviceId: number): Prisma.ServiceScheduleCreateManyInput {
  // For even services, set Sunday as a day off
  const isSunday = day === 6;

  if (isSunday && serviceId % 2 === 0) {
    return {
      day,
      serviceId,
      startTime: null,
      endTime: null
    };
  }

  const { startTime, endTime } = getServiceTimeSlot();

  return {
    day,
    serviceId,
    startTime,
    endTime
  };
}

export async function seedSchedules() {
  console.log("Seeding service schedules...");

  const DAYS_IN_WEEK = 7;

  await prisma.serviceSchedule.deleteMany();
  await prisma.$queryRaw`ALTER SEQUENCE "ServiceSchedule_id_seq" RESTART WITH 1;`;

  const services = await prisma.service.findMany({ select: { id: true }, orderBy: { id: "asc" } });

  for (const service of services) {
    const records = faker.helpers.multiple((_, index) => createSchedule(index, service.id), {
      count: DAYS_IN_WEEK
    });

    await prisma.serviceSchedule.createMany({ data: records });

    console.log(`Service id ${service.id}: ${records.length} service schedules have been created.`);
  }
}

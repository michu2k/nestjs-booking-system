import { ServiceSchedule } from "@prisma/client";

import { UpdateScheduleDto } from "./schedule.dto";

export const mockSchedule: ServiceSchedule = {
  id: 1,
  day: 0,
  startTime: "08:00",
  endTime: "16:00",
  serviceId: 1
};

export const mockUpdateSchedule: UpdateScheduleDto = {
  startTime: "09:00"
};

import { Service, ServiceSchedule, ServiceStatus } from "@prisma/client";
import { mockSchedule } from "src/schedule/schedule.mocks";

import { CreateServiceDto, UpdateServiceDto } from "./service.dto";

export const mockService: Service = {
  id: 1,
  name: "Lorem Ipsum",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  price: 27,
  createdAt: new Date(),
  updatedAt: new Date(),
  status: ServiceStatus.ACTIVE,
  locationId: 1
};

export const mockCreateService: CreateServiceDto & { ServiceSchedule: Array<ServiceSchedule> } = {
  name: "Service name",
  description: "Service description",
  price: 19,
  status: ServiceStatus.ACTIVE,
  locationId: 1,
  ServiceSchedule: [mockSchedule, mockSchedule]
};

export const mockUpdateService: UpdateServiceDto = {
  description: "Updated description"
};

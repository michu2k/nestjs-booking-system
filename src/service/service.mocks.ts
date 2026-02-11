import { ServiceSchedule, ServiceStatus } from "../prisma/generated/client";
import { mockSchedule } from "../schedule/schedule.mocks";
import { CreateServiceDto, ServiceEntity, UpdateServiceDto } from "./service.dto";

export const mockService: ServiceEntity = {
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

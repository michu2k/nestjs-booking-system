import { Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { ScheduleService } from "../schedule/schedule.service";
import { CreateServiceDto, UpdateServiceDto } from "./service.dto";

@Injectable()
export class ServiceService {
  constructor(
    private prisma: PrismaService,
    private scheduleService: ScheduleService
  ) {}

  async findAllServices(limit?: number, offset?: number) {
    return this.prisma.service.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneService(id: number) {
    return this.prisma.service.findUnique({
      where: { id }
    });
  }

  async createService(data: CreateServiceDto) {
    return this.prisma.$transaction(async (tx) => {
      const service = await tx.service.create({ data });
      const schedule = await this.scheduleService.createScheduleForService(service.id, tx);

      return { ...service, ServiceSchedule: schedule };
    });
  }

  async updateService(id: number, data: UpdateServiceDto) {
    return this.prisma.service.update({
      where: { id },
      data
    });
  }

  async deleteService(id: number) {
    return this.prisma.service.delete({
      where: { id },
      select: { id: true }
    });
  }
}

import { Injectable } from "@nestjs/common";

import { Prisma } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateScheduleDto, UpdateScheduleDto } from "./schedule.dto";

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  private buildScheduleData(serviceId: number) {
    return new Array(7).fill(null).map(
      (_, index): CreateScheduleDto => ({
        day: index,
        startTime: null,
        endTime: null,
        serviceId
      })
    );
  }

  async findSchedule(where: Prisma.ServiceScheduleWhereInput) {
    return this.prisma.serviceSchedule.findMany({
      where
    });
  }

  async createSchedule(serviceId: number, tx?: Prisma.TransactionClient) {
    return (tx ?? this.prisma).serviceSchedule.createManyAndReturn({
      data: this.buildScheduleData(serviceId)
    });
  }

  async updateSchedule(id: number, data: UpdateScheduleDto) {
    return this.prisma.serviceSchedule.update({
      where: { id },
      data
    });
  }
}

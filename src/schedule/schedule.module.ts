import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";

@Module({
  imports: [PrismaModule],
  providers: [ScheduleService],
  controllers: [ScheduleController],
  exports: [ScheduleService]
})
export class ScheduleModule {}

import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { ScheduleService } from "../schedule/schedule.service";
import { ServiceController } from "./service.controller";
import { ServiceService } from "./service.service";

@Module({
  imports: [PrismaModule],
  providers: [ServiceService, ScheduleService],
  controllers: [ServiceController],
  exports: [ServiceService]
})
export class ServiceModule {}

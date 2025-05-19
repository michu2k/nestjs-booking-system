import { Module } from "@nestjs/common";

import { PrismaModule } from "../prisma/prisma.module";
import { BookingController } from "./booking.controller";
import { BookingService } from "./booking.service";

@Module({
  imports: [PrismaModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}

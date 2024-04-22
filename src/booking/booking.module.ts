import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {ServiceModule} from "../service/service.module";
import {BookingService} from "./booking.service";
import {BookingController} from "./booking.controller";

@Module({
  imports: [PrismaModule, ServiceModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}

import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {LocationService} from "./location.service";
import {LocationController} from "./location.controller";

@Module({
  imports: [PrismaModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService]
})
export class LocationModule {}

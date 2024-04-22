import {Module} from "@nestjs/common";
import {LocationService} from "./location.service";
import {LocationController} from "./location.controller";
import {PrismaModule} from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService]
})
export class LocationModule {}

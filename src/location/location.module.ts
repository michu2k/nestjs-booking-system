import {Module} from "@nestjs/common";

import {PrismaModule} from "../prisma/prisma.module";
import {LocationController} from "./location.controller";
import {LocationService} from "./location.service";

@Module({
  imports: [PrismaModule],
  providers: [LocationService],
  controllers: [LocationController],
  exports: [LocationService]
})
export class LocationModule {}

import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {LocationModule} from "../location/location.module";
import {ServiceController} from "./service.controller";
import {ServiceService} from "./service.service";

@Module({
  imports: [PrismaModule, LocationModule],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService]
})
export class ServiceModule {}

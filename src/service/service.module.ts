import {Module} from "@nestjs/common";
import {ServiceService} from "./service.service";
import {ServiceController} from "./service.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {LocationModule} from "../location/location.module";

@Module({
  imports: [PrismaModule, LocationModule],
  controllers: [ServiceController],
  providers: [ServiceService]
})
export class ServiceModule {}

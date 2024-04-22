import {Module} from "@nestjs/common";
import {PrismaModule} from "./prisma/prisma.module";
import {ServiceModule} from "./service/service.module";
import {LocationModule} from "./location/location.module";

@Module({
  imports: [LocationModule, ServiceModule, PrismaModule],
  controllers: [],
  providers: []
})
export class AppModule {}

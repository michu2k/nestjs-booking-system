import {Module} from "@nestjs/common";
import {PrismaModule} from "./prisma/prisma.module";
import {LocationModule} from "./location/location.module";

@Module({
  imports: [LocationModule, PrismaModule],
  controllers: [],
  providers: []
})
export class AppModule {}

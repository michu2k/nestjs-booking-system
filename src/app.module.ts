import {Module} from "@nestjs/common";
import {PrismaModule} from "./prisma/prisma.module";
import {ServiceModule} from "./service/service.module";

@Module({
  imports: [PrismaModule, ServiceModule]
})
export class AppModule {}

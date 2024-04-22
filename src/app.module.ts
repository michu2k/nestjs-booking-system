import {Module} from "@nestjs/common";
import {TestModule} from "./test/test.module";
import {PrismaService} from "./prisma/prisma.service";
import {ServiceService} from "./service/service.service";

@Module({
  imports: [TestModule],
  controllers: [],
  providers: [PrismaService, ServiceService]
})
export class AppModule {}

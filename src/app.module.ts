import {Module} from "@nestjs/common";
import {TestModule} from "./test/test.module";
import {PrismaService} from "./prisma/prisma.service";

@Module({
  imports: [TestModule],
  controllers: [],
  providers: [PrismaService]
})
export class AppModule {}

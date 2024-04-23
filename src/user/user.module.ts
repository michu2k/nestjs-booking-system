import {Module} from "@nestjs/common";
import {PrismaModule} from "../prisma/prisma.module";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";

@Module({
  imports: [PrismaModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}

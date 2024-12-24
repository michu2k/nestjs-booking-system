import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";

import {PrismaModule} from "../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {GoogleStrategy} from "./strategies/google.strategy";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {JwtRefreshStrategy} from "./strategies/jwt-refresh.strategy";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get("JWT_SECRET")
      })
    })
  ],
  providers: [AuthService, GoogleStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

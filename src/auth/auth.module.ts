import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {PrismaModule} from "../prisma/prisma.module";
import {UserModule} from "../user/user.module";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {GoogleStrategy} from "./strategies/google.strategy";

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get("JWT_SECRET"),
        signOptions: {expiresIn: configService.get("ACCESS_TOKEN_VALIDITY")}
      }),
      inject: [ConfigService]
    })
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}

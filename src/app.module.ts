import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { BookingModule } from "./booking/booking.module";
import { validateEnvs } from "./env.validation";
import { LocationModule } from "./location/location.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { ServiceModule } from "./service/service.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvs,
      envFilePath: [".env", ".env.development", ".env.production"]
    }),
    AuthModule,
    UserModule,
    LocationModule,
    ServiceModule,
    ScheduleModule,
    PrismaModule,
    BookingModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";

import { AuthModule } from "./auth/auth.module";
import { BookingModule } from "./booking/booking.module";
import { validateEnvs } from "./env.validation";
import { ServiceErrorFilter } from "./filters/service-error.filter";
import { HealthModule } from "./health/health.module";
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
    HealthModule,
    AuthModule,
    UserModule,
    LocationModule,
    ServiceModule,
    ScheduleModule,
    PrismaModule,
    BookingModule
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: ServiceErrorFilter }]
})
export class AppModule {}

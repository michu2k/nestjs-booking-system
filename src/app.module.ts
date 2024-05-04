import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "./prisma/prisma.module";
import {ServiceModule} from "./service/service.module";
import {LocationModule} from "./location/location.module";
import {BookingModule} from "./booking/booking.module";
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {validateEnvs} from "./env.validation";

@Module({
  imports: [
    ConfigModule.forRoot({validate: validateEnvs}),
    AuthModule,
    UserModule,
    LocationModule,
    ServiceModule,
    PrismaModule,
    BookingModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

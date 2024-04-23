import {Module} from "@nestjs/common";
import {PrismaModule} from "./prisma/prisma.module";
import {ServiceModule} from "./service/service.module";
import {LocationModule} from "./location/location.module";
import {BookingModule} from "./booking/booking.module";
import {UserModule} from "./user/user.module";

@Module({
  imports: [LocationModule, ServiceModule, PrismaModule, BookingModule, UserModule],
  controllers: [],
  providers: []
})
export class AppModule {}

import {BookingStatus} from "@prisma/client";

import {BookingEntity} from "./booking.dto";

export const mockBooking: BookingEntity = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  from: new Date(),
  to: new Date(),
  status: BookingStatus.PENDING,
  userId: 1,
  serviceId: 1
};

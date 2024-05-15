import {Booking, BookingStatus} from "@prisma/client";

export const mockBooking: Booking = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  from: new Date(),
  to: new Date(),
  status: BookingStatus.PENDING,
  userId: 1,
  serviceId: 1
};

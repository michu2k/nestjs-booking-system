import { BookingStatus } from "@prisma/client";

import { BookingEntity, CreateBookingDto, UpdateBookingDto } from "./booking.dto";

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

export const mockCreateBooking: CreateBookingDto = {
  from: new Date(),
  to: new Date(),
  status: BookingStatus.PENDING,
  userId: 2,
  serviceId: 1
};

export const mockUpdateBooking: UpdateBookingDto = {
  status: BookingStatus.CANCELLED
};

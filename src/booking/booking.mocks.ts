import { BookingStatus } from "../prisma/generated/client";
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

const HOUR_MS = 60 * 60 * 1000;

export const mockCreateBooking: CreateBookingDto = {
  from: new Date(Date.now() + HOUR_MS),
  to: new Date(Date.now() + 2 * HOUR_MS),
  serviceId: 1
};

export const mockUpdateBooking: UpdateBookingDto = {
  from: new Date(),
  to: new Date(),
  status: BookingStatus.CANCELLED
};

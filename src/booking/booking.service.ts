import { Injectable } from "@nestjs/common";

import { BookingStatus, Prisma } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { ServiceError, ServiceErrorCode } from "../utils/service-error";
import { CreateBookingDto, UpdateBookingDto } from "./booking.dto";

// Statuses a booking must have in order to be cancelled
const ACTIVE_BOOKING_STATUSES: BookingStatus[] = [BookingStatus.PENDING, BookingStatus.CONFIRMED];

// Statuses a booking can transition to from its current status
const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
  CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  CANCELLED: [],
  EXPIRED: [],
  COMPLETED: []
};

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async findAllBookings(limit?: number, offset?: number, where?: Prisma.BookingWhereInput) {
    return this.prisma.booking.findMany({
      take: limit,
      skip: offset,
      where
    });
  }

  async findOneBooking(id: number, where?: Prisma.BookingWhereInput) {
    const booking = await this.prisma.booking.findUnique({
      where: { ...where, id }
    });

    if (!booking) {
      throw new ServiceError(ServiceErrorCode.NOT_FOUND, "Booking not found.");
    }

    return booking;
  }

  async createBooking(data: CreateBookingDto, userId: number) {
    return this.prisma.booking.create({
      data: { ...data, userId, status: BookingStatus.PENDING }
    });
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.findOneBooking(id, { userId });

    if (!ACTIVE_BOOKING_STATUSES.includes(booking.status)) {
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, "This booking can no longer be cancelled.");
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED }
    });
  }

  async updateBooking(id: number, data: UpdateBookingDto) {
    const booking = await this.findOneBooking(id);

    if (data.status && data.status !== booking.status && !STATUS_TRANSITIONS[booking.status].includes(data.status)) {
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, `Booking status cannot be changed to ${data.status}.`);
    }

    if (data.from || data.to) {
      const dateFrom = new Date(data.from ?? booking.from);
      const dateTo = new Date(data.to ?? booking.to);

      if (dateFrom <= new Date() || dateFrom >= dateTo) {
        throw new ServiceError(ServiceErrorCode.CONFLICT, "Invalid booking dates.");
      }
    }

    return this.prisma.booking.update({
      where: { id },
      data
    });
  }

  async deleteBooking(id: number) {
    return this.prisma.booking.delete({
      where: { id },
      select: {
        id: true
      }
    });
  }
}

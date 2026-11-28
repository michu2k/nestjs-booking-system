import { Injectable } from "@nestjs/common";

import { BookingStatus, Prisma } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { ServiceError, ServiceErrorCode } from "../utils/service-error";
import { STATUS_TIME_GUARDS, STATUS_TRANSITIONS } from "./booking.constants";
import { CreateBookingDto, UpdateBookingDto } from "./booking.dto";

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
    this.validateBookingDates(data.from, data.to);

    return this.prisma.booking.create({
      data: { ...data, userId, status: BookingStatus.PENDING }
    });
  }

  async cancelBooking(id: number, userId: number) {
    const booking = await this.findOneBooking(id, { userId });

    if (!STATUS_TRANSITIONS[booking.status].includes(BookingStatus.CANCELLED)) {
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, "This booking can no longer be cancelled.");
    }

    this.validateStatusTiming(BookingStatus.CANCELLED, booking.from, booking.to);

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED }
    });
  }

  async updateBooking(id: number, data: UpdateBookingDto) {
    const booking = await this.findOneBooking(id);

    const status = data.status;
    const from = data.from ?? booking.from;
    const to = data.to ?? booking.to;

    if (status && status !== booking.status) {
      if (!STATUS_TRANSITIONS[booking.status].includes(status)) {
        throw new ServiceError(ServiceErrorCode.BAD_REQUEST, `Booking status cannot be changed to ${status}.`);
      }

      this.validateStatusTiming(status, from, to);
    }

    if (data.from || data.to) {
      this.validateBookingDates(from, to);
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

  private validateBookingDates(from: Date, to: Date) {
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    if (dateFrom <= new Date() || dateFrom >= dateTo) {
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, "Invalid booking dates.");
    }
  }

  private validateStatusTiming(status: BookingStatus, from: Date, to: Date) {
    const isAllowed = STATUS_TIME_GUARDS[status];
    const dateFrom = new Date(from);
    const dateTo = new Date(to);

    if (isAllowed && !isAllowed({ from: dateFrom, to: dateTo }, new Date())) {
      throw new ServiceError(
        ServiceErrorCode.BAD_REQUEST,
        `Booking status cannot be changed to ${status} at this time.`
      );
    }
  }
}

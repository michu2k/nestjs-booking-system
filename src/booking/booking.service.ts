import {BadRequestException, Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";

import {PrismaService} from "../prisma/prisma.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";

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
    return this.prisma.booking.findUnique({
      where: {...where, id}
    });
  }

  async createBooking(data: CreateBookingDto) {
    return this.prisma.booking.create({
      data
    });
  }

  async updateBooking(id: number, data: UpdateBookingDto) {
    return this.prisma.booking
      .update({
        where: {id},
        data
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to update booking.");
      });
  }

  async deleteBooking(id: number) {
    return this.prisma.booking.delete({
      where: {id},
      select: {
        id: true
      }
    });
  }
}

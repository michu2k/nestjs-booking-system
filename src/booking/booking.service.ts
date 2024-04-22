import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async findAllBookings(limit?: number, offset?: number) {
    return this.prisma.booking.findMany({
      take: limit,
      skip: offset
    });
  }

  async findOneBooking(id: number) {
    return this.prisma.booking
      .findUniqueOrThrow({
        where: {id}
      })
      .catch(() => {
        throw new NotFoundException("Booking not found.");
      });
  }

  async createBooking(data: CreateBookingDto) {
    return this.prisma.booking
      .create({
        data
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to create booking.");
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
    return this.prisma.booking
      .delete({
        where: {id}
      })
      .catch((e) => {
        console.error(e.message);
        throw new BadRequestException("Failed to delete booking.");
      });
  }
}

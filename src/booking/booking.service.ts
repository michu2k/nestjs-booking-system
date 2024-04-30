import {BadRequestException, Injectable} from "@nestjs/common";
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
    return this.prisma.booking.findUnique({
      where: {id}
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
      where: {id}
    });
  }
}

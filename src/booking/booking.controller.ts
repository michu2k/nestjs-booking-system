import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";

@Controller("booking")
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto = {}) {
    return this.bookingService.findAllBookings(limit, offset);
  }

  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const booking = await this.bookingService.findOneBooking(id);

    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }

    return booking;
  }

  @Post()
  async create(@Body() data: CreateBookingDto) {
    try {
      return await this.bookingService.createBooking(data);
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException("Failed to create booking.");
    }
  }

  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBookingDto) {
    try {
      return await this.bookingService.updateBooking(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update booking.");
    }
  }

  @Delete(":id")
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return await this.bookingService.deleteBooking(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete booking.");
    }
  }
}

import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {UserRole} from "@prisma/client";

import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {Roles} from "../decorators/roles.deorator";
import {User} from "../decorators/user.decorator";
import {DeleteEntityResponse} from "../dtos/response.dto";
import {RolesGuard} from "../guards/roles.guard";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {UserEntity} from "../user/user.dto";
import {getErrorMessage} from "../utils/getErrorMessage";
import {BookingEntity, CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {BookingService} from "./booking.service";

@ApiTags("Booking")
@Controller("booking")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get a list of user's bookings
   */
  @Get()
  async findAll(@User() user: UserEntity, @Query() {limit, offset}: FindAllEntitiesDto = {}) {
    const bookings = await this.bookingService.findAllBookings(limit, offset, {userId: user.id});
    return bookings.map((bookings) => new BookingEntity(bookings));
  }

  /**
   * Get a user's booking with the specified `id`
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    const booking = await this.bookingService.findOneBooking(id, {userId: user.id});

    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }

    return new BookingEntity(booking);
  }

  /**
   * Create a new booking
   */
  @Post()
  async create(@Body() data: CreateBookingDto) {
    try {
      return new BookingEntity(await this.bookingService.createBooking(data));
    } catch (e) {
      console.log(getErrorMessage(e));
      throw new BadRequestException("Failed to create booking.");
    }
  }

  /**
   * Update a booking with the specified `id`
   */
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBookingDto) {
    try {
      return new BookingEntity(await this.bookingService.updateBooking(id, data));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to update booking.");
    }
  }

  /**
   * Delete a booking with the specified `id`
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    try {
      return new DeleteEntityResponse(await this.bookingService.deleteBooking(id));
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new BadRequestException("Failed to delete booking.");
    }
  }
}

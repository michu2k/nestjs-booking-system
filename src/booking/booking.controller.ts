import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { Roles } from "../decorators/roles.decorator";
import { User } from "../decorators/user.decorator";
import { DeleteEntityResponse } from "../dtos/response.dto";
import { RolesGuard } from "../guards/roles.guard";
import { UserRole } from "../prisma/generated/client";
import { FindAllEntitiesDto } from "../prisma/prisma.dto";
import { UserEntity } from "../user/user.dto";
import { BookingEntity, CreateBookingDto, UpdateBookingDto } from "./booking.dto";
import { BookingService } from "./booking.service";

@ApiTags("Booking")
@Controller("booking")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get a list of current user's bookings
   */
  @Get()
  async findAll(@User() user: UserEntity, @Query() { limit, offset }: FindAllEntitiesDto = {}) {
    const bookings = await this.bookingService.findAllBookings(limit, offset, { userId: user.id });
    return bookings.map((bookings) => new BookingEntity(bookings));
  }

  /**
   * Get a user's booking with the specified id
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    return new BookingEntity(await this.bookingService.findOneBooking(id, { userId: user.id }));
  }

  /**
   * Create a new booking
   */
  @Post()
  async create(@Body() data: CreateBookingDto, @User() user: UserEntity) {
    return new BookingEntity(await this.bookingService.createBooking(data, user.id));
  }

  /**
   * Cancel a user's booking with the specified id
   */
  @Post(":id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity) {
    return new BookingEntity(await this.bookingService.cancelBooking(id, user.id));
  }

  /**
   * Update a booking with the specified id
   */
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBookingDto) {
    return new BookingEntity(await this.bookingService.updateBooking(id, data));
  }

  /**
   * Delete a booking with the specified id
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number) {
    return new DeleteEntityResponse(await this.bookingService.deleteBooking(id));
  }
}

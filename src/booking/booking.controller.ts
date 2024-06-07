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
import {ApiTags} from "@nestjs/swagger";
import {UserRole} from "@prisma/client";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {BookingService} from "./booking.service";
import {BookingEntity, CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {JwtAuthGuard} from "../auth/guards/jwt.guard";
import {User} from "../decorators/user.decorator";
import {UserEntity} from "../user/user.dto";
import {RolesGuard} from "../guards/roles.guard";
import {Roles} from "../decorators/roles.deorator";
import {DeleteEntityResponse} from "../dtos/response.dto";

@ApiTags("Booking")
@Controller("booking")
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private bookingService: BookingService) {}

  /**
   * Get a list of user's bookings
   */
  @Get()
  findAll(@User() user: UserEntity, @Query() {limit, offset}: FindAllEntitiesDto = {}): Promise<Array<BookingEntity>> {
    return this.bookingService.findAllBookings(limit, offset, {userId: user.id});
  }

  /**
   * Get a user's booking with the specified `id`
   */
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number, @User() user: UserEntity): Promise<BookingEntity> {
    const booking = await this.bookingService.findOneBooking(id, {userId: user.id});

    if (!booking) {
      throw new NotFoundException("Booking not found.");
    }

    return booking;
  }

  /**
   * Create a new booking
   */
  @Post()
  async create(@Body() data: CreateBookingDto): Promise<BookingEntity> {
    try {
      return await this.bookingService.createBooking(data);
    } catch (e) {
      console.log(e.message);
      throw new BadRequestException("Failed to create booking.");
    }
  }

  /**
   * Update a booking with the specified `id`
   */
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBookingDto): Promise<BookingEntity> {
    try {
      return await this.bookingService.updateBooking(id, data);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to update booking.");
    }
  }

  /**
   * Delete a booking with the specified `id`
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param("id", ParseIntPipe) id: number): Promise<DeleteEntityResponse> {
    try {
      return await this.bookingService.deleteBooking(id);
    } catch (e) {
      console.error(e.message);
      throw new BadRequestException("Failed to delete booking.");
    }
  }
}

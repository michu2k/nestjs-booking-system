import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from "@nestjs/common";
import {FindAllEntitiesDto} from "../prisma/prisma.dto";
import {ServiceService} from "../service/service.service";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";

@Controller("booking")
export class BookingController {
  constructor(
    private bookingService: BookingService,
    private serviceService: ServiceService
  ) {}

  @Get()
  findAll(@Query() {limit, offset}: FindAllEntitiesDto) {
    return this.bookingService.findAllBookings(limit, offset);
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.findOneBooking(id);
  }

  @Post()
  async create(@Body() {serviceId, userId, ...data}: CreateBookingDto) {
    await this.serviceService.findOneService(serviceId);
    // TODO: check for user id
    // await this.userService.findOneUser(userId);
    return this.bookingService.createBooking({serviceId, userId, ...data});
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, data);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.bookingService.deleteBooking(id);
  }
}

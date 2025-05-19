import { Test } from "@nestjs/testing";
import { BookingStatus } from "@prisma/client";

import { PrismaService } from "../prisma/prisma.service";
import { CreateBookingDto, UpdateBookingDto } from "./booking.dto";
import { mockBooking } from "./booking.mocks";
import { BookingService } from "./booking.service";

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookingService, PrismaService]
    }).compile();

    service = moduleRef.get(BookingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllBookings", () => {
    let findAllBookingsSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllBookingsSpy = jest
        .spyOn(service, "findAllBookings")
        .mockResolvedValue([mockBooking, mockBooking, mockBooking]);
    });

    it("should get all bookings", async () => {
      const result = await service.findAllBookings();

      expect(findAllBookingsSpy).toHaveBeenCalled();
      expect(result).toEqual([mockBooking, mockBooking, mockBooking]);
    });

    it("should get bookings with the specified limit", async () => {
      const limit = 2;

      await service.findAllBookings(limit);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(limit);
    });

    it("should get bookings with the specified offset", async () => {
      const offset = 2;

      await service.findAllBookings(undefined, offset);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(undefined, offset);
    });
  });

  describe("findOneBooking", () => {
    it("should get a booking", async () => {
      const findOneBookingSpy = jest.spyOn(service, "findOneBooking").mockResolvedValue(mockBooking);
      const result = await service.findOneBooking(mockBooking.id);

      expect(findOneBookingSpy).toHaveBeenCalledWith(mockBooking.id);
      expect(result).toEqual(mockBooking);
    });
  });

  describe("createBooking", () => {
    it("should create a booking", async () => {
      const createBookingDto: CreateBookingDto = {
        from: new Date(),
        to: new Date(),
        status: BookingStatus.PENDING,
        userId: 2,
        serviceId: 1
      };
      const mockCreatedBooking = { ...mockBooking, ...createBookingDto };
      const createBookingSpy = jest.spyOn(service, "createBooking").mockResolvedValue(mockCreatedBooking);
      const result = await service.createBooking(createBookingDto);

      expect(createBookingSpy).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(mockCreatedBooking);
    });
  });

  describe("updateBooking", () => {
    it("should update a booking", async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED
      };
      const mockUpdatedBooking = { ...mockBooking, ...updateBookingDto };
      const updateBookingSpy = jest.spyOn(service, "updateBooking").mockResolvedValue(mockUpdatedBooking);
      const result = await service.updateBooking(mockBooking.id, updateBookingDto);

      expect(updateBookingSpy).toHaveBeenCalledWith(mockBooking.id, updateBookingDto);
      expect(result).toEqual(mockUpdatedBooking);
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking", async () => {
      const deleteBookingSpy = jest.spyOn(service, "deleteBooking").mockResolvedValue(mockBooking);
      const result = await service.deleteBooking(mockBooking.id);

      expect(deleteBookingSpy).toHaveBeenCalledWith(mockBooking.id);
      expect(result).toEqual(mockBooking);
    });
  });
});

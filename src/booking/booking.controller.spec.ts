import { Test } from "@nestjs/testing";

import { DeleteEntityResponse } from "../dtos/response.dto";
import { BookingStatus } from "../prisma/generated/client";
import { mockUser } from "../user/user.mocks";
import { BookingController } from "./booking.controller";
import { mockBooking, mockCreateBooking, mockUpdateBooking } from "./booking.mocks";
import { BookingService } from "./booking.service";

describe("BookingController", () => {
  let controller: BookingController;
  let bookingService: BookingService;

  const mockBookingService = {
    findAllBookings: jest.fn().mockResolvedValue([mockBooking, mockBooking]),
    findOneBooking: jest.fn().mockResolvedValue(mockBooking),
    createBooking: jest.fn((data) => Promise.resolve({ ...mockBooking, ...data })),
    updateBooking: jest.fn((_, data) => Promise.resolve({ ...mockBooking, ...data })),
    cancelBooking: jest.fn().mockResolvedValue({ ...mockBooking, status: BookingStatus.CANCELLED }),
    deleteBooking: jest.fn().mockResolvedValue({ id: mockBooking.id })
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService
        }
      ],
      controllers: [BookingController]
    }).compile();

    controller = moduleRef.get(BookingController);
    bookingService = moduleRef.get(BookingService);
  });

  describe("findAll", () => {
    it("should get a list of user's bookings", async () => {
      const result = await controller.findAll(mockUser);

      expect(bookingService.findAllBookings).toHaveBeenCalledWith(undefined, undefined, { userId: mockUser.id });
      expect(result).toEqual([mockBooking, mockBooking]);
    });
  });

  describe("findOne", () => {
    it("should get a booking", async () => {
      const result = await controller.findOne(mockBooking.id, mockUser);

      expect(bookingService.findOneBooking).toHaveBeenCalledWith(mockBooking.id, { userId: mockUser.id });
      expect(result).toEqual(mockBooking);
    });
  });

  describe("create", () => {
    it("should create a booking", async () => {
      const result = await controller.create(mockCreateBooking, mockUser);

      expect(bookingService.createBooking).toHaveBeenCalledWith(mockCreateBooking, mockUser.id);
      expect(result).toEqual({ ...mockBooking, ...mockCreateBooking });
    });
  });

  describe("cancel", () => {
    it("should cancel the logged-in user's booking", async () => {
      const result = await controller.cancel(mockBooking.id, mockUser);

      expect(bookingService.cancelBooking).toHaveBeenCalledWith(mockBooking.id, mockUser.id);
      expect(result).toEqual({ ...mockBooking, status: BookingStatus.CANCELLED });
    });
  });

  describe("update", () => {
    it("should update a booking", async () => {
      const result = await controller.update(mockBooking.id, mockUpdateBooking);

      expect(bookingService.updateBooking).toHaveBeenCalledWith(mockBooking.id, mockUpdateBooking);
      expect(result).toEqual({ ...mockBooking, ...mockUpdateBooking });
    });
  });

  describe("delete", () => {
    it("should delete a booking", async () => {
      const result = await controller.delete(mockBooking.id);

      expect(bookingService.deleteBooking).toHaveBeenCalledWith(mockBooking.id);
      expect(result).toBeInstanceOf(DeleteEntityResponse);
      expect(result).toEqual({ id: mockBooking.id });
    });
  });
});

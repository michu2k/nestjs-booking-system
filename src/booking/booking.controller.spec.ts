import { Test } from "@nestjs/testing";

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
    deleteBooking: jest.fn().mockResolvedValue(mockBooking)
  };

  beforeEach(async () => {
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

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("bookingService should be defined", () => {
    expect(bookingService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get a list of user's bookings", async () => {
      const result = await controller.findAll(mockUser);

      expect(bookingService.findAllBookings).toHaveBeenCalled();
      expect(result).toEqual([mockBooking, mockBooking]);
    });
  });

  describe("findOne", () => {
    it("should get a booking", async () => {
      const result = await controller.findOne(mockBooking.id, mockUser);

      expect(bookingService.findOneBooking).toHaveBeenCalled();
      expect(result).toEqual(mockBooking);
    });
  });

  describe("create", () => {
    it("should create a booking", async () => {
      const result = await controller.create(mockCreateBooking);

      expect(bookingService.createBooking).toHaveBeenCalled();
      expect(result).toEqual({ ...mockBooking, ...mockCreateBooking });
    });
  });

  describe("update", () => {
    it("should update a booking", async () => {
      const result = await controller.update(mockBooking.id, mockUpdateBooking);

      expect(bookingService.updateBooking).toHaveBeenCalled();
      expect(result).toEqual({ ...mockBooking, ...mockUpdateBooking });
    });
  });

  describe("delete", () => {
    it("should delete a booking", async () => {
      const result = await controller.delete(mockBooking.id);

      expect(bookingService.deleteBooking).toHaveBeenCalled();
      expect(result).toEqual(mockBooking);
    });
  });
});

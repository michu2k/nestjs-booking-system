import {Test, TestingModule} from "@nestjs/testing";
import {BookingStatus} from "@prisma/client";
import {BookingController} from "./booking.controller";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {mockBooking} from "./booking.mocks";
import {mockUser} from "../user/user.mocks";

describe("BookingController", () => {
  let controller: BookingController;
  let bookingService: BookingService;

  const mockBookingService = {
    findAllBookings: jest.fn().mockResolvedValue([mockBooking, mockBooking]),
    findOneBooking: jest.fn().mockResolvedValue(mockBooking),
    createBooking: jest.fn((data: CreateBookingDto) => Promise.resolve({...mockBooking, ...data})),
    updateBooking: jest.fn((_, data: UpdateBookingDto) => Promise.resolve({...mockBooking, ...data})),
    deleteBooking: jest.fn().mockResolvedValue(mockBooking)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BookingService,
          useValue: mockBookingService
        }
      ],
      controllers: [BookingController]
    }).compile();

    controller = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);
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
      const createBookingDto: CreateBookingDto = {
        from: new Date(),
        to: new Date(),
        status: BookingStatus.PENDING,
        userId: 2,
        serviceId: 1
      };
      const result = await controller.create(createBookingDto);

      expect(bookingService.createBooking).toHaveBeenCalled();
      expect(result).toEqual({...mockBooking, ...createBookingDto});
    });
  });

  describe("update", () => {
    it("should update a booking", async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED
      };
      const result = await controller.update(mockBooking.id, updateBookingDto);

      expect(bookingService.updateBooking).toHaveBeenCalled();
      expect(result).toEqual({...mockBooking, ...updateBookingDto});
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

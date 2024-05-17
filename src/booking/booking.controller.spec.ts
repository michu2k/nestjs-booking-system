import {Test, TestingModule} from "@nestjs/testing";
import {BookingStatus} from "@prisma/client";
import {BookingController} from "./booking.controller";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {mockBooking} from "./booking.mocks";

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

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("bookingService should be defined", () => {
    expect(bookingService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get all bookings", async () => {
      const booking = await controller.findAll();

      expect(bookingService.findAllBookings).toHaveBeenCalled();
      expect(booking).toEqual([mockBooking, mockBooking]);
    });
  });

  describe("findOne", () => {
    it("should get a booking", async () => {
      const booking = await controller.findOne(mockBooking.id);

      expect(bookingService.findOneBooking).toHaveBeenCalled();
      expect(booking).toEqual(mockBooking);
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

      const booking = await controller.create(createBookingDto);

      expect(bookingService.createBooking).toHaveBeenCalled();
      expect(booking).toEqual({...mockBooking, ...createBookingDto});
    });
  });

  describe("update", () => {
    it("should update a booking", async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED
      };

      const booking = await controller.update(mockBooking.id, updateBookingDto);

      expect(bookingService.updateBooking).toHaveBeenCalled();
      expect(booking).toEqual({...mockBooking, ...updateBookingDto});
    });
  });

  describe("delete", () => {
    it("should delete a booking", async () => {
      const booking = await controller.delete(mockBooking.id);

      expect(bookingService.deleteBooking).toHaveBeenCalled();
      expect(booking).toEqual(mockBooking);
    });
  });
});

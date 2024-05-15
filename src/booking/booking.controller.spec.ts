import {Test, TestingModule} from "@nestjs/testing";
import {Booking, BookingStatus} from "@prisma/client";
import {BookingController} from "./booking.controller";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {mockBooking} from "./booking.mocks";

describe("BookingController", () => {
  let bookingController: BookingController;
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

    bookingController = module.get<BookingController>(BookingController);
    bookingService = module.get<BookingService>(BookingService);

    jest.clearAllMocks();
  });

  it("bookingController should be defined", () => {
    expect(bookingController).toBeDefined();
  });

  it("bookingService should be defined", () => {
    expect(bookingService).toBeDefined();
  });

  describe("findAll", () => {
    let booking: Array<Booking>;

    beforeEach(async () => {
      booking = await bookingController.findAll();
    });

    it("should call findAllBookings method", () => {
      expect(bookingService.findAllBookings).toHaveBeenCalled();
    });

    it("should get all bookings", () => {
      expect(booking).toEqual([mockBooking, mockBooking]);
    });
  });

  describe("findOne", () => {
    let booking: Booking;

    beforeEach(async () => {
      booking = await bookingController.findOne(mockBooking.id);
    });

    it("should call findOneBooking method", () => {
      expect(bookingService.findOneBooking).toHaveBeenCalled();
    });

    it("should get a booking", () => {
      expect(booking).toEqual(mockBooking);
    });
  });

  describe("create", () => {
    let booking: Booking;
    const createBookingDto: CreateBookingDto = {
      from: new Date(),
      to: new Date(),
      status: BookingStatus.PENDING,
      userId: 2,
      serviceId: 1
    };

    beforeEach(async () => {
      booking = await bookingController.create(createBookingDto);
    });

    it("should call createBooking method", () => {
      expect(bookingService.createBooking).toHaveBeenCalled();
    });

    it("should create a booking", () => {
      expect(booking).toEqual({...mockBooking, ...createBookingDto});
    });
  });

  describe("update", () => {
    let booking: Booking;
    const updateBookingDto: UpdateBookingDto = {
      status: BookingStatus.CANCELLED
    };

    beforeEach(async () => {
      booking = await bookingController.update(mockBooking.id, updateBookingDto);
    });

    it("should call updateBooking method", () => {
      expect(bookingService.updateBooking).toHaveBeenCalled();
    });

    it("should update a booking", () => {
      expect(booking).toEqual({...mockBooking, ...updateBookingDto});
    });
  });

  describe("delete", () => {
    let booking: Booking;

    beforeEach(async () => {
      booking = await bookingController.delete(mockBooking.id);
    });

    it("should call deleteBooking method", () => {
      expect(bookingService.deleteBooking).toHaveBeenCalled();
    });

    it("should delete a booking", () => {
      expect(booking).toEqual(mockBooking);
    });
  });
});

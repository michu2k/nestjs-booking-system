import {Test, TestingModule} from "@nestjs/testing";
import {BookingStatus} from "@prisma/client";
import {PrismaModule} from "../prisma/prisma.module";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {mockBooking} from "./booking.mocks";

jest.useFakeTimers();

describe("BookingService", () => {
  let bookingService: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookingService]
    }).compile();

    bookingService = module.get<BookingService>(BookingService);
  });

  it("bookingService should be defined", () => {
    expect(bookingService).toBeDefined();
  });

  describe("findAllBookings", () => {
    let findAllBookingsSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllBookingsSpy = jest.spyOn(bookingService, "findAllBookings");
    });

    it("should get all bookings", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking(), mockBooking(), mockBooking()]);

      const bookings = await bookingService.findAllBookings();

      expect(findAllBookingsSpy).toHaveBeenCalled();
      expect(bookings).toEqual([mockBooking(), mockBooking(), mockBooking()]);
    });

    it("should get bookings with the specified limit", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking(), mockBooking()]);

      const limit = 2;
      const bookings = await bookingService.findAllBookings(limit);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(limit);
      expect(bookings).toEqual([mockBooking(), mockBooking()]);
    });

    it("should get bookings with the specified offset", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking()]);

      const offset = 2;
      const bookings = await bookingService.findAllBookings(undefined, offset);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(undefined, offset);
      expect(bookings).toEqual([mockBooking()]);
    });
  });

  describe("findOneBooking", () => {
    let findOneBookingSpy: jest.SpyInstance;

    beforeEach(() => {
      findOneBookingSpy = jest.spyOn(bookingService, "findOneBooking");
    });

    it("should get a booking", async () => {
      findOneBookingSpy.mockResolvedValue(mockBooking());

      const booking = await bookingService.findOneBooking(mockBooking().id);

      expect(findOneBookingSpy).toHaveBeenCalledWith(mockBooking().id);
      expect(booking).toEqual(mockBooking());
    });
  });

  describe("createBooking", () => {
    let createBookingSpy: jest.SpyInstance;

    beforeEach(() => {
      createBookingSpy = jest.spyOn(bookingService, "createBooking");
    });

    it("should create a booking", async () => {
      const createBookingDto: CreateBookingDto = {
        from: new Date(),
        to: new Date(),
        status: BookingStatus.PENDING,
        userId: 2,
        serviceId: 1
      };
      const createBookingResult = {...mockBooking(), ...createBookingDto};

      createBookingSpy.mockResolvedValue(createBookingResult);

      const booking = await bookingService.createBooking(createBookingDto);

      expect(createBookingSpy).toHaveBeenCalledWith(createBookingDto);
      expect(booking).toEqual(createBookingResult);
    });
  });

  describe("updateBooking", () => {
    let updateBookingSpy: jest.SpyInstance;

    beforeEach(() => {
      updateBookingSpy = jest.spyOn(bookingService, "updateBooking");
    });

    it("should update a booking", async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED
      };
      const createBookingResult = {...mockBooking(), ...updateBookingDto};

      updateBookingSpy.mockResolvedValue(createBookingResult);

      const booking = await bookingService.updateBooking(mockBooking().id, updateBookingDto);

      expect(updateBookingSpy).toHaveBeenCalledWith(mockBooking().id, updateBookingDto);
      expect(booking).toEqual(createBookingResult);
    });
  });

  describe("deleteBooking", () => {
    let deleteBookingSpy: jest.SpyInstance;

    beforeEach(() => {
      deleteBookingSpy = jest.spyOn(bookingService, "deleteBooking");
    });

    it("should delete a booking", async () => {
      deleteBookingSpy.mockResolvedValue(mockBooking());

      const booking = await bookingService.deleteBooking(mockBooking().id);

      expect(deleteBookingSpy).toHaveBeenCalledWith(mockBooking().id);
      expect(booking).toEqual(mockBooking());
    });
  });
});

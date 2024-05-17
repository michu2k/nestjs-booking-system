import {Test, TestingModule} from "@nestjs/testing";
import {BookingStatus} from "@prisma/client";
import {PrismaModule} from "../prisma/prisma.module";
import {BookingService} from "./booking.service";
import {CreateBookingDto, UpdateBookingDto} from "./booking.dto";
import {mockBooking} from "./booking.mocks";

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookingService]
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllBookings", () => {
    let findAllBookingsSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllBookingsSpy = jest.spyOn(service, "findAllBookings");
    });

    it("should get all bookings", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking, mockBooking, mockBooking]);

      const result = await service.findAllBookings();

      expect(findAllBookingsSpy).toHaveBeenCalled();
      expect(result).toEqual([mockBooking, mockBooking, mockBooking]);
    });

    it("should get bookings with the specified limit", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking, mockBooking]);

      const limit = 2;
      const result = await service.findAllBookings(limit);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(limit);
      expect(result).toEqual([mockBooking, mockBooking]);
    });

    it("should get bookings with the specified offset", async () => {
      findAllBookingsSpy.mockResolvedValue([mockBooking]);

      const offset = 2;
      const result = await service.findAllBookings(undefined, offset);

      expect(findAllBookingsSpy).toHaveBeenCalledWith(undefined, offset);
      expect(result).toEqual([mockBooking]);
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
      const createBookingResult = {...mockBooking, ...createBookingDto};

      const createBookingSpy = jest.spyOn(service, "createBooking").mockResolvedValue(createBookingResult);
      const result = await service.createBooking(createBookingDto);

      expect(createBookingSpy).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(createBookingResult);
    });
  });

  describe("updateBooking", () => {
    it("should update a booking", async () => {
      const updateBookingDto: UpdateBookingDto = {
        status: BookingStatus.CANCELLED
      };
      const createBookingResult = {...mockBooking, ...updateBookingDto};

      const updateBookingSpy = jest.spyOn(service, "updateBooking").mockResolvedValue(createBookingResult);
      const result = await service.updateBooking(mockBooking.id, updateBookingDto);

      expect(updateBookingSpy).toHaveBeenCalledWith(mockBooking.id, updateBookingDto);
      expect(result).toEqual(createBookingResult);
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

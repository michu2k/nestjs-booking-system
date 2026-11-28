import { Test } from "@nestjs/testing";

import { BookingStatus } from "../prisma/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { ServiceErrorCode } from "../utils/service-error";
import { mockBooking, mockCreateBooking } from "./booking.mocks";
import { BookingService } from "./booking.service";

describe("BookingService", () => {
  let service: BookingService;
  let prisma: typeof mockPrismaService;

  const mockPrismaService = {
    booking: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  };

  const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
    CONFIRMED: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
    CANCELLED: [],
    EXPIRED: [],
    COMPLETED: [],
    NO_SHOW: []
  };

  const hoursFromNow = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000);

  const upcomingBooking = { ...mockBooking, from: hoursFromNow(1), to: hoursFromNow(2) };
  const ongoingBooking = { ...mockBooking, from: hoursFromNow(-1), to: hoursFromNow(1) };
  const pastBooking = { ...mockBooking, from: hoursFromNow(-2), to: hoursFromNow(-1) };

  beforeEach(async () => {
    jest.resetAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [BookingService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile();

    service = moduleRef.get(BookingService);
    prisma = moduleRef.get(PrismaService) as unknown as typeof mockPrismaService;
  });

  describe("findAllBookings", () => {
    it("should get all bookings", async () => {
      prisma.booking.findMany.mockResolvedValue([mockBooking, mockBooking]);
      const result = await service.findAllBookings();

      expect(prisma.booking.findMany).toHaveBeenCalledWith({ take: undefined, skip: undefined, where: undefined });
      expect(result).toEqual([mockBooking, mockBooking]);
    });

    it("should get bookings with the specified limit", async () => {
      const limit = 2;
      await service.findAllBookings(limit);

      expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: limit }));
    });

    it("should get bookings with the specified offset", async () => {
      const offset = 2;
      await service.findAllBookings(undefined, offset);

      expect(prisma.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: undefined, skip: offset }));
    });
  });

  describe("findOneBooking", () => {
    it("should get a booking", async () => {
      prisma.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await service.findOneBooking(mockBooking.id);

      expect(prisma.booking.findUnique).toHaveBeenCalledWith({ where: { id: mockBooking.id } });
      expect(result).toEqual(mockBooking);
    });
  });

  describe("createBooking", () => {
    it("should create a pending booking for the given user", async () => {
      prisma.booking.create.mockResolvedValue(mockBooking);

      const result = await service.createBooking(mockCreateBooking, mockBooking.userId);

      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: { ...mockCreateBooking, userId: mockBooking.userId, status: BookingStatus.PENDING }
      });
      expect(result).toEqual(mockBooking);
    });

    it.each([
      ["starts in the past", { from: hoursFromNow(-1), to: hoursFromNow(1) }],
      ["starts at the same time it ends", { from: hoursFromNow(1), to: hoursFromNow(1) }],
      ["starts after it ends", { from: hoursFromNow(2), to: hoursFromNow(1) }]
    ])("should throw error when the booking %s", async (_, dates) => {
      await expect(service.createBooking({ ...mockCreateBooking, ...dates }, mockBooking.userId)).rejects.toMatchObject(
        { code: ServiceErrorCode.BAD_REQUEST }
      );
      expect(prisma.booking.create).not.toHaveBeenCalled();
    });
  });

  describe("cancelBooking", () => {
    it.each([BookingStatus.PENDING, BookingStatus.CONFIRMED])("should cancel a %s booking", async (status) => {
      prisma.booking.findUnique.mockResolvedValue({ ...upcomingBooking, status });

      await service.cancelBooking(mockBooking.id, mockBooking.userId);

      expect(prisma.booking.update).toHaveBeenCalledWith({
        where: { id: mockBooking.id },
        data: { status: BookingStatus.CANCELLED }
      });
    });

    it.each([BookingStatus.CANCELLED, BookingStatus.COMPLETED, BookingStatus.EXPIRED, BookingStatus.NO_SHOW])(
      "should not cancel when status is %s",
      async (status) => {
        prisma.booking.findUnique.mockResolvedValue({ ...upcomingBooking, status });

        await expect(service.cancelBooking(mockBooking.id, mockBooking.userId)).rejects.toMatchObject({
          code: ServiceErrorCode.BAD_REQUEST
        });
        expect(prisma.booking.update).not.toHaveBeenCalled();
      }
    );

    it.each([
      ["ongoing", ongoingBooking],
      ["past", pastBooking]
    ])("should not cancel a booking that is %s", async (_, booking) => {
      prisma.booking.findUnique.mockResolvedValue({ ...booking, status: BookingStatus.CONFIRMED });

      await expect(service.cancelBooking(mockBooking.id, mockBooking.userId)).rejects.toMatchObject({
        code: ServiceErrorCode.BAD_REQUEST
      });
      expect(prisma.booking.update).not.toHaveBeenCalled();
    });
  });

  describe("updateBooking", () => {
    const statuses = Object.values(BookingStatus);
    const forbiddenTransitions = statuses.map((from): [BookingStatus, BookingStatus[]] => [
      from,
      statuses.filter((to) => to !== from && !STATUS_TRANSITIONS[from].includes(to))
    ]);

    it.each([
      [BookingStatus.PENDING, BookingStatus.CONFIRMED, upcomingBooking],
      [BookingStatus.PENDING, BookingStatus.CANCELLED, upcomingBooking],
      [BookingStatus.PENDING, BookingStatus.EXPIRED, upcomingBooking],
      [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, upcomingBooking],
      [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, pastBooking],
      [BookingStatus.CONFIRMED, BookingStatus.NO_SHOW, pastBooking]
    ])("should change %s status to %s", async (from, to, booking) => {
      prisma.booking.findUnique.mockResolvedValue({ ...booking, status: from });

      await service.updateBooking(mockBooking.id, { status: to });

      expect(prisma.booking.update).toHaveBeenCalledWith({ where: { id: mockBooking.id }, data: { status: to } });
    });

    it.each(forbiddenTransitions)("should not change %s status to %s", async (from, targets) => {
      prisma.booking.findUnique.mockResolvedValue({ ...upcomingBooking, status: from });

      for (const to of targets) {
        await expect(service.updateBooking(mockBooking.id, { status: to })).rejects.toMatchObject({
          code: ServiceErrorCode.BAD_REQUEST
        });
      }
      expect(prisma.booking.update).not.toHaveBeenCalled();
    });

    it.each([
      [BookingStatus.PENDING, BookingStatus.CONFIRMED, "ongoing", ongoingBooking],
      [BookingStatus.CONFIRMED, BookingStatus.CANCELLED, "ongoing", ongoingBooking],
      [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, "ongoing", ongoingBooking],
      [BookingStatus.CONFIRMED, BookingStatus.NO_SHOW, "upcoming", upcomingBooking]
    ])("should not change %s status to %s when the booking is %s", async (from, to, _, booking) => {
      prisma.booking.findUnique.mockResolvedValue({ ...booking, status: from });

      await expect(service.updateBooking(mockBooking.id, { status: to })).rejects.toMatchObject({
        code: ServiceErrorCode.BAD_REQUEST
      });
      expect(prisma.booking.update).not.toHaveBeenCalled();
    });

    it("should allow sending the current status unchanged", async () => {
      prisma.booking.findUnique.mockResolvedValue({ ...upcomingBooking, status: BookingStatus.COMPLETED });

      await service.updateBooking(mockBooking.id, { status: BookingStatus.COMPLETED });

      expect(prisma.booking.update).toHaveBeenCalled();
    });

    it("should update the booking with valid future dates", async () => {
      prisma.booking.findUnique.mockResolvedValue(upcomingBooking);
      const data = { from: hoursFromNow(3), to: hoursFromNow(4) };

      await service.updateBooking(mockBooking.id, data);

      expect(prisma.booking.update).toHaveBeenCalledWith({ where: { id: mockBooking.id }, data });
    });

    it.each([
      ["starts in the past", { from: hoursFromNow(-1), to: hoursFromNow(1) }],
      ["starts at the same time it ends", { from: hoursFromNow(1), to: hoursFromNow(1) }],
      ["starts after it ends", { from: hoursFromNow(2), to: hoursFromNow(1) }],
      ["is moved to end before its current start", { to: hoursFromNow(0.5) }],
      ["is moved to start after its current end", { from: hoursFromNow(3) }]
    ])("should throw error when the booking %s", async (_, data) => {
      prisma.booking.findUnique.mockResolvedValue(upcomingBooking);

      await expect(service.updateBooking(mockBooking.id, data)).rejects.toMatchObject({
        code: ServiceErrorCode.BAD_REQUEST
      });
      expect(prisma.booking.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking", async () => {
      prisma.booking.delete.mockResolvedValue({ id: mockBooking.id });

      const result = await service.deleteBooking(mockBooking.id);

      expect(prisma.booking.delete).toHaveBeenCalledWith({ where: { id: mockBooking.id }, select: { id: true } });
      expect(result).toEqual({ id: mockBooking.id });
    });
  });
});

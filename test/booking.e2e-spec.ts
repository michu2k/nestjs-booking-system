import { INestApplication, ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import cookieParser from "cookie-parser";
import request from "supertest";

import { AppModule } from "../src/app.module";
import { CreateBookingDto, UpdateBookingDto } from "../src/booking/booking.dto";
import { BookingStatus, User, UserRole } from "../src/prisma/generated/client";
import { PrismaService } from "../src/prisma/prisma.service";

describe("BookingController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bookingId: number;
  let serviceId: number;
  let owner: User;
  let otherUser: User;
  let manager: User;
  let admin: User;

  const BOOKING_URL = "/api/v1/booking";
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DATE = new Date();
  const FUTURE_DATE = new Date(Date.now() + DAY_MS);
  const SECOND_FUTURE_DATE = new Date(Date.now() + DAY_MS + DAY_MS);
  const PAST_DATE = new Date(Date.now() - DAY_MS);

  const cookies = new Map<number, string>();

  const server = () => app.getHttpServer();

  const getAuthCookie = (user: User) => cookies.get(user.id);
  const getBooking = (id?: number) => prismaService.booking.findUnique({ where: { id: id ?? bookingId } });

  const createRequest = (user: User) => request(server()).post(BOOKING_URL).set("Cookie", getAuthCookie(user));

  const findAllRequest = (user: User) => request(server()).get(BOOKING_URL).set("Cookie", getAuthCookie(user));

  const findOneRequest = (user: User) =>
    request(server()).get(`${BOOKING_URL}/${bookingId}`).set("Cookie", getAuthCookie(user));

  const cancelRequest = (user: User) =>
    request(server()).post(`${BOOKING_URL}/${bookingId}/cancel`).set("Cookie", getAuthCookie(user));

  const updateRequest = (user: User) =>
    request(server()).patch(`${BOOKING_URL}/${bookingId}`).set("Cookie", getAuthCookie(user));

  const deleteRequest = (user: User) =>
    request(server()).delete(`${BOOKING_URL}/${bookingId}`).set("Cookie", getAuthCookie(user));

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix("api");
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });
    app.use(cookieParser());

    await app.init();

    const configService = app.get(ConfigService);
    const jwtService = new JwtService({ secret: configService.get("JWT_SECRET") });
    const runId = Date.now();

    const createUser = async (name: string, role: UserRole) => {
      const user = await prismaService.user.create({
        data: { name, role, email: `booking-e2e-${name}-${runId}@example.com` }
      });
      const token = await jwtService.signAsync({ sub: user.id, email: user.email });

      cookies.set(user.id, `${configService.get("ACCESS_TOKEN")}=${token}`);
      return user;
    };

    owner = await createUser("owner", UserRole.USER);
    otherUser = await createUser("other", UserRole.USER);
    manager = await createUser("manager", UserRole.MANAGER);
    admin = await createUser("admin", UserRole.ADMIN);

    const service = await prismaService.service.create({
      data: { name: "Booking e2e service", description: "Booking e2e service", price: 100 }
    });
    serviceId = service.id;
  });

  it(`${BOOKING_URL} (GET) rejects a request without a token`, () => {
    return request(server()).get(BOOKING_URL).expect(401);
  });

  describe(`${BOOKING_URL} (POST)`, () => {
    it("creates a pending booking for the current user", async () => {
      const createBookingData: CreateBookingDto = {
        from: DATE,
        to: DATE,
        serviceId
      };

      const { body } = await createRequest(owner).send(createBookingData).expect(201);
      const booking = await getBooking(body.id);

      expect(booking.userId).toBe(owner.id);
      expect(booking.serviceId).toBe(serviceId);
      expect(booking.status).toBe(BookingStatus.PENDING);

      // Save the bookingId for the next tests
      bookingId = body.id;
    });

    it("rejects an invalid body", async () => {
      const createBookingData: CreateBookingDto = {
        from: "not-a-date" as unknown as Date,
        to: DATE,
        serviceId
      };

      await createRequest(owner).send(createBookingData).expect(400);
    });
  });

  describe(`${BOOKING_URL} (GET)`, () => {
    it("returns the owner's bookings", async () => {
      const { body } = await findAllRequest(owner).expect(200);
      const bookingIds = body.map(({ id }: { id: number }) => id);

      expect(bookingIds).toContain(bookingId);
    });

    it("excludes the booking from another user's list", async () => {
      const { body } = await findAllRequest(otherUser).expect(200);
      const bookingIds = body.map(({ id }: { id: number }) => id);

      expect(bookingIds).not.toContain(bookingId);
    });
  });

  describe(`${BOOKING_URL}/:id (GET)`, () => {
    it("returns the owner's booking", async () => {
      const { body } = await findOneRequest(owner).expect(200);

      expect(body.id).toBe(bookingId);
      expect(body.from).toBe(DATE.toISOString());
      expect(body.to).toBe(DATE.toISOString());
    });

    it("returns 404 when another user requests the booking", async () => {
      await findOneRequest(otherUser).expect(404);
    });
  });

  describe(`${BOOKING_URL}/:id/cancel (POST)`, () => {
    it("returns 404 when another user tries to cancel the booking", async () => {
      await cancelRequest(otherUser).expect(404);
      const { status } = await getBooking();

      expect(status).toBe(BookingStatus.PENDING);
    });

    it("cancels the owner's booking", async () => {
      const { body } = await cancelRequest(owner).expect(200);
      const { status } = await getBooking();

      expect(body.status).toBe(BookingStatus.CANCELLED);
      expect(status).toBe(BookingStatus.CANCELLED);
    });

    it("rejects cancelling an already cancelled booking", async () => {
      await cancelRequest(owner).expect(400);
    });
  });

  describe(`${BOOKING_URL}/:id (PATCH)`, () => {
    beforeAll(async () => {
      // Creates a fresh PENDING booking for the owner
      const createBookingData: CreateBookingDto = { from: DATE, to: DATE, serviceId };
      const { body } = await createRequest(owner).send(createBookingData).expect(201);

      bookingId = body.id;
    });

    it("rejects an update from the owner", async () => {
      const updateBookingData: UpdateBookingDto = { status: BookingStatus.CONFIRMED };
      await updateRequest(owner).send(updateBookingData).expect(403);
      const { status } = await getBooking();

      expect(status).toBe(BookingStatus.PENDING);
    });

    it("rejects a start date in the past", async () => {
      const updateBookingData: UpdateBookingDto = { from: PAST_DATE };
      await updateRequest(manager).send(updateBookingData).expect(409);
      const { from } = await getBooking();

      expect(from.toISOString()).toBe(DATE.toISOString());
    });

    it("rejects an invalid status transition", async () => {
      const updateBookingData: UpdateBookingDto = { status: BookingStatus.COMPLETED };
      await updateRequest(manager).send(updateBookingData).expect(400);
      const { status } = await getBooking();

      expect(status).toBe(BookingStatus.PENDING);
    });

    it("lets a manager confirm and reschedule the booking", async () => {
      const updateBookingData: UpdateBookingDto = {
        status: BookingStatus.CONFIRMED,
        from: FUTURE_DATE,
        to: SECOND_FUTURE_DATE
      };
      await updateRequest(manager).send(updateBookingData).expect(200);
      const booking = await getBooking();

      expect(booking.status).toBe(BookingStatus.CONFIRMED);
      expect(booking.from.toISOString()).toBe(FUTURE_DATE.toISOString());
      expect(booking.to.toISOString()).toBe(SECOND_FUTURE_DATE.toISOString());
    });
  });

  describe(`${BOOKING_URL}/:id (DELETE)`, () => {
    it("forbids the owner from deleting the booking", async () => {
      await deleteRequest(owner).expect(403);
    });

    it("forbids a manager from deleting the booking", async () => {
      await deleteRequest(manager).expect(403);
    });

    it("lets an admin delete the booking", async () => {
      const { body } = await deleteRequest(admin).expect(200);
      const booking = await getBooking();

      expect(body.id).toBe(bookingId);
      expect(booking).toBeNull();
    });
  });

  afterAll(async () => {
    // Deleting the users and the service also removes any remaining bookings
    await prismaService.user.deleteMany({ where: { id: { in: [...cookies.keys()] } } });
    await prismaService.service.deleteMany({ where: { id: serviceId } });

    await app.close();
  });
});

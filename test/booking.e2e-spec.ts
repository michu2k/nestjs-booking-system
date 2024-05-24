import {Test, TestingModule} from "@nestjs/testing";
import {ExecutionContext, INestApplication, ValidationPipe} from "@nestjs/common";
import * as request from "supertest";
import {BookingStatus} from "@prisma/client";
import {AppModule} from "../src/app.module";
import {CreateBookingDto, UpdateBookingDto} from "../src/booking/booking.dto";
import {JwtAuthGuard} from "../src/auth/guards/jwt.guard";
import {mockAdmin} from "../src/user/user.mocks";
import {PrismaService} from "../src/prisma/prisma.service";

describe("BookingController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let bookingId: number;

  const BOOKING_URL = "/api/booking";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = mockAdmin;
          return true;
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
    app.setGlobalPrefix("api");

    await app.init();
  });

  it(`${BOOKING_URL} (GET)`, () => {
    return request(app.getHttpServer()).get(BOOKING_URL).expect(200);
  });

  it(`${BOOKING_URL} (POST)`, async () => {
    const serviceId = (await prismaService.service.findFirst()).id;
    const userId = (await prismaService.user.findFirst()).id;

    const createBookingDto: CreateBookingDto = {
      from: new Date(),
      to: new Date(),
      status: BookingStatus.PENDING,
      userId,
      serviceId
    };

    const {body} = await request(app.getHttpServer()).post(BOOKING_URL).send(createBookingDto).expect(201);
    // Save the bookingId for the next tests
    bookingId = body.id;
  });

  it(`${BOOKING_URL}/:id (GET)`, () => {
    return request(app.getHttpServer()).get(`${BOOKING_URL}/${bookingId}`).expect(200);
  });

  it(`${BOOKING_URL}/:id (PATCH)`, () => {
    const updateBookingDto: UpdateBookingDto = {
      status: BookingStatus.CANCELLED
    };

    return request(app.getHttpServer()).patch(`${BOOKING_URL}/${bookingId}`).send(updateBookingDto).expect(200);
  });

  it(`${BOOKING_URL}/:id (DELETE)`, () => {
    return request(app.getHttpServer()).delete(`${BOOKING_URL}/${bookingId}`).expect(200);
  });
});

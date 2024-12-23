import {ExecutionContext, INestApplication, ValidationPipe} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import {Request} from "express";
import * as request from "supertest";

import {AppModule} from "../src/app.module";
import {JwtAuthGuard} from "../src/auth/guards/jwt.guard";
import {PrismaService} from "../src/prisma/prisma.service";
import {CreateServiceDto, UpdateServiceDto} from "../src/service/service.dto";
import {mockAdmin} from "../src/user/user.mocks";

describe("ServiceController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let serviceId: number;

  const SERVICE_URL = "/api/service";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<Request>();
          req.user = mockAdmin;
          return true;
        }
      })
      .compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get<PrismaService>(PrismaService);

    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
    app.setGlobalPrefix("api");

    await app.init();
  });

  it(`${SERVICE_URL} (GET)`, () => {
    return request(app.getHttpServer()).get(SERVICE_URL).expect(200);
  });

  it(`${SERVICE_URL} (POST)`, async () => {
    const locationId = (await prismaService.location.findFirst()).id;

    const createServiceDto: CreateServiceDto = {
      name: "Service name",
      description: "Service description",
      price: 19,
      locationId
    };

    const {body} = await request(app.getHttpServer()).post(SERVICE_URL).send(createServiceDto).expect(201);
    // Save the serviceId for the next tests
    serviceId = body.id;
  });

  it(`${SERVICE_URL}/:id (GET)`, () => {
    return request(app.getHttpServer()).get(`${SERVICE_URL}/${serviceId}`).expect(200);
  });

  it(`${SERVICE_URL}/:id (PATCH)`, () => {
    const updateServiceDto: UpdateServiceDto = {
      description: "Updated service description"
    };

    return request(app.getHttpServer()).patch(`${SERVICE_URL}/${serviceId}`).send(updateServiceDto).expect(200);
  });

  it(`${SERVICE_URL}/:id (DELETE)`, () => {
    return request(app.getHttpServer()).delete(`${SERVICE_URL}/${serviceId}`).expect(200);
  });
});

import {ExecutionContext, INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {Request} from "express";
import * as request from "supertest";

import {AppModule} from "../src/app.module";
import {JwtAuthGuard} from "../src/auth/guards/jwt.guard";
import {PrismaService} from "../src/prisma/prisma.service";
import {mockAdmin} from "../src/user/user.mocks";

describe("UserController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userId: number;

  const USER_URL = "/api/user";

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
    app.setGlobalPrefix("api");

    userId = (await prismaService.user.findFirst()).id;

    await app.init();
  });

  it(`${USER_URL} (GET)`, () => {
    return request(app.getHttpServer()).get(`${USER_URL}/${userId}`).expect(200);
  });

  it(`${USER_URL}/:id (DELETE)`, () => {
    return request(app.getHttpServer()).delete(`${USER_URL}/${userId}`).expect(200);
  });
});

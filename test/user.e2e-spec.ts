import { ExecutionContext, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Request } from "express";
import * as request from "supertest";

import { AppModule } from "../src/app.module";
import { JwtAuthGuard } from "../src/auth/guards/jwt.guard";
import { PrismaService } from "../src/prisma/prisma.service";
import { mockAdmin } from "../src/user/user.mocks";

describe("UserController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let userId: number;

  const USER_URL = "/api/user";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest<Request>();
          // Override the mocked id with the actual userId
          req.user = { ...mockAdmin, id: userId };
          return true;
        }
      })
      .compile();

    app = moduleRef.createNestApplication();
    prismaService = moduleRef.get(PrismaService);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.setGlobalPrefix("api");

    // Get the id of the last user
    userId = (await prismaService.user.findFirst({ orderBy: { id: "desc" } })).id;

    await app.init();
  });

  it(`${USER_URL} (GET)`, () => {
    return request(app.getHttpServer()).get(`${USER_URL}/${userId}`).expect(200);
  });

  it(`${USER_URL}/:id (DELETE)`, () => {
    return request(app.getHttpServer()).delete(`${USER_URL}/${userId}`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

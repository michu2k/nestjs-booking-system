import { ExecutionContext, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { Request } from "express";
import * as request from "supertest";

import { AppModule } from "../src/app.module";
import { JwtAuthGuard } from "../src/auth/guards/jwt.guard";
import { mockAdmin } from "../src/user/user.mocks";

describe("AuthController (e2e)", () => {
  let app: INestApplication;

  const AUTH_URL = "/api/auth";

  beforeEach(async () => {
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
    app.setGlobalPrefix("api");

    await app.init();
  });

  it(`${AUTH_URL}/google (GET)`, () => {
    return request(app.getHttpServer()).get(`${AUTH_URL}/google`).expect(302);
  });

  it(`${AUTH_URL}/google/callback (GET)`, () => {
    return request(app.getHttpServer()).get(`${AUTH_URL}/google/callback`).expect(302);
  });

  it(`${AUTH_URL}/logout (GET)`, () => {
    return request(app.getHttpServer()).get(`${AUTH_URL}/logout`).expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

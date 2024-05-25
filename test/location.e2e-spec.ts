import {Test, TestingModule} from "@nestjs/testing";
import {ExecutionContext, INestApplication, ValidationPipe} from "@nestjs/common";
import * as request from "supertest";
import {AppModule} from "../src/app.module";
import {CreateLocationDto, UpdateLocationDto} from "../src/location/location.dto";
import {JwtAuthGuard} from "../src/auth/guards/jwt.guard";
import {mockAdmin} from "../src/user/user.mocks";

describe("LocationController (e2e)", () => {
  let app: INestApplication;
  let locationId: number;

  const LOCATION_URL = "/api/location";

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

    app.useGlobalPipes(new ValidationPipe({transform: true, whitelist: true}));
    app.setGlobalPrefix("api");

    await app.init();
  });

  it(`${LOCATION_URL} (GET)`, () => {
    return request(app.getHttpServer()).get(LOCATION_URL).expect(200);
  });

  it(`${LOCATION_URL} (POST)`, async () => {
    const createLocationDto: CreateLocationDto = {
      address: "934 Koelpin Oval",
      city: "Silver Spring",
      country: "Norway",
      lat: 0,
      lng: 0
    };

    const {body} = await request(app.getHttpServer()).post(LOCATION_URL).send(createLocationDto).expect(201);
    // Save the locationId for the next tests
    locationId = body.id;
  });

  it(`${LOCATION_URL}/:id (GET)`, () => {
    return request(app.getHttpServer()).get(`${LOCATION_URL}/${locationId}`).expect(200);
  });

  it(`${LOCATION_URL}/:id (PATCH)`, () => {
    const updateLocationDto: UpdateLocationDto = {
      city: "London"
    };

    return request(app.getHttpServer()).patch(`${LOCATION_URL}/${locationId}`).send(updateLocationDto).expect(200);
  });

  it(`${LOCATION_URL}/:id (DELETE)`, () => {
    return request(app.getHttpServer()).delete(`${LOCATION_URL}/${locationId}`).expect(200);
  });
});

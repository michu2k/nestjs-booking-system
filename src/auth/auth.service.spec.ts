import {Test, TestingModule} from "@nestjs/testing";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "../prisma/prisma.module";
import {AuthService} from "./auth.service";
import {UserModule} from "../user/user.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, UserModule, ConfigModule, JwtModule],
      providers: [AuthService]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

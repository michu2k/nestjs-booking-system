import {Test, TestingModule} from "@nestjs/testing";
import {PrismaModule} from "../prisma/prisma.module";
import {ServiceService} from "./service.service";

describe("ServiceService", () => {
  let service: ServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ServiceService]
    }).compile();

    service = module.get<ServiceService>(ServiceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

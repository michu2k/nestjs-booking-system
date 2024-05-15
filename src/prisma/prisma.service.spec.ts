import {Test, TestingModule} from "@nestjs/testing";
import {PrismaService} from "./prisma.service";

describe("PrismaService", () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it("prismaService should be defined", () => {
    expect(prismaService).toBeDefined();
  });
});

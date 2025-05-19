import { Test } from "@nestjs/testing";

import { PrismaService } from "./prisma.service";

describe("PrismaService", () => {
  let service: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();

    service = moduleRef.get(PrismaService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

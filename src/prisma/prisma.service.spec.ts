import { Test, TestingModule } from "@nestjs/testing";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client";
import { PrismaService } from "./prisma.service";

jest.mock("@prisma/adapter-pg", () => ({ PrismaPg: jest.fn() }));

jest.mock("./generated/client", () => ({
  PrismaClient: jest.fn().mockImplementation(function (this: { $disconnect: jest.Mock }) {
    this.$disconnect = jest.fn().mockResolvedValue(undefined);
  })
}));

describe("PrismaService", () => {
  let service: PrismaService;
  let moduleRef: TestingModule;
  const databaseUrl = "postgresql://user:pass@localhost:5432/test";

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env = { DATABASE_URL: databaseUrl };

    moduleRef = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();

    service = moduleRef.get(PrismaService);
  });

  it("should create the pg adapter with DATABASE_URL", () => {
    expect(PrismaPg).toHaveBeenCalledWith({ connectionString: databaseUrl });
  });

  it("should pass the adapter to PrismaClient", () => {
    const adapter = jest.mocked(PrismaPg).mock.instances[0];
    expect(PrismaClient).toHaveBeenCalledWith(expect.objectContaining({ adapter }));
  });

  it("should disconnect when the module is closed", async () => {
    await moduleRef.close();

    expect(service.$disconnect).toHaveBeenCalledTimes(1);
  });
});

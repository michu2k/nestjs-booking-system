import {Test, TestingModule} from "@nestjs/testing";
import {PrismaModule} from "../prisma/prisma.module";
import {BookingService} from "./booking.service";

describe("BookingService", () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [BookingService]
    }).compile();

    service = module.get<BookingService>(BookingService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

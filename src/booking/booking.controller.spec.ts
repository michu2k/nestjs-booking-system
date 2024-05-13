import {Test, TestingModule} from "@nestjs/testing";
import {BookingController} from "./booking.controller";
import {BookingModule} from "./booking.module";

describe("BookingController", () => {
  let controller: BookingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [BookingModule]
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

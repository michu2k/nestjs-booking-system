import {Test, TestingModule} from "@nestjs/testing";
import {LocationController} from "./location.controller";
import {LocationModule} from "./location.module";

describe("LocationController", () => {
  let controller: LocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LocationModule]
    }).compile();

    controller = module.get<LocationController>(LocationController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

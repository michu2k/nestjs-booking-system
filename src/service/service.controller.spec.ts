import {Test, TestingModule} from "@nestjs/testing";
import {ServiceController} from "./service.controller";
import {ServiceModule} from "./service.module";

describe("ServiceController", () => {
  let controller: ServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ServiceModule]
    }).compile();

    controller = module.get<ServiceController>(ServiceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});

import { Test } from "@nestjs/testing";

import { HealthController } from "./health.controller";
import { HealthService } from "./health.service";

describe("HealthController", () => {
  let controller: HealthController;
  let healthService: HealthService;

  const mockHealthService = {
    getHealthStatus: jest.fn().mockReturnValue({
      status: "ok",
      timestamp: expect.any(String)
    })
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: HealthService,
          useValue: mockHealthService
        }
      ],
      controllers: [HealthController]
    }).compile();

    controller = moduleRef.get(HealthController);
    healthService = moduleRef.get(HealthService);
  });

  describe("getHealth", () => {
    it("should return health status", () => {
      const result = controller.getHealth();

      expect(healthService.getHealthStatus).toHaveBeenCalled();
      expect(result).toEqual({
        status: "ok",
        timestamp: expect.any(String)
      });
    });
  });
});

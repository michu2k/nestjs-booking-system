import { Test } from "@nestjs/testing";

import { HealthService } from "./health.service";

describe("HealthService", () => {
  let service: HealthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [HealthService]
    }).compile();

    service = moduleRef.get(HealthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getHealthStatus", () => {
    it("should return health status", () => {
      const result = service.getHealthStatus();

      expect(result).toEqual({
        status: "ok",
        timestamp: expect.any(String)
      });
    });
  });
});

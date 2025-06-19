import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { mockSchedule, mockUpdateSchedule } from "./schedule.mocks";
import { ScheduleService } from "./schedule.service";

describe("ScheduleService", () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ScheduleService, PrismaService]
    }).compile();

    service = moduleRef.get(ScheduleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findSchedule", () => {
    it("should get a schedule", async () => {
      const findScheduleSpy = jest.spyOn(service, "findSchedule").mockResolvedValue([mockSchedule, mockSchedule]);
      const result = await service.findSchedule({ serviceId: mockSchedule.serviceId });

      expect(findScheduleSpy).toHaveBeenCalled();
      expect(result).toEqual([mockSchedule, mockSchedule]);
    });
  });

  describe("createSchedule", () => {
    it("should create a schedule", async () => {
      const createScheduleSpy = jest.spyOn(service, "createSchedule").mockResolvedValue([mockSchedule, mockSchedule]);
      const result = await service.createSchedule(mockSchedule.serviceId);

      expect(createScheduleSpy).toHaveBeenCalledWith(mockSchedule.serviceId);
      expect(result).toEqual([mockSchedule, mockSchedule]);
    });
  });

  describe("updateSchedule", () => {
    it("should update a schedule", async () => {
      const mockUpdatedSchedule = { ...mockSchedule, ...mockUpdateSchedule };
      const updateScheduleSpy = jest.spyOn(service, "updateSchedule").mockResolvedValue(mockUpdatedSchedule);
      const result = await service.updateSchedule(mockSchedule.id, mockUpdateSchedule);

      expect(updateScheduleSpy).toHaveBeenCalledWith(mockSchedule.id, mockUpdateSchedule);
      expect(result).toEqual(mockUpdatedSchedule);
    });
  });
});

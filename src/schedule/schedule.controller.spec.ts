import { Test } from "@nestjs/testing";

import { ScheduleController } from "./schedule.controller";
import { mockSchedule, mockUpdateSchedule } from "./schedule.mocks";
import { ScheduleService } from "./schedule.service";

describe("ScheduleController", () => {
  let controller: ScheduleController;
  let scheduleService: ScheduleService;

  const mockScheduleService = {
    findSchedule: jest.fn().mockResolvedValue([mockSchedule, mockSchedule]),
    updateSchedule: jest.fn((_, data) => Promise.resolve({ ...mockSchedule, ...data }))
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ScheduleService,
          useValue: mockScheduleService
        }
      ],
      controllers: [ScheduleController]
    }).compile();

    controller = moduleRef.get(ScheduleController);
    scheduleService = moduleRef.get(ScheduleService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("scheduleService should be defined", () => {
    expect(scheduleService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get schedule for a service with the specified id", async () => {
      const result = await controller.findAll(mockSchedule.serviceId);

      expect(scheduleService.findSchedule).toHaveBeenCalled();
      expect(result).toEqual([mockSchedule, mockSchedule]);
    });
  });

  describe("update", () => {
    it("should update a schedule", async () => {
      const result = await controller.update(mockSchedule.id, mockUpdateSchedule);

      expect(result).toEqual({ ...mockSchedule, ...mockUpdateSchedule });
    });
  });
});

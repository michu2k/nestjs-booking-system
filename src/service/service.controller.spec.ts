import { Test } from "@nestjs/testing";
import { ServiceStatus } from "@prisma/client";

import { ServiceController } from "./service.controller";
import { CreateServiceDto, UpdateServiceDto } from "./service.dto";
import { mockService } from "./service.mocks";
import { ServiceService } from "./service.service";

describe("ServiceController", () => {
  let controller: ServiceController;
  let serviceService: ServiceService;

  const mockServiceService = {
    findAllServices: jest.fn().mockResolvedValue([mockService, mockService]),
    findOneService: jest.fn().mockResolvedValue(mockService),
    createService: jest.fn((data: CreateServiceDto) => Promise.resolve({ ...mockService, ...data })),
    updateService: jest.fn((_, data: UpdateServiceDto) => Promise.resolve({ ...mockService, ...data })),
    deleteService: jest.fn().mockResolvedValue(mockService)
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ServiceService,
          useValue: mockServiceService
        }
      ],
      controllers: [ServiceController]
    }).compile();

    controller = moduleRef.get(ServiceController);
    serviceService = moduleRef.get(ServiceService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("serviceService should be defined", () => {
    expect(serviceService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get all services", async () => {
      const result = await controller.findOne(mockService.id);

      expect(serviceService.findOneService).toHaveBeenCalled();
      expect(result).toEqual(mockService);
    });
  });

  describe("findOne", () => {
    it("should get a service", async () => {
      const result = await controller.findOne(mockService.id);

      expect(serviceService.findOneService).toHaveBeenCalled();
      expect(result).toEqual(mockService);
    });
  });

  describe("create", () => {
    it("should create a service", async () => {
      const createServiceDto: CreateServiceDto = {
        name: "Service name",
        description: "Service description",
        price: 19,
        status: ServiceStatus.ACTIVE,
        locationId: 1
      };
      const result = await controller.create(createServiceDto);

      expect(serviceService.createService).toHaveBeenCalled();
      expect(result).toEqual({ ...mockService, ...createServiceDto });
    });
  });

  describe("update", () => {
    it("should update a service", async () => {
      const updateServiceDto: UpdateServiceDto = {
        description: "Updated description"
      };
      const mockUpdatedService = { ...mockService, ...updateServiceDto };
      const result = await controller.update(mockService.id, updateServiceDto);

      expect(result).toEqual(mockUpdatedService);
    });
  });

  describe("delete", () => {
    it("should delete a service", async () => {
      const result = await controller.delete(mockService.id);

      expect(serviceService.deleteService).toHaveBeenCalled();
      expect(result).toEqual(mockService);
    });
  });
});

import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceDto, UpdateServiceDto } from "./service.dto";
import { mockService } from "./service.mocks";
import { ServiceService } from "./service.service";

describe("ServiceService", () => {
  let service: ServiceService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ServiceService, PrismaService]
    }).compile();

    service = moduleRef.get(ServiceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllServices", () => {
    let findAllServicesSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllServicesSpy = jest
        .spyOn(service, "findAllServices")
        .mockResolvedValue([mockService, mockService, mockService]);
    });

    it("should get all services", async () => {
      const result = await service.findAllServices();

      expect(findAllServicesSpy).toHaveBeenCalled();
      expect(result).toEqual([mockService, mockService, mockService]);
    });

    it("should get all services with specified limit", async () => {
      const limit = 2;

      await service.findAllServices(limit);

      expect(findAllServicesSpy).toHaveBeenCalledWith(limit);
    });

    it("should get all services with specified offset", async () => {
      const offset = 1;

      await service.findAllServices(undefined, offset);

      expect(findAllServicesSpy).toHaveBeenCalledWith(undefined, offset);
    });
  });

  describe("findOneService", () => {
    it("should get a service", async () => {
      const findOneServiceSpy = jest.spyOn(service, "findOneService").mockResolvedValue(mockService);
      const result = await service.findOneService(mockService.id);

      expect(findOneServiceSpy).toHaveBeenCalledWith(mockService.id);
      expect(result).toEqual(mockService);
    });
  });

  describe("createService", () => {
    it("should create a service", async () => {
      const createServiceDto: CreateServiceDto = {
        name: "Service name",
        description: "Service description",
        price: 19,
        locationId: 1
      };
      const mockCreatedService = { ...mockService, ...createServiceDto };
      const createServiceSpy = jest.spyOn(service, "createService").mockResolvedValue(mockCreatedService);
      const result = await service.createService(createServiceDto);

      expect(createServiceSpy).toHaveBeenCalledWith(createServiceDto);
      expect(result).toEqual(mockCreatedService);
    });
  });

  describe("updateService", () => {
    it("should update a service", async () => {
      const updateServiceDto: UpdateServiceDto = {
        description: "Updated description"
      };
      const mockUpdatedService = { ...mockService, ...updateServiceDto };
      const updateServiceSpy = jest.spyOn(service, "updateService").mockResolvedValue(mockUpdatedService);
      const result = await service.updateService(mockService.id, updateServiceDto);

      expect(updateServiceSpy).toHaveBeenCalledWith(mockService.id, updateServiceDto);
      expect(result).toEqual(mockUpdatedService);
    });
  });

  describe("deleteService", () => {
    it("should delete a service", async () => {
      const deleteServiceSpy = jest.spyOn(service, "deleteService").mockResolvedValue(mockService);
      const result = await service.deleteService(mockService.id);

      expect(deleteServiceSpy).toHaveBeenCalledWith(mockService.id);
      expect(result).toEqual(mockService);
    });
  });
});

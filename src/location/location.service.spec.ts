import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { mockCreateLocation, mockLocation, mockUpdateLocation } from "./location.mocks";
import { LocationService } from "./location.service";

describe("LocationService", () => {
  let service: LocationService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LocationService, PrismaService]
    }).compile();

    service = moduleRef.get(LocationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllLocations", () => {
    let findAllLocationsSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllLocationsSpy = jest.spyOn(service, "findAllLocations").mockResolvedValue([mockLocation, mockLocation]);
    });

    it("should get all locations", async () => {
      const result = await service.findAllLocations();

      expect(findAllLocationsSpy).toHaveBeenCalled();
      expect(result).toEqual([mockLocation, mockLocation]);
    });

    it("should get all locations with specified limit", async () => {
      const limit = 1;

      await service.findAllLocations(limit);

      expect(findAllLocationsSpy).toHaveBeenCalledWith(limit);
    });

    it("should get all locations with specified offset", async () => {
      const offset = 1;

      await service.findAllLocations(undefined, offset);

      expect(findAllLocationsSpy).toHaveBeenCalledWith(undefined, offset);
    });
  });

  describe("findOneLocation", () => {
    it("should get a location", async () => {
      const findOneLocationSpy = jest.spyOn(service, "findOneLocation").mockResolvedValue(mockLocation);
      const result = await service.findOneLocation(mockLocation.id);

      expect(findOneLocationSpy).toHaveBeenCalledWith(mockLocation.id);
      expect(result).toEqual(mockLocation);
    });
  });

  describe("createLocation", () => {
    it("should create a location", async () => {
      const mockCreatedLocation = { ...mockLocation, ...mockCreateLocation };
      const createLocationSpy = jest.spyOn(service, "createLocation").mockResolvedValue(mockCreatedLocation);
      const result = await service.createLocation(mockCreateLocation);

      expect(createLocationSpy).toHaveBeenCalledWith(mockCreateLocation);
      expect(result).toEqual(mockCreatedLocation);
    });
  });

  describe("updateLocation", () => {
    it("should update a location", async () => {
      const mockUpdatedLocation = { ...mockLocation, ...mockUpdateLocation };
      const updateLocationSpy = jest.spyOn(service, "updateLocation").mockResolvedValue(mockUpdatedLocation);
      const result = await service.updateLocation(mockLocation.id, mockUpdateLocation);

      expect(updateLocationSpy).toHaveBeenCalledWith(mockLocation.id, mockUpdateLocation);
      expect(result).toEqual(mockUpdatedLocation);
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location", async () => {
      const deleteLocationSpy = jest.spyOn(service, "deleteLocation").mockResolvedValue(mockLocation);
      const result = await service.deleteLocation(mockLocation.id);

      expect(deleteLocationSpy).toHaveBeenCalledWith(mockLocation.id);
      expect(result).toEqual(mockLocation);
    });
  });
});

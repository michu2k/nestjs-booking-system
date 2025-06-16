import { Test } from "@nestjs/testing";

import { LocationController } from "./location.controller";
import { mockCreateLocation, mockLocation, mockUpdateLocation } from "./location.mocks";
import { LocationService } from "./location.service";

describe("LocationController", () => {
  let controller: LocationController;
  let locationService: LocationService;

  const mockLocationService = {
    findAllLocations: jest.fn().mockResolvedValue([mockLocation, mockLocation]),
    findOneLocation: jest.fn().mockResolvedValue(mockLocation),
    createLocation: jest.fn((data) => Promise.resolve({ ...mockLocation, ...data })),
    updateLocation: jest.fn((_, data) => Promise.resolve({ ...mockLocation, ...data })),
    deleteLocation: jest.fn().mockResolvedValue(mockLocation)
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService
        }
      ],
      controllers: [LocationController]
    }).compile();

    controller = moduleRef.get(LocationController);
    locationService = moduleRef.get(LocationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("locationService should be defined", () => {
    expect(locationService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get all locations", async () => {
      const result = await controller.findAll();

      expect(locationService.findAllLocations).toHaveBeenCalled();
      expect(result).toEqual([mockLocation, mockLocation]);
    });
  });

  describe("findOne", () => {
    it("should get a location", async () => {
      const result = await controller.findOne(mockLocation.id);

      expect(locationService.findOneLocation).toHaveBeenCalled();
      expect(result).toEqual(mockLocation);
    });
  });

  describe("create", () => {
    it("should create a location", async () => {
      const result = await controller.create(mockCreateLocation);

      expect(locationService.createLocation).toHaveBeenCalled();
      expect(result).toEqual({ ...mockLocation, ...mockCreateLocation });
    });
  });

  describe("update", () => {
    it("should update a location", async () => {
      const result = await controller.update(mockLocation.id, mockUpdateLocation);

      expect(locationService.updateLocation).toHaveBeenCalled();
      expect(result).toEqual({ ...mockLocation, ...mockUpdateLocation });
    });
  });

  describe("delete", () => {
    it("should delete a location", async () => {
      const result = await controller.delete(mockLocation.id);

      expect(locationService.deleteLocation).toHaveBeenCalled();
      expect(result).toEqual(mockLocation);
    });
  });
});

import {Test, TestingModule} from "@nestjs/testing";
import {PrismaModule} from "../prisma/prisma.module";
import {LocationService} from "./location.service";
import {mockLocation} from "./location.mocks";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";

describe("LocationService", () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [LocationService]
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAllLocations", () => {
    let findAllLocationsSpy: jest.SpyInstance;

    beforeEach(() => {
      findAllLocationsSpy = jest
        .spyOn(service, "findAllLocations")
        .mockResolvedValue([mockLocation, mockLocation, mockLocation]);
    });

    it("should get all locations", async () => {
      const result = await service.findAllLocations();

      expect(findAllLocationsSpy).toHaveBeenCalled();
      expect(result).toEqual([mockLocation, mockLocation, mockLocation]);
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
      const createLocationDto: CreateLocationDto = {
        address: "934 Koelpin Oval",
        city: "Silver Spring",
        country: "Poland",
        lat: -77.4925,
        lng: -72.1182
      };
      const mockCreatedLocation = {...mockLocation, ...createLocationDto};
      const createLocationSpy = jest.spyOn(service, "createLocation").mockResolvedValue(mockCreatedLocation);
      const result = await service.createLocation(createLocationDto);

      expect(createLocationSpy).toHaveBeenCalledWith(createLocationDto);
      expect(result).toEqual(mockCreatedLocation);
    });
  });

  describe("updateLocation", () => {
    it("should update a location", async () => {
      const updateLocationDto: UpdateLocationDto = {
        city: "London"
      };
      const mockUpdatedLocation = {...mockLocation, ...updateLocationDto};
      const updateLocationSpy = jest.spyOn(service, "updateLocation").mockResolvedValue(mockUpdatedLocation);
      const result = await service.updateLocation(mockLocation.id, updateLocationDto);

      expect(updateLocationSpy).toHaveBeenCalledWith(mockLocation.id, updateLocationDto);
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

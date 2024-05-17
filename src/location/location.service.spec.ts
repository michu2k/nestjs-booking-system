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
    let findAllLocations: jest.SpyInstance;

    beforeEach(() => {
      findAllLocations = jest.spyOn(service, "findAllLocations");
    });

    it("should get all locations", async () => {
      findAllLocations.mockResolvedValue([mockLocation, mockLocation]);

      const result = await service.findAllLocations();

      expect(findAllLocations).toHaveBeenCalled();
      expect(result).toEqual([mockLocation, mockLocation]);
    });

    it("should get all locations with specified limit", async () => {
      findAllLocations.mockResolvedValue([mockLocation]);

      const limit = 1;
      const result = await service.findAllLocations(limit);

      expect(findAllLocations).toHaveBeenCalledWith(limit);
      expect(result).toEqual([mockLocation]);
    });

    it("should get all locations with specified offset", async () => {
      findAllLocations.mockResolvedValue([mockLocation]);

      const offset = 1;
      const result = await service.findAllLocations(undefined, offset);

      expect(findAllLocations).toHaveBeenCalledWith(undefined, offset);
      expect(result).toEqual([mockLocation]);
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
      const createLocationResult = {...mockLocation, ...createLocationDto};

      const createLocationSpy = jest.spyOn(service, "createLocation").mockResolvedValue(createLocationResult);
      const result = await service.createLocation(createLocationDto);

      expect(createLocationSpy).toHaveBeenCalledWith(createLocationDto);
      expect(result).toEqual(createLocationResult);
    });
  });

  describe("updateLocation", () => {
    it("should update a location", async () => {
      const updateLocationDto: UpdateLocationDto = {
        city: "London"
      };
      const updateLocationResult = {...mockLocation, ...updateLocationDto};

      const updateLocationSpy = jest.spyOn(service, "updateLocation").mockResolvedValue(updateLocationResult);
      const result = await service.updateLocation(mockLocation.id, updateLocationDto);

      expect(updateLocationSpy).toHaveBeenCalledWith(mockLocation.id, updateLocationDto);
      expect(result).toEqual(updateLocationResult);
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

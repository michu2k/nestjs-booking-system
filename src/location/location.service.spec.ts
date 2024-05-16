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

      const location = await service.findAllLocations();

      expect(findAllLocations).toHaveBeenCalled();
      expect(location).toEqual([mockLocation, mockLocation]);
    });

    it("should get all locations with specified limit", async () => {
      findAllLocations.mockResolvedValue([mockLocation]);

      const limit = 1;
      const location = await service.findAllLocations(limit);

      expect(findAllLocations).toHaveBeenCalledWith(limit);
      expect(location).toEqual([mockLocation]);
    });

    it("should get all locations with specified offset", async () => {
      findAllLocations.mockResolvedValue([mockLocation]);

      const offset = 1;
      const location = await service.findAllLocations(undefined, offset);

      expect(findAllLocations).toHaveBeenCalledWith(undefined, offset);
      expect(location).toEqual([mockLocation]);
    });
  });

  describe("findOneLocation", () => {
    let findOneLocationSpy: jest.SpyInstance;

    beforeEach(() => {
      findOneLocationSpy = jest.spyOn(service, "findOneLocation");
    });

    it("should get a location", async () => {
      findOneLocationSpy.mockResolvedValue(mockLocation);

      const location = await service.findOneLocation(mockLocation.id);

      expect(findOneLocationSpy).toHaveBeenCalledWith(mockLocation.id);
      expect(location).toEqual(mockLocation);
    });
  });

  describe("createLocation", () => {
    let createLocationSpy: jest.SpyInstance;

    beforeEach(() => {
      createLocationSpy = jest.spyOn(service, "createLocation");
    });

    it("should create a location", async () => {
      const createLocationDto: CreateLocationDto = {
        address: "934 Koelpin Oval",
        city: "Silver Spring",
        country: "Poland",
        lat: -77.4925,
        lng: -72.1182
      };

      const createLocationResult = {...mockLocation, ...createLocationDto};

      createLocationSpy.mockResolvedValue(createLocationResult);

      const location = await service.createLocation(createLocationDto);

      expect(createLocationSpy).toHaveBeenCalledWith(createLocationDto);
      expect(location).toEqual(createLocationResult);
    });
  });

  describe("updateLocation", () => {
    let updateLocationSpy: jest.SpyInstance;

    beforeEach(() => {
      updateLocationSpy = jest.spyOn(service, "updateLocation");
    });

    it("should update a location", async () => {
      const updateLocationDto: UpdateLocationDto = {
        city: "London"
      };

      const updateLocationResult = {...mockLocation, ...updateLocationDto};

      updateLocationSpy.mockResolvedValue(updateLocationResult);

      const location = await service.updateLocation(mockLocation.id, updateLocationDto);

      expect(updateLocationSpy).toHaveBeenCalledWith(mockLocation.id, updateLocationDto);
      expect(location).toEqual(updateLocationResult);
    });
  });

  describe("deleteLocation", () => {
    let deleteLocationSpy: jest.SpyInstance;

    beforeEach(() => {
      deleteLocationSpy = jest.spyOn(service, "deleteLocation");
    });

    it("should delete a location", async () => {
      deleteLocationSpy.mockResolvedValue(mockLocation);

      const location = await service.deleteLocation(mockLocation.id);

      expect(deleteLocationSpy).toHaveBeenCalledWith(mockLocation.id);
      expect(location).toEqual(mockLocation);
    });
  });
});

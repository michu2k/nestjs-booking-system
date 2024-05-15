import {Test, TestingModule} from "@nestjs/testing";
import {Location} from "@prisma/client";
import {LocationController} from "./location.controller";
import {LocationService} from "./location.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";
import {mockLocation} from "./location.mocks";

describe("LocationController", () => {
  let locationController: LocationController;
  let locationService: LocationService;

  const mockLocationService = {
    findAllLocations: jest.fn().mockResolvedValue([mockLocation, mockLocation]),
    findOneLocation: jest.fn().mockResolvedValue(mockLocation),
    createLocation: jest.fn((data: CreateLocationDto) => Promise.resolve({...mockLocation, ...data})),
    updateLocation: jest.fn((_, data: UpdateLocationDto) => Promise.resolve({...mockLocation, ...data})),
    deleteLocation: jest.fn().mockResolvedValue(mockLocation)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService
        }
      ],
      controllers: [LocationController]
    }).compile();

    locationController = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);

    jest.clearAllMocks();
  });

  it("locationController should be defined", () => {
    expect(locationController).toBeDefined();
  });

  it("locationService should be defined", () => {
    expect(locationService).toBeDefined();
  });

  describe("findAll", () => {
    let location: Array<Location>;

    beforeEach(async () => {
      location = await locationController.findAll();
    });

    it("should call findAllLocations method", () => {
      expect(locationService.findAllLocations).toHaveBeenCalled();
    });

    it("should get all locations", () => {
      expect(location).toEqual([mockLocation, mockLocation]);
    });
  });

  describe("findOne", () => {
    let location: Location;

    beforeEach(async () => {
      location = await locationController.findOne(mockLocation.id);
    });

    it("should call findOneLocation method", () => {
      expect(locationService.findOneLocation).toHaveBeenCalled();
    });

    it("should get a location", () => {
      expect(location).toEqual(mockLocation);
    });
  });

  describe("create", () => {
    let location: Location;
    const createLocationDto: CreateLocationDto = {
      address: "934 Koelpin Oval",
      city: "Silver Spring",
      country: "Norway",
      lat: 0,
      lng: 0
    };

    beforeEach(async () => {
      location = await locationController.create(createLocationDto);
    });

    it("should call createLocation method", () => {
      expect(locationService.createLocation).toHaveBeenCalled();
    });

    it("should create a location", () => {
      expect(location).toEqual({...mockLocation, ...createLocationDto});
    });
  });

  describe("update", () => {
    let location: Location;

    const updateLocationDto: UpdateLocationDto = {
      city: "London"
    };

    beforeEach(async () => {
      location = await locationController.update(mockLocation.id, updateLocationDto);
    });

    it("should call updateLocation method", () => {
      expect(locationService.updateLocation).toHaveBeenCalled();
    });

    it("should update a location", () => {
      expect(location).toEqual({...mockLocation, ...updateLocationDto});
    });
  });

  describe("delete", () => {
    let location: Location;

    beforeEach(async () => {
      location = await locationController.delete(mockLocation.id);
    });

    it("should call deleteLocation method", () => {
      expect(locationService.deleteLocation).toHaveBeenCalled();
    });

    it("should delete a location", () => {
      expect(location).toEqual(mockLocation);
    });
  });
});

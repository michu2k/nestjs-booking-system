import {Test, TestingModule} from "@nestjs/testing";
import {LocationController} from "./location.controller";
import {LocationService} from "./location.service";
import {CreateLocationDto, UpdateLocationDto} from "./location.dto";
import {mockLocation} from "./location.mocks";

describe("LocationController", () => {
  let controller: LocationController;
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

    controller = module.get<LocationController>(LocationController);
    locationService = module.get<LocationService>(LocationService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("locationService should be defined", () => {
    expect(locationService).toBeDefined();
  });

  describe("findAll", () => {
    it("should get all locations", async () => {
      const location = await controller.findAll();

      expect(locationService.findAllLocations).toHaveBeenCalled();
      expect(location).toEqual([mockLocation, mockLocation]);
    });
  });

  describe("findOne", () => {
    it("should get a location", async () => {
      const location = await controller.findOne(mockLocation.id);

      expect(locationService.findOneLocation).toHaveBeenCalled();
      expect(location).toEqual(mockLocation);
    });
  });

  describe("create", () => {
    it("should create a location", async () => {
      const createLocationDto: CreateLocationDto = {
        address: "934 Koelpin Oval",
        city: "Silver Spring",
        country: "Norway",
        lat: 0,
        lng: 0
      };
      const location = await controller.create(createLocationDto);

      expect(locationService.createLocation).toHaveBeenCalled();
      expect(location).toEqual({...mockLocation, ...createLocationDto});
    });
  });

  describe("update", () => {
    it("should update a location", async () => {
      const updateLocationDto: UpdateLocationDto = {
        city: "London"
      };

      const location = await controller.update(mockLocation.id, updateLocationDto);

      expect(locationService.updateLocation).toHaveBeenCalled();
      expect(location).toEqual({...mockLocation, ...updateLocationDto});
    });
  });

  describe("delete", () => {
    it("should delete a location", async () => {
      const location = await controller.delete(mockLocation.id);

      expect(locationService.deleteLocation).toHaveBeenCalled();
      expect(location).toEqual(mockLocation);
    });
  });
});

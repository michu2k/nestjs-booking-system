import { CreateLocationDto, LocationEntity, UpdateLocationDto } from "./location.dto";

export const mockLocation: LocationEntity = {
  id: 1,
  address: "934 Koelpin Oval",
  city: "Silver Spring",
  country: "Norway",
  lat: -77.4925,
  lng: -72.1182
};

export const mockCreateLocation: CreateLocationDto = {
  address: "934 Koelpin Oval",
  city: "Silver Spring",
  country: "Poland",
  lat: -77.4925,
  lng: -72.1182
};

export const mockUpdateLocation: UpdateLocationDto = {
  city: "London"
};

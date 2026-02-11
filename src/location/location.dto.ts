import { PartialType, PickType } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString } from "class-validator";

import { Location } from "../prisma/generated/client";

export class LocationEntity implements Location {
  @IsInt()
  id: number;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  constructor(partial: Partial<LocationEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateLocationDto extends PickType(LocationEntity, [
  "address",
  "city",
  "country",
  "lat",
  "lng"
] as const) {}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

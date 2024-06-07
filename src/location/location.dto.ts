import {PartialType, PickType} from "@nestjs/swagger";
import {Location} from "@prisma/client";
import {IsInt, IsNumber, IsString} from "class-validator";

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
}

export class CreateLocationDto extends PickType(LocationEntity, ["address", "city", "country", "lat", "lng"]) {}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

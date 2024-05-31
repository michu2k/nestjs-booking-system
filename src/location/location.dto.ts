import {PartialType} from "@nestjs/swagger";
import {IsNumber, IsString} from "class-validator";

export class CreateLocationDto {
  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsString()
  country: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}

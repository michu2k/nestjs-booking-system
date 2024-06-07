import {PartialType, PickType} from "@nestjs/swagger";
import {Service} from "@prisma/client";
import {IsString, Min, IsInt, IsDateString} from "class-validator";

export class ServiceEntity implements Service {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(1)
  @IsInt()
  price: number;

  @IsDateString({strict: true, strictSeparator: true})
  createdAt: Date;

  @IsDateString({strict: true, strictSeparator: true})
  updatedAt: Date;

  @IsInt()
  locationId: number;
}

export class CreateServiceDto extends PickType(ServiceEntity, ["name", "description", "price", "locationId"]) {}

export class UpdateServiceDto extends PartialType(ServiceEntity) {}

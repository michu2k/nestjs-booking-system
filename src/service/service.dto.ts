import {PartialType} from "@nestjs/swagger";
import {IsString, Min, IsInt} from "class-validator";

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(1)
  @IsInt()
  price: number;

  @IsInt()
  locationId: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

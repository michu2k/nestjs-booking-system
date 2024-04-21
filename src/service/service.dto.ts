import {IsNumber, IsOptional, IsString, Min} from "class-validator";

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Min(1)
  @IsNumber()
  price: number;

  @IsNumber()
  locationId: number;
}

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Min(1)
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  locationId?: number;
}

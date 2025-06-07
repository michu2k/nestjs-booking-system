import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { Service, ServiceStatus } from "@prisma/client";
import { IsDateString, IsEnum, IsInt, IsString, Min } from "class-validator";

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

  @IsDateString({ strict: true, strictSeparator: true })
  createdAt: Date;

  @IsDateString({ strict: true, strictSeparator: true })
  updatedAt: Date;

  @IsEnum(ServiceStatus)
  @ApiProperty({ enum: ServiceStatus })
  status: ServiceStatus;

  @IsInt()
  locationId: number;

  constructor(partial: Partial<ServiceEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateServiceDto extends PickType(ServiceEntity, [
  "name",
  "description",
  "price",
  "status",
  "locationId"
] as const) {}

export class UpdateServiceDto extends PartialType(ServiceEntity) {}

import { PartialType, PickType } from "@nestjs/swagger";
import { ServiceSchedule } from "@prisma/client";
import { IsInt, IsString, Max, Min } from "class-validator";

export class ScheduleEntity implements ServiceSchedule {
  @IsInt()
  id: number;

  @IsInt()
  @Min(0)
  @Max(6)
  day: number;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsInt()
  serviceId: number;

  constructor(partial: Partial<ScheduleEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateScheduleDto extends PickType(ScheduleEntity, [
  "day",
  "startTime",
  "endTime",
  "serviceId"
] as const) {}

export class UpdateScheduleDto extends PartialType(ScheduleEntity) {}

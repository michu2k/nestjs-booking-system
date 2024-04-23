import {PartialType} from "@nestjs/mapped-types";
import {BookingStatus} from "@prisma/client";
import {IsDateString, IsEnum, IsInt, IsISO8601} from "class-validator";

export class CreateBookingDto {
  @IsISO8601({strict: true, strictSeparator: true})
  from: Date;

  @IsDateString({strict: true, strictSeparator: true})
  to: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsInt()
  userId: number;

  @IsInt()
  serviceId: number;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
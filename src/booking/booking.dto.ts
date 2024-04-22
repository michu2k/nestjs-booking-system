import {PartialType} from "@nestjs/mapped-types";
import {BookingStatus} from "@prisma/client";
import {IsDate, IsEnum, IsInt} from "class-validator";

export class CreateBookingDto {
  @IsDate()
  from: Date;

  @IsDate()
  to: Date;

  @IsEnum(BookingStatus)
  status: BookingStatus;

  @IsInt()
  userId: number;

  @IsInt()
  serviceId: number;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}

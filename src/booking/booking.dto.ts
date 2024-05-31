import {PartialType} from "@nestjs/swagger";
import {BookingStatus} from "@prisma/client";
import {IsDateString, IsEnum, IsInt} from "class-validator";

export class CreateBookingDto {
  @IsDateString({strict: true, strictSeparator: true})
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

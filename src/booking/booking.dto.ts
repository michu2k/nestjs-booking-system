import {ApiProperty, PartialType, PickType} from "@nestjs/swagger";
import {BookingStatus} from "@prisma/client";
import {IsDateString, IsEnum, IsInt} from "class-validator";

export class CreateBookingDto {
  @IsDateString({strict: true, strictSeparator: true})
  from: Date;

  @IsDateString({strict: true, strictSeparator: true})
  to: Date;

  @IsEnum(BookingStatus)
  @ApiProperty({enum: [BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.CANCELLED]})
  status: BookingStatus;

  @IsInt()
  userId: number;

  @IsInt()
  serviceId: number;
}

export class UpdateBookingDto extends PartialType(PickType(CreateBookingDto, ["from", "to", "status"] as const)) {}

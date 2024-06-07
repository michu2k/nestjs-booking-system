import {ApiProperty, PartialType, PickType} from "@nestjs/swagger";
import {Booking, BookingStatus} from "@prisma/client";
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

export class BookingEntity implements Booking {
  @IsInt()
  id: number;

  @IsDateString({strict: true, strictSeparator: true})
  from: Date;

  @IsDateString({strict: true, strictSeparator: true})
  to: Date;

  @IsEnum(BookingStatus)
  @ApiProperty({enum: [BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.CANCELLED]})
  status: BookingStatus;

  @IsDateString({strict: true, strictSeparator: true})
  createdAt: Date;

  @IsDateString({strict: true, strictSeparator: true})
  updatedAt: Date;

  @IsInt()
  serviceId: number;

  @IsInt()
  userId: number;
}

import {PickType} from "@nestjs/mapped-types";
import {User, UserRole} from "@prisma/client";
import {IsEnum, IsPhoneNumber, IsString, IsArray, IsInt, IsOptional} from "class-validator";

export class UserEntity implements Omit<User, "password"> {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateUserDto extends PickType(UserEntity, ["name", "email", "role"]) {
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  // Currently not supported
  /*   @IsOptional()
  @IsString()
  password?: string; */

  @IsArray()
  account: Omit<CreateAccountDto, "userId">;
}

export class CreateAccountDto {
  @IsString()
  provider: string;

  @IsString()
  providerAccountId: string;

  @IsInt()
  userId: number;
}

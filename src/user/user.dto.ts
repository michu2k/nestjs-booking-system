import {PickType} from "@nestjs/mapped-types";
import {Account, User, UserRole} from "@prisma/client";
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
  account: Pick<AccountEntity, "provider" | "providerAccountId">;
}

export class AccountEntity implements Account {
  @IsInt()
  id: number;

  @IsString()
  provider: string;

  @IsString()
  providerAccountId: string;

  @IsInt()
  userId: number;
}

export class CreateAccountDto extends PickType(AccountEntity, ["provider", "providerAccountId", "userId"]) {}

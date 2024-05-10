import {PickType} from "@nestjs/mapped-types";
import {Account, User, UserRole} from "@prisma/client";
import {IsEnum, IsPhoneNumber, IsString, IsArray, IsInt, IsOptional} from "class-validator";

export class UserEntity implements User {
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

  @IsString()
  @IsOptional()
  refreshToken: string | null;
}

export class CreateUserDto extends PickType(UserEntity, ["name", "email", "role"]) {
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

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

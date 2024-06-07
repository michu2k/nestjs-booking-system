import {ApiProperty, PickType} from "@nestjs/swagger";
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
  @IsOptional()
  phone: string | null;

  @IsEnum(UserRole)
  @ApiProperty({enum: [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]})
  role: UserRole;

  @IsString()
  @IsOptional()
  refreshToken: string | null;
}

export class CreateUserDto extends PickType(UserEntity, ["name", "email", "phone", "role"]) {
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

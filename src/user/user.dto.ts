import { ApiProperty, PickType } from "@nestjs/swagger";
import { Account, User, UserRole } from "@prisma/client";
import { IsArray, IsEnum, IsInt, IsOptional, IsPhoneNumber, IsString } from "class-validator";

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
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @IsString()
  @IsOptional()
  refreshToken: string | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateUserDto extends PickType(UserEntity, ["name", "email", "phone", "role"] as const) {
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

  constructor(partial: Partial<AccountEntity>) {
    Object.assign(this, partial);
  }
}

export class CreateAccountDto extends PickType(AccountEntity, ["provider", "providerAccountId", "userId"] as const) {}

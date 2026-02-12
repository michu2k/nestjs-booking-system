import { Profile } from "passport-google-oauth20";

import { UserRole } from "../prisma/generated/client";
import { AccountEntity, CreateAccountDto, CreateUserDto, UserEntity } from "./user.dto";

export const mockUser: UserEntity = {
  id: 1,
  email: "john.doe@example.com",
  name: "John Doe",
  phone: null,
  refreshToken: "hashedRefreshToken",
  role: UserRole.USER
};

export const mockAdmin: UserEntity = {
  ...mockUser,
  role: UserRole.ADMIN
};

export const mockAccount: AccountEntity = {
  id: 1,
  provider: "google",
  providerAccountId: "123xyzabc",
  userId: 1
};

export const mockGoogleProfile: Profile = {
  id: "123xyzabc",
  provider: "google",
  emails: [{ value: "john.doe@example.com", verified: true }],
  displayName: "John Doe",
  profileUrl: "http://example.com/john-doe",
  _raw: "{}",
  _json: {
    iss: "iss",
    aud: "aud",
    sub: "sub",
    iat: 123,
    exp: 123
  }
};

export const mockCreateUser: CreateUserDto = {
  name: "Allison Doe",
  email: "allison.doe@example.com",
  role: UserRole.USER,
  phone: "555-222-777",
  account: {
    provider: "google",
    providerAccountId: "123xyzabc"
  }
};

export const mockCreateAccount: CreateAccountDto = {
  provider: "google",
  providerAccountId: "123xyzabc",
  userId: 2
};

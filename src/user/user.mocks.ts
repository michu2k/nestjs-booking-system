import {Account, User, UserRole} from "@prisma/client";
import {Profile} from "passport-google-oauth20";

export const mockUser: User = {
  id: 1,
  email: "john.doe@example.com",
  name: "John Doe",
  phone: null,
  refreshToken: "hashedRefreshToken",
  role: UserRole.USER
};

export const mockAdmin: User = {
  ...mockUser,
  role: UserRole.ADMIN
};

export const mockAccount: Account = {
  id: 1,
  provider: "google",
  providerAccountId: "123xyzabc",
  userId: 1
};

export const mockGoogleProfile: Profile = {
  id: "123xyzabc",
  provider: "google",
  emails: [{value: "john.doe@example.com", verified: "true"}],
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

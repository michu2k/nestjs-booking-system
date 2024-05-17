import {Account, User, UserRole} from "@prisma/client";

export const mockUser: User = {
  id: 1,
  email: "john.doe@example.com",
  name: "John Doe",
  phone: "111-222-333",
  refreshToken: "xyzabcxyzabcxyzabc",
  role: UserRole.USER
};

export const mockAccount: Account = {
  id: 1,
  provider: "google",
  providerAccountId: "123xyzabc",
  userId: 1
};

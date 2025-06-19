import { Test } from "@nestjs/testing";

import { PrismaService } from "../prisma/prisma.service";
import { mockAccount, mockCreateAccount, mockCreateUser, mockUser } from "./user.mocks";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UserService, PrismaService]
    }).compile();

    service = moduleRef.get(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOneUser", () => {
    it("should get a user", async () => {
      const findOneUserSpy = jest.spyOn(service, "findOneUser").mockResolvedValue(mockUser);
      const result = await service.findOneUser({ id: mockUser.id });

      expect(findOneUserSpy).toHaveBeenCalledWith({ id: mockUser.id });
      expect(result).toEqual(mockUser);
    });
  });

  describe("createUserAccount", () => {
    it("should create an account", async () => {
      const mockCreatedUser = { ...mockUser, mockCreateUser };
      const createUserAccountSpy = jest.spyOn(service, "createUserAccount").mockResolvedValue(mockCreatedUser);
      const result = await service.createUserAccount(mockCreateUser);

      expect(createUserAccountSpy).toHaveBeenCalledWith(mockCreateUser);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe("createSSOProviderAccount", () => {
    it("should create a SSO provider account", async () => {
      const mockCreatedAccount = { ...mockAccount, ...mockCreateAccount };
      const createProviderAccountSpy = jest
        .spyOn(service, "createSSOProviderAccount")
        .mockResolvedValue(mockCreatedAccount);
      const providerAccount = await service.createSSOProviderAccount(mockCreateAccount);

      expect(createProviderAccountSpy).toHaveBeenLastCalledWith(mockCreateAccount);
      expect(providerAccount).toEqual(mockCreatedAccount);
    });
  });

  describe("deleteUserAccount", () => {
    it("should delete a user", async () => {
      const deleteUserAccountSpy = jest.spyOn(service, "deleteUserAccount").mockResolvedValue(mockUser);
      const result = await service.deleteUserAccount(mockUser.id);

      expect(deleteUserAccountSpy).toHaveBeenLastCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });
  });

  describe("updateUserRefreshToken", () => {
    it("should update user token", async () => {
      const newRefreshToken = "new-refresh-token";
      const updateUserRefreshTokenSpy = jest.spyOn(service, "updateUserRefreshToken").mockResolvedValue(mockUser);
      const result = await service.updateUserRefreshToken(mockUser.id, newRefreshToken);

      expect(updateUserRefreshTokenSpy).toHaveBeenLastCalledWith(mockUser.id, newRefreshToken);
      expect(result).toEqual(mockUser);
    });
  });
});

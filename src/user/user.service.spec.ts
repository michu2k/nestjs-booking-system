import {Test, TestingModule} from "@nestjs/testing";
import {UserRole} from "@prisma/client";
import {PrismaService} from "../prisma/prisma.service";
import {UserService} from "./user.service";
import {mockAccount, mockUser} from "./user.mocks";
import {CreateAccountDto, CreateUserDto} from "./user.dto";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOneUser", () => {
    it("should get a user", async () => {
      const findOneUserSpy = jest.spyOn(service, "findOneUser").mockResolvedValue(mockUser);
      const result = await service.findOneUser({id: mockUser.id});

      expect(findOneUserSpy).toHaveBeenCalledWith({id: mockUser.id});
      expect(result).toEqual(mockUser);
    });
  });

  describe("createUserAccount", () => {
    it("should create an account", async () => {
      const createUserDto: CreateUserDto = {
        name: "Allison Doe",
        email: "allison.doe@example.com",
        role: UserRole.USER,
        phone: "555-222-777",
        account: {
          provider: "google",
          providerAccountId: "123xyzabc"
        }
      };
      const mockCreatedUser = {...mockUser, createUserDto};
      const createUserAccountSpy = jest.spyOn(service, "createUserAccount").mockResolvedValue(mockCreatedUser);
      const result = await service.createUserAccount(createUserDto);

      expect(createUserAccountSpy).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe("createSSOProviderAccount", () => {
    it("should create a SSO provider account", async () => {
      const createAccountDto: CreateAccountDto = {
        provider: "google",
        providerAccountId: "123xyzabc",
        userId: 2
      };
      const mockCreatedAccount = {...mockAccount, ...createAccountDto};
      const createProviderAccountSpy = jest
        .spyOn(service, "createSSOProviderAccount")
        .mockResolvedValue(mockCreatedAccount);
      const providerAccount = await service.createSSOProviderAccount(createAccountDto);

      expect(createProviderAccountSpy).toHaveBeenLastCalledWith(createAccountDto);
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

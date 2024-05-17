import {Test, TestingModule} from "@nestjs/testing";
import {UserRole} from "@prisma/client";
import {PrismaModule} from "../prisma/prisma.module";
import {UserService} from "./user.service";
import {mockAccount, mockUser} from "./user.mocks";
import {CreateAccountDto, CreateUserDto} from "./user.dto";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UserService]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findOneUser", () => {
    it("should get a user", async () => {
      const findOneUserSpy = jest.spyOn(service, "findOneUser").mockResolvedValue(mockUser);

      const user = await service.findOneUser({id: mockUser.id});

      expect(findOneUserSpy).toHaveBeenCalledWith({id: mockUser.id});
      expect(user).toEqual(mockUser);
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

      const createUserAccountResult = {...mockUser, createUserDto};
      const createUserAccountSpy = jest.spyOn(service, "createUserAccount").mockResolvedValue(createUserAccountResult);

      const user = await service.createUserAccount(createUserDto);

      expect(createUserAccountSpy).toHaveBeenCalledWith(createUserDto);
      expect(user).toEqual(createUserAccountResult);
    });
  });

  describe("createSSOProviderAccount", () => {
    it("should create a SSO provider account", async () => {
      const createAccountDto: CreateAccountDto = {
        provider: "google",
        providerAccountId: "123xyzabc",
        userId: 2
      };

      const createProviderAccountResult = {...mockAccount, ...createAccountDto};
      const createProviderAccountSpy = jest
        .spyOn(service, "createSSOProviderAccount")
        .mockResolvedValue(createProviderAccountResult);

      const providerAccount = await service.createSSOProviderAccount(createAccountDto);

      expect(createProviderAccountSpy).toHaveBeenLastCalledWith(createAccountDto);
      expect(providerAccount).toEqual(createProviderAccountResult);
    });
  });

  describe("deleteUserAccount", () => {
    it("should delete a user", async () => {
      const deleteUserAccountSpy = jest.spyOn(service, "deleteUserAccount").mockResolvedValue(mockUser);

      const user = await service.deleteUserAccount(mockUser.id);

      expect(deleteUserAccountSpy).toHaveBeenLastCalledWith(mockUser.id);
      expect(user).toEqual(mockUser);
    });
  });

  describe("updateUserRefreshToken", () => {
    it("should update user token", async () => {
      const updateUserRefreshTokenSpy = jest.spyOn(service, "updateUserRefreshToken").mockResolvedValue(mockUser);

      const user = await service.updateUserRefreshToken(mockUser.id, "new-refresh-token");

      expect(updateUserRefreshTokenSpy).toHaveBeenLastCalledWith(mockUser.id, "new-refresh-token");
      expect(user).toEqual(mockUser);
    });
  });
});

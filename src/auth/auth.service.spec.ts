import {Test, TestingModule} from "@nestjs/testing";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "../prisma/prisma.service";
import {UserService} from "../user/user.service";
import {AuthService} from "./auth.service";
import {mockAccount, mockGoogleProfile, mockUser} from "../user/user.mocks";
import {mockAuthToken} from "./auth.mocks";
import {BadRequestException, UnauthorizedException} from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService, ConfigService, UserService]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("checkIfProviderAccountExists", () => {
    it("should return provider account", async () => {
      const checkIfProviderAccountExistsSpy = jest
        .spyOn(service, "checkIfProviderAccountExists")
        .mockResolvedValue(mockAccount);

      const result = await service.checkIfProviderAccountExists(mockUser.id, mockGoogleProfile);

      expect(result).toEqual(mockAccount);
      expect(checkIfProviderAccountExistsSpy).toHaveBeenCalledWith(mockUser.id, mockGoogleProfile);
    });
  });

  describe("generateAuthTokens", () => {
    let generateAuthTokensSpy: jest.SpyInstance;

    beforeEach(() => {
      generateAuthTokensSpy = jest.spyOn(service, "generateAuthTokens");
    });

    it("should generate auth tokens and update user's token", async () => {
      generateAuthTokensSpy.mockResolvedValue({
        accessToken: mockAuthToken,
        refreshToken: mockAuthToken
      });

      const result = await service.generateAuthTokens(mockUser);

      expect(generateAuthTokensSpy).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({
        accessToken: mockAuthToken,
        refreshToken: mockAuthToken
      });
    });

    it("should throw an error if the user refresh token can't be updated", async () => {
      generateAuthTokensSpy.mockRejectedValue(new BadRequestException());

      try {
        await service.generateAuthTokens(mockUser);
      } catch (e) {
        expect(e).toEqual(new BadRequestException());
      }
    });
  });

  describe("refreshAuthTokens", () => {
    let refreshAuthTokensSpy: jest.SpyInstance;

    beforeEach(() => {
      refreshAuthTokensSpy = jest.spyOn(service, "refreshAuthTokens");
    });

    it("should refresh auth tokens", async () => {
      refreshAuthTokensSpy.mockResolvedValue({
        accessToken: mockAuthToken,
        refreshToken: mockAuthToken
      });

      const result = await service.refreshAuthTokens(mockUser, mockAuthToken);

      expect(refreshAuthTokensSpy).toHaveBeenCalledWith(mockUser, mockAuthToken);
      expect(result).toEqual({
        accessToken: mockAuthToken,
        refreshToken: mockAuthToken
      });
    });

    it("should throw an error if refreshToken is invalid", async () => {
      refreshAuthTokensSpy.mockRejectedValue(new UnauthorizedException());

      try {
        await service.refreshAuthTokens(mockUser, mockAuthToken);
      } catch (e) {
        expect(e).toEqual(new UnauthorizedException());
      }
    });
  });
});

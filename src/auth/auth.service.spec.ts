import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { Response } from "express";

import { PrismaService } from "../prisma/prisma.service";
import { mockAccount, mockGoogleProfile, mockUser } from "../user/user.mocks";
import { UserService } from "../user/user.service";
import { ServiceErrorCode } from "../utils/service-error";
import { mockAuthAccessTokens, mockAuthToken } from "./auth.mocks";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let storedHash: string | null;

  const mockPrismaService = {
    account: {
      findFirst: jest.fn()
    }
  };

  const mockUserService = {
    updateUserRefreshToken: jest.fn()
  };

  const mockConfigService = new ConfigService({
    ACCESS_TOKEN: "access-cookie",
    ACCESS_TOKEN_VALIDITY: 600000,
    REFRESH_TOKEN: "refresh-cookie",
    REFRESH_TOKEN_VALIDITY: 604800000,
    JWT_SECRET: "test-secret",
    JWT_REFRESH_SECRET: "test-refresh-secret"
  });

  const loggedInUser = () => ({ ...mockUser, refreshToken: storedHash });

  const hashRefreshToken = (token: string) => service["hashRefreshToken"](token);

  beforeEach(async () => {
    // Fake timers are enabled globally, and they block jsonwebtoken's async signing callback
    jest.useRealTimers();
    jest.resetAllMocks();

    storedHash = null;
    mockUserService.updateUserRefreshToken.mockImplementation(async (_id: number, hash: string) => {
      storedHash = hash;
      return { ...mockUser, refreshToken: hash };
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: UserService, useValue: mockUserService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: JwtService, useValue: new JwtService({ secret: "test-secret" }) }
      ]
    }).compile();

    service = moduleRef.get(AuthService);
    jwtService = moduleRef.get(JwtService);
  });

  describe("checkIfProviderAccountExists", () => {
    it("should find the user's account for the provider", async () => {
      mockPrismaService.account.findFirst.mockResolvedValue(mockAccount);

      const result = await service.checkIfProviderAccountExists(mockUser.id, mockGoogleProfile);

      expect(mockPrismaService.account.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          provider: mockGoogleProfile.provider,
          providerAccountId: mockGoogleProfile.id
        }
      });
      expect(result).toEqual(mockAccount);
    });

    it("should return null when the account doesn't exist", async () => {
      mockPrismaService.account.findFirst.mockResolvedValue(null);

      await expect(service.checkIfProviderAccountExists(mockUser.id, mockGoogleProfile)).resolves.toBeNull();
    });
  });

  describe("generateAuthTokens", () => {
    it("should sign both tokens for the user", async () => {
      const { accessToken, refreshToken } = await service.generateAuthTokens(mockUser);

      await expect(
        jwtService.verifyAsync(accessToken, { secret: mockConfigService.get("JWT_SECRET") })
      ).resolves.toMatchObject({
        sub: mockUser.id,
        email: mockUser.email
      });
      await expect(
        jwtService.verifyAsync(refreshToken, { secret: mockConfigService.get("JWT_REFRESH_SECRET") })
      ).resolves.toMatchObject({
        sub: mockUser.id,
        email: mockUser.email
      });
    });

    it("should store a SHA-256 hash of the refresh token, not the token itself", async () => {
      const { refreshToken } = await service.generateAuthTokens(mockUser);

      expect(mockUserService.updateUserRefreshToken).toHaveBeenCalledWith(mockUser.id, hashRefreshToken(refreshToken));
      expect(storedHash).toMatch(/^[0-9a-f]{64}$/);
      expect(storedHash).not.toEqual(refreshToken);
    });

    it("should issue a different refresh token on every call", async () => {
      const first = await service.generateAuthTokens(mockUser);
      const second = await service.generateAuthTokens(mockUser);

      expect(first.refreshToken).not.toEqual(second.refreshToken);
    });
  });

  describe("refreshAuthTokens", () => {
    it("should issue new tokens for the latest refresh token", async () => {
      const { refreshToken } = await service.generateAuthTokens(mockUser);

      const result = await service.refreshAuthTokens(loggedInUser(), refreshToken);

      expect(result.refreshToken).not.toEqual(refreshToken);
      expect(storedHash).toEqual(hashRefreshToken(result.refreshToken));
    });

    it("should reject a refresh token that has already been rotated", async () => {
      const { refreshToken: oldToken } = await service.generateAuthTokens(mockUser);
      await service.refreshAuthTokens(loggedInUser(), oldToken);

      await expect(service.refreshAuthTokens(loggedInUser(), oldToken)).rejects.toMatchObject({
        code: ServiceErrorCode.UNAUTHORIZED
      });
    });

    it("should reject a token when the user has no stored hash", async () => {
      await expect(service.refreshAuthTokens(loggedInUser(), mockAuthToken)).rejects.toMatchObject({
        code: ServiceErrorCode.UNAUTHORIZED
      });
      expect(mockUserService.updateUserRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("revokeRefreshToken", () => {
    it("should clear the stored hash so the refresh token is rejected", async () => {
      const { refreshToken } = await service.generateAuthTokens(mockUser);

      await service.revokeRefreshToken(mockUser.id);

      expect(storedHash).toBeNull();
      await expect(service.refreshAuthTokens(loggedInUser(), refreshToken)).rejects.toMatchObject({
        code: ServiceErrorCode.UNAUTHORIZED
      });
    });
  });

  describe("setAuthCookies", () => {
    it("should set both tokens as secure HTTP-only cookies", () => {
      const res = { cookie: jest.fn() } as unknown as Response;

      service.setAuthCookies(res, mockAuthAccessTokens);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.cookie).toHaveBeenCalledWith(
        mockConfigService.get("ACCESS_TOKEN"),
        mockAuthAccessTokens.accessToken,
        expect.objectContaining({
          maxAge: mockConfigService.get("ACCESS_TOKEN_VALIDITY")
        })
      );
      expect(res.cookie).toHaveBeenCalledWith(
        mockConfigService.get("REFRESH_TOKEN"),
        mockAuthAccessTokens.refreshToken,
        expect.objectContaining({
          maxAge: mockConfigService.get("REFRESH_TOKEN_VALIDITY")
        })
      );
    });
  });
});

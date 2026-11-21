import { HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Request, Response } from "express";

import { mockUser } from "../user/user.mocks";
import { AuthController } from "./auth.controller";
import { mockAuthAccessTokens } from "./auth.mocks";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  const config: Record<string, string> = {
    ACCESS_TOKEN: "access-cookie",
    REFRESH_TOKEN: "refresh-cookie",
    AUTH_REDIRECT_URL: "http://localhost:3000/dashboard"
  };

  const mockConfigService = {
    get: jest.fn((key: string) => config[key])
  };

  const mockAuthService = {
    generateAuthTokens: jest.fn(),
    refreshAuthTokens: jest.fn(),
    setAuthCookies: jest.fn()
  };

  type MockResponse = Record<"status" | "send" | "redirect" | "clearCookie", jest.Mock>;
  let res: MockResponse;

  const createResponse = (): MockResponse => {
    const response: MockResponse = {
      status: jest.fn(),
      send: jest.fn(),
      redirect: jest.fn(),
      clearCookie: jest.fn()
    };

    response.status.mockReturnValue(response);
    response.clearCookie.mockReturnValue(response);

    return response;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockAuthService.generateAuthTokens.mockResolvedValue(mockAuthAccessTokens);
    mockAuthService.refreshAuthTokens.mockResolvedValue(mockAuthAccessTokens);
    res = createResponse();

    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
      controllers: [AuthController]
    }).compile();

    controller = moduleRef.get(AuthController);
    authService = moduleRef.get(AuthService);
  });

  describe("googleAuthRedirect", () => {
    it("should set auth cookies and redirect to the configured URL", async () => {
      await controller.googleAuthRedirect(res as unknown as Response, mockUser);

      expect(authService.generateAuthTokens).toHaveBeenCalledWith(mockUser);
      expect(authService.setAuthCookies).toHaveBeenCalledWith(res, mockAuthAccessTokens);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.redirect).toHaveBeenCalledWith(config.AUTH_REDIRECT_URL);
    });
  });

  describe("refresh", () => {
    const refreshTokenCookie = "refresh-token-from-cookie";
    const req = { cookies: { [config.REFRESH_TOKEN]: refreshTokenCookie } } as unknown as Request;

    it("should refresh tokens using the refresh token cookie", async () => {
      await controller.refresh(res as unknown as Response, req, mockUser);

      expect(authService.refreshAuthTokens).toHaveBeenCalledWith(mockUser, refreshTokenCookie);
      expect(authService.setAuthCookies).toHaveBeenCalledWith(res, mockAuthAccessTokens);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });

    it("should propagate errors and not set cookies when refresh fails", async () => {
      const error = new UnauthorizedException("Invalid refresh token");
      mockAuthService.refreshAuthTokens.mockRejectedValueOnce(error);

      await expect(controller.refresh(res as unknown as Response, req, mockUser)).rejects.toBe(error);
      expect(authService.setAuthCookies).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear cookies", () => {
      controller.logout(res as unknown as Response);

      expect(res.clearCookie).toHaveBeenCalledTimes(2);
      expect(res.clearCookie).toHaveBeenCalledWith(config.ACCESS_TOKEN);
      expect(res.clearCookie).toHaveBeenCalledWith(config.REFRESH_TOKEN);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });
  });
});

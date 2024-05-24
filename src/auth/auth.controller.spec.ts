import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import {Request, Response} from "express";
import {AuthController} from "./auth.controller";
import {AuthService} from "./auth.service";
import {mockUser} from "../user/user.mocks";
import {mockAuthAccessTokens} from "./auth.mocks";

describe("AuthController", () => {
  let controller: AuthController;
  let configService: ConfigService;
  let authService: AuthService;

  const mockConfigService = {
    get: jest.fn().mockResolvedValue("value")
  };

  const mockAuthService = {
    generateAuthTokens: jest.fn().mockResolvedValue(mockAuthAccessTokens),
    refreshAuthTokens: jest.fn().mockResolvedValue(mockAuthAccessTokens)
  };

  const mockResponse = {
    status: jest.fn().mockReturnValue({send: jest.fn(), redirect: jest.fn()}),
    json: jest.fn().mockReturnValue({}),
    clearCookie: jest.fn().mockReturnValue({}),
    cookie: jest.fn().mockReturnValue({})
  } as unknown as Response;

  const mockRequest = {
    cookies: jest.fn().mockReturnValue({})
  } as unknown as Request;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    controller = module.get<AuthController>(AuthController);
    configService = module.get<ConfigService>(ConfigService);
    authService = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("authService should be defined", () => {
    expect(authService).toBeDefined();
  });

  it("configService should be defined", () => {
    expect(configService).toBeDefined();
  });

  describe("google provider", () => {
    it("should generate auth tokens", async () => {
      await controller.googleAuthRedirect(mockResponse, mockUser);

      expect(authService.generateAuthTokens).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });
  });

  describe("refresh", () => {
    it("should refresh auth token", async () => {
      await controller.refresh(mockResponse, mockRequest, mockUser);

      expect(configService.get).toHaveBeenCalled();
      expect(authService.refreshAuthTokens).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should clear tokens", () => {
      controller.logout(mockResponse);

      expect(configService.get).toHaveBeenCalled();
    });
  });
});

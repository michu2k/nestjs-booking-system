import {ConfigService} from "@nestjs/config";
import {Response} from "express";

export type JwtPayload = {
  sub: number;
  email: string;
};

type CreateAuthCookiesArgs = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

/**
 * Generate authorization cookies
 */
export function createAuthCookies({res, accessToken, refreshToken}: CreateAuthCookiesArgs) {
  const configService = new ConfigService();

  const accessTokenCookie = configService.get("ACCESS_TOKEN");
  const accessTokenMaxAge = configService.get("ACCESS_TOKEN_VALIDITY");

  res.cookie(accessTokenCookie, accessToken, {
    maxAge: accessTokenMaxAge,
    httpOnly: true,
    secure: true,
    sameSite: "lax"
  });

  const refreshTokenCookie = configService.get("REFRESH_TOKEN");
  const refreshTokenMaxAge = configService.get("REFRESH_TOKEN_VALIDITY");

  res.cookie(refreshTokenCookie, refreshToken, {
    maxAge: refreshTokenMaxAge,
    httpOnly: true,
    secure: true,
    sameSite: "lax"
  });
}

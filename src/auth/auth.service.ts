import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomUUID, timingSafeEqual } from "crypto";
import { Response } from "express";
import { Profile } from "passport-google-oauth20";

import { PrismaService } from "../prisma/prisma.service";
import { UserEntity } from "../user/user.dto";
import { UserService } from "../user/user.service";
import { getErrorMessage } from "../utils/get-error-message";
import { ServiceError, ServiceErrorCode } from "../utils/service-error";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    protected configService: ConfigService
  ) {}

  /**
   * Check if the user account exists in the database
   */
  async checkIfProviderAccountExists(userId: number, { id, provider }: Profile) {
    return this.prisma.account.findFirst({
      where: {
        userId,
        provider,
        providerAccountId: id
      }
    });
  }

  /**
   * Generate JWT tokens for the user
   */
  async generateAuthTokens({ id, email }: UserEntity) {
    const payload = { sub: id, email };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get("ACCESS_TOKEN_VALIDITY")
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get("REFRESH_TOKEN_VALIDITY"),
      jwtid: randomUUID() // unique id to make every refresh token different
    });

    const hashedRefreshToken = this.hashRefreshToken(refreshToken);

    try {
      await this.userService.updateUserRefreshToken(id, hashedRefreshToken);

      return {
        accessToken,
        refreshToken
      };
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, "Failed to update user's token");
    }
  }

  /**
   * Refresh authorization tokens by comparing the cookie token and the user's token
   */
  async refreshAuthTokens(user: UserEntity, refreshToken: string) {
    if (!refreshToken || !user.refreshToken || !this.isRefreshTokenMatched(refreshToken, user.refreshToken)) {
      throw new ServiceError(ServiceErrorCode.UNAUTHORIZED, "Invalid refresh token");
    }

    const authTokens = await this.generateAuthTokens(user);

    return authTokens;
  }

  /**
   * Revoke the user's refresh token so it can no longer be used
   */
  async revokeRefreshToken(userId: number) {
    try {
      await this.userService.updateUserRefreshToken(userId, null);
    } catch (e) {
      console.error(getErrorMessage(e));
      throw new ServiceError(ServiceErrorCode.BAD_REQUEST, "Failed to revoke user's token");
    }
  }

  /**
   * Set the access and refresh tokens as HTTP-only cookies
   */
  setAuthCookies(res: Response, { accessToken, refreshToken }: { accessToken: string; refreshToken: string }) {
    const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax" } as const;

    const accessTokenCookie = this.configService.get("ACCESS_TOKEN");
    const accessTokenMaxAge = this.configService.get("ACCESS_TOKEN_VALIDITY");

    res.cookie(accessTokenCookie, accessToken, {
      maxAge: accessTokenMaxAge,
      ...cookieOptions
    });

    const refreshTokenCookie = this.configService.get("REFRESH_TOKEN");
    const refreshTokenMaxAge = this.configService.get("REFRESH_TOKEN_VALIDITY");

    res.cookie(refreshTokenCookie, refreshToken, {
      maxAge: refreshTokenMaxAge,
      ...cookieOptions
    });
  }

  /**
   * Hash a refresh token with SHA-256.
   */
  private hashRefreshToken(refreshToken: string) {
    return createHash("sha256").update(refreshToken).digest("hex");
  }

  /**
   * Compare a refresh token with the stored hash
   */
  private isRefreshTokenMatched(refreshToken: string, storedHash: string) {
    const tokenHash = Buffer.from(this.hashRefreshToken(refreshToken), "hex");
    const expectedHash = Buffer.from(storedHash, "hex");

    return tokenHash.length === expectedHash.length && timingSafeEqual(tokenHash, expectedHash);
  }
}
